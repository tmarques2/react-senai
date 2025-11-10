import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse
import json
import mysql.connector
from decimal import Decimal
import datetime

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
            password="root",
            database="filminis"
        )
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao banco de dados: {err}")
        return None

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
def listar_filmes_banco(search_term=None):
    conexao = conectar_banco()
    if not conexao: return []
    cursor = conexao.cursor(dictionary=True)
    
    params = []
    
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
        GROUP BY f.id_filme
    """

    # Se um termo de busca foi fornecido, adiciona a filtragem
    if search_term:
        # Adiciona a cláusula HAVING para filtrar *após* o GROUP_CONCAT
        # O HAVING permite buscar em colunas agrupadas (como 'atores' ou 'generos')
        query += """
            HAVING f.titulo LIKE %s
            OR diretores LIKE %s
            OR atores LIKE %s
            OR generos LIKE %s
            OR produtoras LIKE %s
            OR f.sinopse LIKE %s
        """
        # Adiciona o termo de busca (com '%') para cada campo
        like_term = f"%{search_term}%"
        params = [like_term] * 6 # Um para cada campo no HAVING

    query += ";" # Fecha a query
    
    cursor.execute(query, params)
    filmes = cursor.fetchall()
    cursor.close()
    conexao.close()
    return filmes
# 👇 --- FIM DA ATUALIZAÇÃO --- 👇


def buscar_filme_por_id(filme_id):
    conexao = conectar_banco()
    if not conexao: return None
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
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        if path == '/listarfilmes':
            # 👇 --- ATUALIZAÇÃO AQUI --- 👇
            # Pega o parâmetro 'search' da URL, se existir
            search_term = query_params.get('search', [None])[0]
            
            # Passa o termo de busca para a função do banco
            filmes = listar_filmes_banco(search_term)
            # 👇 --- FIM DA ATUALIZAÇÃO --- 👇
            
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

        if path == '/sendcadastro':
            try:
                titulo = data.get('nome', "")
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

                sql_filme = "INSERT INTO Filme (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(sql_filme, (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse))
                id_filme = cursor.lastrowid

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

                response = {'message': 'Filme cadastrado com sucesso', 'id': id_filme}
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
        
        elif path == '/editarfilme':
            try:
                filme_id = str(data.get('id', ""))
                if not filme_id.isdigit():
                    self._send_json_error(400, "Erro: ID do filme ausente ou inválido no JSON.")
                    return

                titulo = data.get('nome', "")
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

                sql_update_filme = "UPDATE Filme SET titulo=%s, ano=%s, poster=%s, tempo_de_duracao=%s, orcamento=%s, sinopse=%s WHERE id_filme=%s"
                cursor.execute(sql_update_filme, (titulo, ano, poster, tempo_de_duracao, orcamento, sinopse, filme_id))

                tabelas_associacao = ['Filme_Genero', 'Filme_ator', 'Filme_diretor', 'Filme_produtora']
                for tabela in tabelas_associacao:
                    cursor.execute(f"DELETE FROM {tabela} WHERE id_filme = %s", (filme_id,))

                # Recriar associações...
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

        elif path == '/deletarfilme':
            try:
                filme_id = str(data.get('id', "")) # Pegando o ID do JSON
                if not filme_id.isdigit():
                    self._send_json_error(400, "ID do filme inválido ou ausente no JSON.")
                    return

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