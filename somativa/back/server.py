import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse
import json
import mysql.connector
from decimal import Decimal
import datetime

# --- NOVAS IMPORTAÇÕES ---
import hashlib # Para senhas
import jwt       # Para tokens de autenticação
import time      # Para o tempo de expiração do token
# -------------------------

# --- CONSTANTES ---
# Mude isso em produção! Mantenha em segredo.
JWT_SECRET = "MINHA_CHAVE_SECRETA_E_MUITO_FORTE_123456"

# --- FUNÇÕES AUXILIARES ---

def json_converter(o):
    if isinstance(o, Decimal):
        return str(o)
    if isinstance(o, datetime.timedelta):
        total_seconds = int(o.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f'{hours:02}:{minutes:02}:{seconds:02}'

def conectar_banco():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="root", # ATENÇÃO: Use variáveis de ambiente em produção
            database="filminis"
        )
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao banco de dados: {err}")
        return None

# --- NOVA FUNÇÃO ---
def hash_senha(senha):
    """Cria um hash SHA-256 da senha."""
    return hashlib.sha256(senha.encode('utf-8')).hexdigest()

def get_or_create_id(cursor, table_name, column_name, value):
    if not value or not value.strip():
        return None
    
    if table_name in ['Diretor', 'Ator']:
        parts = value.strip().split(' ', 1)
        nome = parts[0]
        sobrenome = parts[1] if len(parts) > 1 else ''
        cursor.execute(f"SELECT id_{table_name.lower()} FROM {table_name} WHERE nome = %s AND sobrenome = %s", (nome, sobrenome))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            cursor.execute(f"INSERT INTO {table_name} (nome, sobrenome) VALUES (%s, %s)", (nome, sobrenome))
            return cursor.lastrowid
    else:
        stripped_value = value.strip()
        cursor.execute(f"SELECT id_{table_name.lower()} FROM {table_name} WHERE {column_name} = %s", (stripped_value,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            cursor.execute(f"INSERT INTO {table_name} ({column_name}) VALUES (%s)", (stripped_value,))
            return cursor.lastrowid

# --- FUNÇÕES DE BANCO DE DADOS PRINCIPAIS ---

# 👇 --- FUNÇÃO ATUALIZADA --- 👇
# Agora só lista filmes APROVADOS
def listar_filmes_banco(search_term=None):
    conexao = conectar_banco()
    if not conexao: return []
    cursor = conexao.cursor(dictionary=True)
    
    params = []
    
    # MODIFICADO: Adicionada cláusula "WHERE f.status = 'aprovado'"
    query = """
        SELECT 
            f.id_filme, f.titulo, f.ano, f.poster, f.sinopse, f.tempo_de_duracao, f.orcamento,
            GROUP_CONCAT(DISTINCT CONCAT(d.nome, ' ', d.sobrenome) SEPARATOR ', ') as diretores,
            GROUP_CONCAT(DISTINCT CONCAT(a.nome, ' ', a.sobrenome) SEPARATOR ', ') as atores,
            GROUP_CONCAT(DISTINCT g.genero SEPARATOR ', ') as generos,
            GROUP_CONCAT(DISTINCT p.produtora SEPARATOR ', ') as produtoras
        FROM Filme f
        LEFT JOIN Filme_diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor
        LEFT JOIN Filme_ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN Ator a ON fa.id_ator = a.id_ator
        LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN Genero g ON fg.id_genero = g.id_genero
        LEFT JOIN Filme_produtora fp ON f.id_filme = fp.id_filme
        LEFT JOIN Produtora p ON fp.id_produtora = p.id_produtora
        WHERE f.status = 'aprovado'  -- <<< MODIFICAÇÃO AQUI
        GROUP BY f.id_filme
    """

    if search_term:
        query += """
            HAVING f.titulo LIKE %s
            OR diretores LIKE %s
            OR atores LIKE %s
            OR generos LIKE %s
            OR produtoras LIKE %s
            OR f.sinopse LIKE %s
        """
        like_term = f"%{search_term}%"
        params = [like_term] * 6

    query += ";"
    
    cursor.execute(query, params)
    filmes = cursor.fetchall()
    cursor.close()
    conexao.close()
    return filmes

# --- NOVA FUNÇÃO ---
# Lista apenas filmes PENDENTES (para o admin)
def listar_filmes_pendentes_banco():
    conexao = conectar_banco()
    if not conexao: return []
    cursor = conexao.cursor(dictionary=True)
    
    query = """
        SELECT 
            f.id_filme, f.titulo, f.ano, f.poster, f.sinopse, f.tempo_de_duracao, f.orcamento,
            GROUP_CONCAT(DISTINCT CONCAT(d.nome, ' ', d.sobrenome) SEPARATOR ', ') as diretores,
            GROUP_CONCAT(DISTINCT CONCAT(a.nome, ' ', a.sobrenome) SEPARATOR ', ') as atores,
            GROUP_CONCAT(DISTINCT g.genero SEPARATOR ', ') as generos,
            GROUP_CONCAT(DISTINCT p.produtora SEPARATOR ', ') as produtoras
        FROM Filme f
        LEFT JOIN Filme_diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor
        LEFT JOIN Filme_ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN Ator a ON fa.id_ator = a.id_ator
        LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN Genero g ON fg.id_genero = g.id_genero
        LEFT JOIN Filme_produtora fp ON f.id_filme = fp.id_filme
        LEFT JOIN Produtora p ON fp.id_produtora = p.id_produtora
        WHERE f.status = 'pendente'  -- <<< FILTRA POR PENDENTE
        GROUP BY f.id_filme;
    """
    
    cursor.execute(query)
    filmes = cursor.fetchall()
    cursor.close()
    conexao.close()
    return filmes

def buscar_filme_por_id(filme_id):
    conexao = conectar_banco()
    if not conexao: return None
    cursor = conexao.cursor(dictionary=True)

    # Esta query não precisa de filtro de status, pois um admin
    # pode querer buscar um filme pendente para editá-lo.
    query = """
        SELECT 
            f.id_filme, f.titulo, f.ano, f.poster, f.sinopse, f.tempo_de_duracao, f.orcamento,
            GROUP_CONCAT(DISTINCT CONCAT(d.nome, ' ', d.sobrenome) SEPARATOR ', ') as diretores,
            GROUP_CONCAT(DISTINCT CONCAT(a.nome, ' ', a.sobrenome) SEPARATOR ', ') as atores,
            GROUP_CONCAT(DISTINCT g.genero SEPARATOR ', ') as generos,
            GROUP_CONCAT(DISTINCT p.produtora SEPARATOR ', ') as produtoras
        FROM Filme f
        LEFT JOIN Filme_diretor fd ON f.id_filme = fd.id_filme
        LEFT JOIN Diretor d ON fd.id_diretor = d.id_diretor
        LEFT JOIN Filme_ator fa ON f.id_filme = fa.id_filme
        LEFT JOIN Ator a ON fa.id_ator = a.id_ator
        LEFT JOIN Filme_Genero fg ON f.id_filme = fg.id_filme
        LEFT JOIN Genero g ON fg.id_genero = g.id_genero
        LEFT JOIN Filme_produtora fp ON f.id_filme = fp.id_filme
        LEFT JOIN Produtora p ON fp.id_produtora = p.id_produtora
        WHERE f.id_filme = %s
        GROUP BY f.id_filme;
    """
    cursor.execute(query, (filme_id,))
    filme = cursor.fetchone()
    cursor.close()
    conexao.close()
    return filme

# --- HANDLER HTTP (COM CORREÇÃO DE CORS) ---

class MyHandle(SimpleHTTPRequestHandler):

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:5173')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        # MODIFICADO: Permitir o header 'Authorization'
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    # --- NOVAS FUNÇÕES DE AUTENTICAÇÃO ---
    def validar_token(self, tipo_requerido=None):
        """
        Valida o token JWT do header 'Authorization'.
        Retorna o payload (dados do usuário) se válido.
        Retorna None se inválido ou ausente.
        Se 'tipo_requerido' ('admin' ou 'comum') for fornecido,
        também valida o tipo de usuário.
        """
        try:
            auth_header = self.headers.get('Authorization')
            if not auth_header:
                self._send_json_error(401, "Header 'Authorization' ausente.")
                return None
            
            token_type, token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                self._send_json_error(401, "Tipo de token inválido. Use 'Bearer'.")
                return None

            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            
            # Verifica o tipo de usuário se requerido
            if tipo_requerido and payload.get('tipo') != tipo_requerido:
                self._send_json_error(403, "Acesso negado. Permissão insuficiente.")
                return None
                
            return payload

        except jwt.ExpiredSignatureError:
            self._send_json_error(401, "Token expirado.")
            return None
        except jwt.InvalidTokenError:
            self._send_json_error(401, "Token inválido.")
            return None
        except Exception as e:
            self._send_json_error(400, f"Erro na validação do token: {e}")
            return None

    def handle_login(self, data):
        """Cuida da lógica de login."""
        email = data.get('email')
        senha = data.get('senha')
        
        if not email or not senha:
            self._send_json_error(400, "Email e senha são obrigatórios.")
            return

        senha_hasheada = hash_senha(senha)

        print("\n--- DEBUG LOGIN ---")
        print(f"EMAIL RECEBIDO: {email}")
        print(f"SENHA RECEBIDA: {senha}")
        print(f"HASH CALCULADO AGORA: {senha_hasheada}")
        print("--- FIM DEBUG ---\n")
        
        conexao = conectar_banco()
        if not conexao:
            self._send_json_error(500, "Erro ao conectar ao banco.")
            return
            
        cursor = conexao.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, email, tipo_usuario FROM Usuario WHERE email = %s AND senha_hash = %s", (email, senha_hasheada))
        usuario = cursor.fetchone()
        cursor.close()
        conexao.close()
        
        if usuario:
            # Usuário autenticado! Gerar token.
            payload = {
                'id_usuario': usuario['id_usuario'],
                'email': usuario['email'],
                'tipo': usuario['tipo_usuario'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8) # Token expira em 8 horas
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
            
            response = {
                'message': 'Login bem-sucedido!',
                'token': token,
                'user': {
                    'email': usuario['email'],
                    'tipo': usuario['tipo_usuario']
                }
            }
            self.send_response(200)
            self.send_header("Content-type", "application/json; charset=utf-8")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        else:
            # Credenciais inválidas
            self._send_json_error(401, "Email ou senha inválidos.")
            
    # --- FIM DAS NOVAS FUNÇÕES ---

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        if path == '/listarfilmes':
            search_term = query_params.get('search', [None])[0]
            # Esta função agora só retorna filmes aprovados
            filmes = listar_filmes_banco(search_term) 
            self.send_response(200)
            self.send_header("Content-type", "application/json; charset=utf-8")
            self._send_cors_headers() 
            self.end_headers()
            self.wfile.write(json.dumps(filmes, default=json_converter, ensure_ascii=False).encode('utf-8'))
            return
        
        # --- NOVO ENDPOINT ---
        elif path == '/filmespendentes':
            # Valida se o usuário é admin
            user_payload = self.validar_token(tipo_requerido='admin')
            if not user_payload:
                return # Erro já foi enviado por validar_token

            filmes = listar_filmes_pendentes_banco()
            self.send_response(200)
            self.send_header("Content-type", "application/json; charset=utf-8")
            self._send_cors_headers() 
            self.end_headers()
            self.wfile.write(json.dumps(filmes, default=json_converter, ensure_ascii=False).encode('utf-8'))
            return
        
        elif path == '/getfilme':
            filme_id = query_params.get('id', [None])[0]
            if filme_id:
                filme = buscar_filme_por_id(filme_id)
                self.send_response(200)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(filme, default=json_converter, ensure_ascii=False).encode('utf-8'))
            else:
                self._send_json_error(400, "ID do filme não fornecido")
            return
        
        else:
            super().do_GET()


    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self._send_json_error(400, "Corpo da requisição inválido. Esperado JSON.")
            return

        path = self.path
        conexao = None
        cursor = None

        # --- NOVO ENDPOINT DE LOGIN ---
        if path == '/login':
            self.handle_login(data)
            return
        
        # --- ENDPOINT MODIFICADO ---
        elif path == '/sendcadastro':
            # REQUER AUTENTICAÇÃO (qualquer tipo)
            user_payload = self.validar_token()
            if not user_payload:
                return # Erro já foi enviado

            try:
                titulo = data.get('titulo', "")
                poster = data.get('poster', "")
                atores_str = data.get('atores', "")
                diretor_nome = data.get('diretor', "")
                ano_str = str(data.get('ano', ""))
                duracao_min_str = str(data.get('duracao', "0"))
                orcamento_str = str(data.get('orcamento', "0.00"))
                generos_str = data.get('genero', "") 
                produtora_nome = data.get('produtora', "")
                sinopse = data.get('sinopse', "")

                # MODIFICAÇÃO: Define o status baseado no tipo de usuário
                status_filme = 'aprovado' if user_payload.get('tipo') == 'admin' else 'pendente'

                ano = int(ano_str) if ano_str.isdigit() else None
                orcamento = Decimal(orcamento_str) if orcamento_str else None
                
                duracao_min = int(duracao_min_str) if duracao_min_str.isdigit() else 0
                hours, remainder = divmod(duracao_min * 60, 3600)
                minutes, seconds = divmod(remainder, 60)
                tempo_de_duracao = f'{hours:02}:{minutes:02}:{seconds:02}'

                conexao = conectar_banco()
                cursor = conexao.cursor()
                conexao.start_transaction()

                # MODIFICADO: Adiciona 'status' no INSERT
                sql_filme = "INSERT INTO Filme (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse, status) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(sql_filme, (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse, status_filme))
                id_filme = cursor.lastrowid

                # ... (resto do código de inserir diretor, ator, etc. continua igual) ...
                id_diretor = get_or_create_id(cursor, 'Diretor', 'nome', diretor_nome)
                if id_diretor:
                    cursor.execute("INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES (%s, %s)", (id_filme, id_diretor))
                
                atores_lista = [ator.strip() for ator in atores_str.split(',')]
                for ator_nome in atores_lista:
                    id_ator = get_or_create_id(cursor, 'Ator', 'nome', ator_nome)
                    if id_ator:
                        cursor.execute("INSERT INTO Filme_ator (id_filme, id_ator) VALUES (%s, %s)", (id_filme, id_ator))

                generos_lista = [g.strip() for g in generos_str.split(',') if g.strip()]
                for genero_nome in generos_lista:
                    id_genero = get_or_create_id(cursor, 'Genero', 'genero', genero_nome)
                    if id_genero:
                        cursor.execute("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (id_filme, id_genero))

                id_produtora = get_or_create_id(cursor, 'Produtora', 'produtora', produtora_nome)
                if id_produtora:
                    cursor.execute("INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES (%s, %s)", (id_filme, id_produtora))
                
                conexao.commit()

                # Mensagem de resposta customizada
                message = 'Filme cadastrado e aprovado com sucesso' if status_filme == 'aprovado' else 'Filme enviado para aprovação'
                response = {'message': message, 'id': id_filme}
                self.send_response(201)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))

            except mysql.connector.Error as err:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro de banco de dados: {err}")
            except Exception as e:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro inesperado no servidor: {e}")
            finally:
                self._close_db(cursor, conexao)
        
        # --- ENDPOINT MODIFICADO ---
        elif path == '/editarfilme':
            # REQUER AUTENTICAÇÃO DE ADMIN
            user_payload = self.validar_token(tipo_requerido='admin')
            if not user_payload:
                return # Erro já foi enviado

            try:
                filme_id = str(data.get('id', ""))
                if not filme_id.isdigit():
                    self._send_json_error(400, "Erro: ID do filme ausente ou inválido no JSON.")
                    return
                
                # ... (resto do código de /editarfilme continua exatamente o mesmo) ...
                titulo = data.get('titulo', "")
                poster = data.get('poster', "")
                atores_str = data.get('atores', "")
                diretor_nome = data.get('diretor', "")
                ano_str = str(data.get('ano', ""))
                duracao_min_str = str(data.get('duracao', "0"))
                orcamento_str = str(data.get('orcamento', "0.00"))
                generos_str = data.get('genero', "")
                produtora_nome = data.get('produtora', "")
                sinopse = data.get('sinopse', "")
                
                ano = int(ano_str) if ano_str.isdigit() else None
                orcamento = Decimal(orcamento_str) if orcamento_str else None
                duracao_min = int(duracao_min_str) if duracao_min_str.isdigit() else 0
                hours, remainder = divmod(duracao_min * 60, 3600)
                minutes, seconds = divmod(remainder, 60)
                tempo_de_duracao = f'{hours:02}:{minutes:02}:{seconds:02}'

                conexao = conectar_banco()
                cursor = conexao.cursor()
                conexao.start_transaction()

                # Não mexemos no 'status' ao editar.
                sql_update_filme = "UPDATE Filme SET titulo=%s, ano=%s, poster=%s, tempo_de_duracao=%s, orcamento=%s, sinopse=%s WHERE id_filme=%s"
                cursor.execute(sql_update_filme, (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse, filme_id))

                tabelas_associacao = ['Filme_Genero', 'Filme_ator', 'Filme_diretor', 'Filme_produtora']
                for tabela in tabelas_associacao:
                    cursor.execute(f"DELETE FROM {tabela} WHERE id_filme = %s", (filme_id,))

                id_diretor = get_or_create_id(cursor, 'Diretor', 'nome', diretor_nome)
                if id_diretor: cursor.execute("INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES (%s, %s)", (filme_id, id_diretor))
                
                atores_lista = [ator.strip() for ator in atores_str.split(',')];
                for ator_nome in atores_lista:
                    id_ator = get_or_create_id(cursor, 'Ator', 'nome', ator_nome)
                    if id_ator: cursor.execute("INSERT INTO Filme_ator (id_filme, id_ator) VALUES (%s, %s)", (filme_id, id_ator))
                
                generos_lista = [g.strip() for g in generos_str.split(',') if g.strip()]
                for genero_nome in generos_lista:
                    id_genero = get_or_create_id(cursor, 'Genero', 'genero', genero_nome)
                    if id_genero:
                        cursor.execute("INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (%s, %s)", (filme_id, id_genero))
                
                id_produtora = get_or_create_id(cursor, 'Produtora', 'produtora', produtora_nome)
                if id_produtora: cursor.execute("INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES (%s, %s)", (filme_id, id_produtora))
                
                conexao.commit()

                response = {'message': 'Filme editado com sucesso', 'id': filme_id}
                self.send_response(200)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))

            except mysql.connector.Error as err:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro de banco de dados ao editar: {err}")
            except Exception as e:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro inesperado no servidor ao editar: {e}")
            finally:
                self._close_db(cursor, conexao)

        # --- ENDPOINT MODIFICADO ---
        elif path == '/deletarfilme':
            # REQUER AUTENTICAÇÃO DE ADMIN
            user_payload = self.validar_token(tipo_requerido='admin')
            if not user_payload:
                return # Erro já foi enviado

            try:
                filme_id = str(data.get('id', ""))
                if not filme_id.isdigit():
                    self._send_json_error(400, "ID do filme inválido ou ausente no JSON.")
                    return

                # ... (resto do código de /deletarfilme continua exatamente o mesmo) ...
                conexao = conectar_banco()
                cursor = conexao.cursor()
                conexao.start_transaction()

                tabelas_associacao = ['Filme_Genero', 'Filme_ator', 'Filme_diretor', 'Filme_produtora', 'Filme_linguagem', 'Filme_pais']
                for tabela in tabelas_associacao:
                    try:
                        cursor.execute(f"DELETE FROM {tabela} WHERE id_filme = %s", (filme_id,))
                    except mysql.connector.Error as err:
                        print(f"Aviso: Não foi possível limpar a tabela {tabela}. Erro: {err}")
                
                cursor.execute("DELETE FROM Filme WHERE id_filme = %s", (filme_id,))
                conexao.commit()

                self.send_response(200)
                self.send_header("Content-type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                response = {'message': 'Filme deletado com sucesso'}
                self.wfile.write(json.dumps(response).encode('utf-8'))

            except mysql.connector.Error as err:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro de banco de dados ao deletar: {err}")
            except Exception as e:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro inesperado no servidor ao deletar: {e}")
            finally:
                self._close_db(cursor, conexao)
        
        # --- NOVO ENDPOINT DE APROVAÇÃO ---
        elif path == '/aprovarfilme':
            # REQUER AUTENTICAÇÃO DE ADMIN
            user_payload = self.validar_token(tipo_requerido='admin')
            if not user_payload:
                return # Erro já foi enviado
            
            try:
                filme_id = str(data.get('id_filme', ""))
                if not filme_id.isdigit():
                    self._send_json_error(400, "ID do filme inválido ou ausente no JSON.")
                    return
                
                conexao = conectar_banco()
                cursor = conexao.cursor()
                cursor.execute("UPDATE Filme SET status = 'aprovado' WHERE id_filme = %s", (filme_id,))
                conexao.commit()

                if cursor.rowcount > 0:
                    response = {'message': 'Filme aprovado com sucesso'}
                    self.send_response(200)
                else:
                    response = {'message': 'Filme não encontrado ou já estava aprovado'}
                    self.send_response(404)

                self.send_header("Content-type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
            
            except mysql.connector.Error as err:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro de banco de dados ao aprovar: {err}")
            except Exception as e:
                if conexao: conexao.rollback()
                self._send_json_error(500, f"Erro inesperado no servidor ao aprovar: {e}")
            finally:
                self._close_db(cursor, conexao)

        else:
            self._send_json_error(404, "Endpoint POST não encontrado.")

    # --- Funções auxiliares do Handler ---
    def _send_json_error(self, code, message):
        self.send_response(code)
        self.send_header("Content-type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        response = {'error': message}
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def _close_db(self, cursor, conexao):
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()

# --- FIM DO HANDLER ---

def main():
    server_address = ('', 8081)
    httpd = HTTPServer(server_address, MyHandle)
    print("Servidor rodando em http://localhost:8081")
    httpd.serve_forever()

if __name__ == '__main__':
    main()