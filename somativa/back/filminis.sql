-- 1. APAGA O BANCO ANTIGO (PARA LIMPAR FILMES DUPLICADOS)
DROP DATABASE IF EXISTS Filminis;

-- 2. CRIA O NOVO BANCO
CREATE DATABASE Filminis;
USE Filminis;

-- 3. CRIA AS TABELAS
CREATE TABLE Genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    genero VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Ator (
    id_ator INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    nacionalidade VARCHAR(100)
);

CREATE TABLE Diretor (
    id_diretor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    nacionalidade VARCHAR(100)
);

CREATE TABLE Produtora (
    id_produtora INT PRIMARY KEY AUTO_INCREMENT,
    produtora VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Linguagem (
    id_linguagem INT PRIMARY KEY AUTO_INCREMENT,
    idioma VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Pais (
    id_pais INT PRIMARY KEY AUTO_INCREMENT,
    pais VARCHAR(100) NOT NULL UNIQUE
);

-- --- MODIFICAÇÃO AQUI ---
-- A tabela Filme agora tem a coluna 'status'
CREATE TABLE Filme (
    id_filme INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    orcamento DECIMAL(15, 2),
    tempo_de_duracao TIME,
    ano INT,
    poster VARCHAR(255),
    sinopse TEXT,
    
    -- Adiciona o status.
    -- 'aprovado' como padrão para que seus filmes já inseridos apareçam.
    status ENUM('pendente', 'aprovado') NOT NULL DEFAULT 'aprovado'
);
-- --- FIM DA MODIFICAÇÃO ---


-- --- NOVA TABELA ---
-- Tabela para guardar os usuários admin e comum
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('comum', 'admin') NOT NULL DEFAULT 'comum'
);
-- --- FIM DA NOVA TABELA ---


CREATE TABLE Filme_Genero (
	id_filme_genero INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_genero INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_genero) REFERENCES Genero(id_genero)
);

CREATE TABLE Filme_ator (
	id_filme_ator INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_ator INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_ator) REFERENCES Ator(id_ator)
);

CREATE TABLE Filme_diretor (
	id_filme_diretor INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_diretor INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_diretor) REFERENCES Diretor(id_diretor)
);

CREATE TABLE Filme_produtora (
	id_filme_produtora INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_produtora INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_produtora) REFERENCES Produtora(id_produtora)
);

CREATE TABLE Filme_linguagem (
	id_filme_linguagem INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_linguagem INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_linguagem) REFERENCES Linguagem(id_linguagem)
);

CREATE TABLE Filme_pais (
	id_filme_pais INT PRIMARY KEY AUTO_INCREMENT,
    id_filme INT,
    id_pais INT,
    FOREIGN KEY (id_filme) REFERENCES Filme(id_filme),
    FOREIGN KEY (id_pais) REFERENCES Pais(id_pais)
);

-- 4. INSERE OS DADOS BÁSICOS
INSERT INTO Genero (genero) VALUES
('Ação'), ('Aventura'), ('Ficção Científica'), ('Drama'),
('Crime'), ('Fantasia'), ('Suspense'), ('Animação'),
('Comédia'), ('Mistério'), ('Romance'), ('Terror');

INSERT INTO Ator (nome, sobrenome, genero, nacionalidade) VALUES
('Tim', 'Robbins', 'Masculino', 'Americano'),
('Morgan', 'Freeman', 'Masculino', 'Americano'),
('Marlon', 'Brando', 'Masculino', 'Americano'),
('Al', 'Pacino', 'Masculino', 'Americano'),
('Christian', 'Bale', 'Masculino', 'Britânico'),
('Heath', 'Ledger', 'Masculino', 'Australiano'),
('Elijah', 'Wood', 'Masculino', 'Americano'),
('Ian', 'McKellen', 'Masculino', 'Britânico'),
('John', 'Travolta', 'Masculino', 'Americano'),
('Uma', 'Thurman', 'Feminino', 'Americano'),
('Samuel L.', 'Jackson', 'Masculino', 'Americano'),
('Keanu', 'Reeves', 'Masculino', 'Canadense'),
('Laurence', 'Fishburne', 'Masculino', 'Americano'),
('Leonardo', 'DiCaprio', 'Masculino', 'Americano'),
('Joseph', 'Gordon-Levitt', 'Masculino', 'Americano'),
('Tom', 'Hanks', 'Masculino', 'Americano'),
('Brad', 'Pitt', 'Masculino', 'Americano'),
('Edward', 'Norton', 'Masculino', 'Americano'),
('Jodie', 'Foster', 'Feminino', 'Americano'),
('Anthony', 'Hopkins', 'Masculino', 'Britânico'),
('Matthew', 'McConaughey', 'Masculino', 'Americano'),
('Anne', 'Hathaway', 'Feminino', 'Americano'),
('Song', 'Kang-ho', 'Masculino', 'Sul-coreano'),
('Lee', 'Sun-kyun', 'Masculino', 'Sul-coreano'),
('Michael J.', 'Fox', 'Masculino', 'Canadense'),
('Christopher', 'Lloyd', 'Masculino', 'Americano'),
('Daveigh', 'Chase', 'Feminino', 'Americano'),
('Suzanne', 'Pleshette', 'Feminino', 'Americano'),
('Kristen', 'Stewart', 'Feminino', 'Americano'),
('Robert', 'Pattinson', 'Masculino', 'Britânico'),
('Taylor', 'Lautner', 'Masculino', 'Americano');


INSERT INTO Diretor (nome, sobrenome, genero, nacionalidade) VALUES
('Frank', 'Darabont', 'Masculino', 'Americano'),
('Francis Ford', 'Coppola', 'Masculino', 'Americano'),
('Christopher', 'Nolan', 'Masculino', 'Britânico'),
('Peter', 'Jackson', 'Masculino', 'Neozelandês'),
('Quentin', 'Tarantino', 'Masculino', 'Americano'),
('Lana', 'Wachowski', 'Feminino', 'Americano'),
('Lilly', 'Wachowski', 'Feminino', 'Americano'),
('Robert', 'Zemeckis', 'Masculino', 'Americano'),
('David', 'Fincher', 'Masculino', 'Americano'),
('Jonathan', 'Demme', 'Masculino', 'Americano'),
('Bong', 'Joon Ho', 'Masculino', 'Sul-coreano'),
('Hayao', 'Miyazaki', 'Masculino', 'Japonês'),
('Catherine', 'Hardwicke', 'Feminino', 'Americano'),
('Chris', 'Weitz', 'Masculino', 'Americano'),
('David', 'Slade', 'Masculino', 'Americano'),
('Bill', 'Condon', 'Masculino', 'Americano');

INSERT INTO Produtora (produtora) VALUES
('Castle Rock Entertainment'), ('Paramount Pictures'), ('Warner Bros.'),
('Legendary Pictures'), ('Syncopy'), ('New Line Cinema'),
('WingNut Films'), ('Miramax'), ('Village Roadshow Pictures'),
('Universal Pictures'), ('Regency Enterprises'), ('Orion Pictures'),
('Barunson E&A Corp'), ('Studio Ghibli'), ('Summit Entertainment'),
('Temple Hill Entertainment');

INSERT INTO Linguagem (idioma) VALUES
('Inglês'), ('Coreano'), ('Japonês');

INSERT INTO Pais (pais) VALUES
('EUA'), ('Reino Unido'), ('Nova Zelândia'), ('Coreia do Sul'), ('Japão');

-- 5. INSERE OS FILMES
-- (Não precisa mudar nada aqui, o 'status' DEFAULT 'aprovado' será aplicado)
INSERT INTO Filme (titulo, orcamento, tempo_de_duracao, ano, poster, sinopse) VALUES
('Um Sonho de Liberdade', 25000000.00, '02:22:00', 1994, 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/90/16/48/20083748.jpg', 'Andy Dufresne é condenado a duas prisões perpétuas consecutivas pelas mortes de sua esposa e do amante dela. Porém, só Andy sabe que ele não cometeu os crimes. Na prisão, ele, um ex-banqueiro, faz amizade com Ellis "Red" Redding, um prisioneiro que cumpre pena há 20 anos.'),
('O Poderoso Chefão', 6000000.00, '02:55:00', 1972, 'https://br.web.img3.acsta.net/medias/nmedia/18/90/93/20/20120876.jpg', 'O patriarca de uma organização criminosa transfere o controle de seu império clandestino para seu filho relutante.'),
('Batman: O Cavaleiro das Trevas', 185000000.00, '02:32:00', 2008, 'https://i.pinimg.com/1200x/88/9d/01/889d01e101d65bf2dd37ec04a130102c.jpg', 'Quando a ameaça conhecida como Coringa emerge de seu passado misterioso, ele causa estragos e caos sobre o povo de Gotham. O Cavaleiro das Trevas deve aceitar um dos maiores testes psicológicos e físicos de sua capacidade de combater a injustiça.'),
('O Senhor dos Anéis: O Retorno do Rei', 94000000.00, '03:21:00', 2003, 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/92/91/47/20224867.jpg', 'Gandalf e Aragorn lideram o Mundo dos Homens contra o exército de Sauron para desviar o olhar de Frodo e Sam, que se aproximam da Montanha da Perdição com o Um Anel.'),
('Pulp Fiction: Tempo de Violência', 8000000.00, '02:34:00', 1994, 'https://http2.mlstatic.com/D_NQ_NP_914761-MLA88633601872_072025-OO.jpg', 'As vidas de dois assassinos de aluguel, um boxeador, a esposa de um gângster e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.'),
('Matrix', 63000000.00, '02:16:00', 1999, 'https://m.media-amazon.com/images/I/613ypTLZHsL._UF894,1000_QL80_.jpg', 'Um hacker de computador descobre que o mundo é, na verdade, uma realidade simulada, e ele se junta a uma rebelião para lutar contra as máquinas que controlam a humanidade.'),
('A Origem', 160000000.00, '02:28:00', 2010, 'https://upload.wikimedia.org/wikipedia/pt/8/84/AOrigemPoster.jpg', 'Um ladrão especializado em extrair informações do subconsciente das pessoas durante o sonho é contratado para uma tarefa impossível: plantar uma ideia na mente de um alvo.'),
('Forrest Gump: O Contador de Histórias', 55000000.00, '02:22:00', 1994, 'https://images.justwatch.com/poster/301039564/s718/forrest-gump-o-contador-de-historias.jpg', 'A história dos Estados Unidos da década de 1950 à década de 1970 é vista através dos olhos de um homem do Alabama com um QI baixo, que testemunha eventos históricos cruciais.'),
('Clube da Luta', 63000000.00, '02:19:00', 1999, 'https://www.papodecinema.com.br/wp-content/uploads/2014/02/20200715-clube-da-luta-papo-de-cinema-cartaz.webp', 'Um homem de escritório com insônia, descontente com sua vida, forma um clube de luta clandestino com um vendedor de sabão. O projeto evolui para algo muito maior.'),
('O Silêncio dos Inocentes', 19000000.00, '01:58:00', 1991, 'https://upload.wikimedia.org/wikipedia/pt/0/0a/Silence_of_the_lambs.png', 'Uma jovem agente do FBI busca a ajuda de um brilhante, porém perigoso, assassino canibal encarcerado para capturar outro assassino em série que esfola suas vítimas.'),
('Interestelar', 165000000.00, '02:49:00', 2014, 'https://upload.wikimedia.org/wikipedia/pt/thumb/3/3a/Interstellar_Filme.png/250px-Interstellar_Filme.png', 'Em um futuro onde a Terra está se tornando inabitável, um ex-piloto da NASA lidera uma equipe de exploradores em uma jornada através de um buraco de minhoca para encontrar um novo lar para a humanidade.'),
('Parasita', 11000000.00, '02:12:00', 2019, 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg', 'Uma família pobre se infiltra na vida de uma família rica, um membro de cada vez, desencadeando uma série de eventos com consequências inesperadas.'),
('De Volta para o Futuro', 19000000.00, '01:56:00', 1985, 'https://br.web.img3.acsta.net/medias/nmedia/18/90/95/62/20122008.jpg', 'Um adolescente é acidentalmente enviado trinta anos para o passado em uma máquina do tempo construída por um cientista excêntrico.'),
('A Viagem de Chihiro', 19000000.00, '02:05:00', 2001, 'https://br.web.img3.acsta.net/pictures/210/527/21052756_20131024195513383.jpg', 'Durante a mudança para uma nova cidade, uma menina de 10 anos entra em um mundo mágico e espiritual. Para salvar seus pais, que foram transformados em porcos, ela deve trabalhar em uma casa de banhos para deuses e espíritos.'),
('À Espera de um Milagre', 60000000.00, '03:09:00', 1999, 'https://play-lh.googleusercontent.com/9kBOBTrvqNFdLmjgX4l6wMwkv3ps4auKnp7gLAARfNUkhF7LMd9SSI4U4_RY-VPVE3X_1vqZElspi93koak=w240-h480-rw', 'A vida dos guardas do corredor da morte é afetada por um de seus prisioneiros: um homem negro acusado de assassinato infantil, mas que possui um dom misterioso e gentil.'),
('Gladiador', 103000000.00, '02:35:00', 2000, 'https://upload.wikimedia.org/wikipedia/pt/4/44/GladiadorPoster.jpg', 'Um general romano traído é forçado a se tornar um gladiador. Sua popularidade na arena o leva a Roma, onde ele busca vingança contra o imperador que assassinou sua família.'),
('O Resgate do Soldado Ryan', 70000000.00, '02:49:00', 1998, 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/ac/Saving_Private_Ryan_poster.jpg/250px-Saving_Private_Ryan_poster.jpg', 'Durante a invasão da Normandia, um grupo de soldados americanos é enviado para trás das linhas inimigas para resgatar um soldado cujos três irmãos foram mortos em combate.'),
('O Iluminado', 19000000.00, '02:26:00', 1980, 'https://br.web.img3.acsta.net/c_310_420/pictures/14/10/10/19/21/152595.jpg', 'Uma família se muda para um hotel isolado durante o inverno, onde uma presença sinistra influencia o pai a se voltar para a violência, enquanto seu filho médium vê presságios horríveis.'),
('Janela Indiscreta', 1000000.00, '01:52:00', 1954, 'https://br.web.img3.acsta.net/medias/nmedia/18/91/11/73/20130409.jpg', 'Um fotógrafo confinado a uma cadeira de rodas espia seus vizinhos e se convence de que um deles cometeu um assassinato.'),
('Psicose', 806947.00, '01:49:00', 1960, 'https://m.media-amazon.com/images/M/MV5BOWVhMTE0MjUtMjY0ZS00YzM2LTg4NTUtODM3NzkzMjZmNjAwXkEyXkFqcGc@._V1_.jpg', 'Uma secretária foge com dinheiro roubado e se hospeda em um motel isolado, administrado por um jovem perturbado e sua mãe.'),
('Alien - O Oitavo Passageiro', 11000000.00, '01:57:00', 1979, 'https://www.papodecinema.com.br/wp-content/uploads/2012/06/20200727-alien-o-oitavo-passageiro-papo-de-cinema-cartaz.webp', 'A tripulação de uma nave espacial comercial é despertada da hibernação por um sinal de socorro e encontra uma forma de vida alienígena mortal que começa a caçá-los.'),
('Toy Story', 30000000.00, '01:21:00', 1995, 'https://upload.wikimedia.org/wikipedia/pt/a/a7/Toy_Story_1995.jpg', 'Um boneco caubói se sente ameaçado quando um novo e moderno boneco de patrulheiro espacial se torna o brinquedo favorito de seu dono.'),
('Crepúsculo', 37000000.00, '02:02:00', 2008, 'https://upload.wikimedia.org/wikipedia/pt/thumb/c/c1/Twilight_Poster.jpg/250px-Twilight_Poster.jpg', 'Uma adolescente se apaixona por um vampiro misterioso e pálido. Eles embarcam em um romance perigoso, enquanto ele luta contra sua sede de sangue e ela se torna alvo de outros vampiros.'),
('A Saga Crepúsculo: Lua Nova', 50000000.00, '02:10:00', 2009, 'https://br.web.img3.acsta.net/medias/nmedia/18/87/89/73/19962668.jpg', 'Após a partida abrupta de Edward, Bella Swan fica devastada. Ela encontra conforto em sua amizade com Jacob Black, mas descobre um mundo de lobisomens e perigos antigos.'),
('A Saga Crepúsculo: Eclipse', 68000000.00, '02:04:00', 2010, 'https://br.web.img2.acsta.net/c_310_420/medias/nmedia/18/87/90/28/19962727.jpg', 'Enquanto uma série de assassinatos misteriosos assola Seattle, Bella é forçada a escolher entre seu amor por Edward e sua amizade com Jacob, sabendo que sua decisão pode reacender a guerra entre vampiros e lobisomens.'),
('A Saga Crepúsculo: Amanhecer - Parte 1', 110000000.00, '01:57:00', 2011, 'https://upload.wikimedia.org/wikipedia/pt/a/a0/The_Twilight_Saga_Breaking_Dawn_part_I.jpg', 'O casamento de Bella e Edward é seguido por uma lua de mel e uma gravidez inesperada e perigosa. O pacto entre lobisomens e vampiros é ameaçado.'),
('A Saga Crepúsculo: Amanhecer - Parte 2', 120000000.00, '01:55:00', 2012, 'https://m.media-amazon.com/images/M/MV5BYjU4M2VhMjQtZmFhMi00NzFlLTg4ZjctMjM3NWEzNTM5MTI4XkEyXkFqcGc@._V1_.jpg', 'Após o nascimento de Renesmee, os Cullen reúnem outros clãs de vampiros para proteger a criança de uma falsa acusação que os coloca em rota de colisão com os Volturi.');

-- 6. INSERE OS RELACIONAMENTOS (Sem alterações)
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES
(1, 4), (2, 4), (2, 5), (3, 1), (3, 5), (3, 4), (4, 2), (4, 6), (4, 4), (5, 5), (5, 4),
(6, 1), (6, 3), (7, 1), (7, 2), (7, 3), (8, 4), (8, 11), (9, 4), (9, 7), (10, 4), (10, 7), (10, 5),
(11, 2), (11, 4), (11, 3), (12, 4), (12, 7), (12, 9), (13, 2), (13, 9), (13, 3), (14, 8), (14, 2), (14, 6),
(15, 4), (15, 6), (15, 5), (16, 1), (16, 2), (16, 4), (17, 4), (17, 1), -- Adicionado Ação para Soldado Ryan
(18, 12), (19, 10), (19, 7),
(20, 12), (20, 10), (20, 7), (21, 12), (21, 3), (22, 8), (22, 2), (22, 9),
(23, 4), (23, 6), (23, 11), (24, 4), (24, 6), (24, 11), (25, 4), (25, 6), (25, 11),
(26, 4), (26, 6), (26, 11), (27, 4), (27, 6), (27, 11);

INSERT INTO Filme_ator (id_filme, id_ator) VALUES
(1, 1), (1, 2), (2, 3), (2, 4), (3, 5), (3, 6), (3, 2), (4, 7), (4, 8), (5, 9), (5, 10), (5, 11),
(6, 12), (6, 13), (7, 14), (7, 15), (8, 16), (9, 17), (9, 18), (10, 19), (10, 20), (11, 21), (11, 22),
(12, 23), (12, 24), (13, 25), (13, 26), (14, 27), (14, 28), (15, 16), 
(16, 1), (16, 2), -- Atores para Gladiador (Exemplo, adicione os corretos se quiser)
(17, 16), -- Ator para Soldado Ryan (Exemplo, adicione Tom Hanks)
(23, 29), (23, 30), (23, 31), 
(24, 29), (24, 30), (24, 31), (25, 29), (25, 30), (25, 31), (26, 29), (26, 30), (26, 31), (27, 29), (27, 30), (27, 31);

INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (6, 7), (7, 3), (8, 8), (9, 9), (10, 10), (11, 3),
(12, 11), (13, 8), (14, 12), (15, 1), 
(16, 9), -- Diretor para Gladiador (Exemplo)
(17, 8), -- Diretor para Soldado Ryan (Exemplo)
(18, 9), (19, 10), (20, 10), (21, 9), (22, 10), -- Diretores Aleatórios (Exemplo)
(23, 13), (24, 14), (25, 15), (26, 16), (27, 16);

INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES
(1, 1), (2, 2), (3, 3), (3, 4), (3, 5), (4, 6), (4, 7), (5, 8), (6, 9), (7, 3), (7, 5), (8, 2),
(9, 10), (9, 11), (10, 12), (11, 2), (11, 3), (11, 5), (12, 13), (13, 10), (14, 14), (15, 1),
(16, 1), (17, 2), (18, 3), (19, 4), (20, 5), (21, 6), (22, 7), -- Produtoras Aleatórias (Exemplo)
(23, 15), (23, 16), (24, 15), (24, 16), (25, 15), (25, 16), (26, 15), (26, 16), (27, 15), (27, 16);

INSERT INTO Filme_linguagem (id_filme, id_linguagem) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1),
(12, 2), (13, 1), (14, 3), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1), (21, 1), 
(22, 1), (23, 1), (24, 1), (25, 1), (26, 1), (27, 1);

INSERT INTO Filme_pais (id_filme, id_pais) VALUES
(1, 1), (2, 1), (3, 1), (3, 2), (4, 3), (4, 1), (5, 1), (6, 1), (7, 1), (7, 2), (8, 1), (9, 1),
(10, 1), (11, 1), (11, 2), (12, 4), (13, 1), (14, 5), (15, 1), (16, 1), (17, 1), (18, 2), (18, 1), 
(19, 1), (20, 1), (21, 1), (22, 1), (23, 1), (24, 1), (25, 1), (26, 1), (27, 1);

-- 7. ADICIONA MALÉVOLA (ID 28)
INSERT IGNORE INTO Ator (nome, sobrenome) VALUES 
('Angelina', 'Jolie'), 
('Elle', 'Fanning'), 
('Sharlto', 'Copley');
INSERT IGNORE INTO Diretor (nome, sobrenome) VALUES 
('Robert', 'Stromberg');
INSERT IGNORE INTO Produtora (produtora) VALUES 
('Walt Disney Pictures'), 
('Roth Films');

INSERT INTO Filme (titulo, orcamento, tempo_de_duracao, ano, poster, sinopse) VALUES 
(
    'Malévola', 
    180000000.00, 
    '01:37:00', 
    2014, 
    'https://i.pinimg.com/736x/fd/27/9b/fd279b728870e6195cb904d42bcf0be2.jpg', 
    'Uma fada vingativa é levada a amaldiçoar uma princesa recém-nascida, apenas para descobrir que a criança pode ser a única pessoa que pode restaurar a paz em sua terra conturbada.'
);
-- (O ID será 28)
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES 
(28, 6), 
(28, 2), 
(28, 4);
INSERT INTO Filme_ator (id_filme, id_ator) VALUES 
(28, (SELECT id_ator FROM Ator WHERE nome = 'Angelina' AND sobrenome = 'Jolie')),
(28, (SELECT id_ator FROM Ator WHERE nome = 'Elle' AND sobrenome = 'Fanning')),
(28, (SELECT id_ator FROM Ator WHERE nome = 'Sharlto' AND sobrenome = 'Copley'));
INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES 
(28, (SELECT id_diretor FROM Diretor WHERE nome = 'Robert' AND sobrenome = 'Stromberg'));
INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES 
(28, (SELECT id_produtora FROM Produtora WHERE produtora = 'Walt Disney Pictures')),
(28, (SELECT id_produtora FROM Produtora WHERE produtora = 'Roth Films'));
INSERT INTO Filme_linguagem (id_filme, id_linguagem) VALUES (28, 1);
INSERT INTO Filme_pais (id_filme, id_pais) VALUES (28, 1);


-- 8. ADICIONA CORINGA, DUNA, VINGADORES (IDs 29, 30, 31)
INSERT IGNORE INTO Ator (nome, sobrenome) VALUES 
('Joaquin', 'Phoenix'), ('Robert', 'De Niro'),
('Timothée', 'Chalamet'), ('Rebecca', 'Ferguson'),
('Robert', 'Downey Jr.'), ('Chris', 'Evans'), ('Mark', 'Ruffalo');
INSERT IGNORE INTO Diretor (nome, sobrenome) VALUES 
('Todd', 'Phillips'),
('Denis', 'Villeneuve'),
('Anthony', 'Russo'), ('Joe', 'Russo');
INSERT IGNORE INTO Produtora (produtora) VALUES 
('DC Films'), ('Bron Studios'),
('Legendary Entertainment'),
('Marvel Studios');

INSERT INTO Filme (titulo, orcamento, tempo_de_duracao, ano, poster, sinopse) VALUES 
(
    'Coringa', 
    55000000.00, 
    '02:02:00', 
    2019, 
    'https://i.pinimg.com/1200x/28/bd/4a/28bd4a1ade748769a5e6acd3cfc16a7d.jpg', 
    'Em Gotham City, o comediante falido Arthur Fleck busca conexão enquanto vaga pelas ruas da cidade. Isolado, intimidado e desconsiderado pela sociedade, Fleck inicia uma lenta descida à loucura.'
),
(
    'Duna', 
    165000000.00, 
    '02:35:00', 
    2021, 
    'https://i.pinimg.com/736x/80/80/8c/80808c96a42a93a1efbf270910c6dcc7.jpg', 
    'Paul Atreides, um jovem brilhante e talentoso, deve viajar para o planeta mais perigoso do universo para garantir o futuro de sua família e de seu povo.'
),
(
    'Vingadores: Ultimato', 
    356000000.00, 
    '03:01:00', 
    2019, 
    'https://i.pinimg.com/736x/cc/f9/6a/ccf96acf55509bdc961b63252644625a.jpg', 
    'Após os eventos devastadores de "Guerra Infinita", os Vingadores restantes se reúnem para uma última tentativa de reverter as ações de Thanos e restaurar o equilíbrio do universo.'
);

-- Ligações Coringa (29)
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (29, 4), (29, 5), (29, 7);
INSERT INTO Filme_ator (id_filme, id_ator) VALUES (29, (SELECT id_ator FROM Ator WHERE nome = 'Joaquin' AND sobrenome = 'Phoenix'));
INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES (29, (SELECT id_diretor FROM Diretor WHERE nome = 'Todd' AND sobrenome = 'Phillips'));
INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES (29, (SELECT id_produtora FROM Produtora WHERE produtora = 'DC Films'));
INSERT INTO Filme_linguagem (id_filme, id_linguagem) VALUES (29, 1);
INSERT INTO Filme_pais (id_filme, id_pais) VALUES (29, 1);

-- Ligações Duna (30)
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (30, 3), (30, 2), (30, 4);
INSERT INTO Filme_ator (id_filme, id_ator) VALUES (30, (SELECT id_ator FROM Ator WHERE nome = 'Timothée' AND sobrenome = 'Chalamet'));
INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES (30, (SELECT id_diretor FROM Diretor WHERE nome = 'Denis' AND sobrenome = 'Villeneuve'));
INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES (30, (SELECT id_produtora FROM Produtora WHERE produtora = 'Legendary Entertainment'));
INSERT INTO Filme_linguagem (id_filme, id_linguagem) VALUES (30, 1);
INSERT INTO Filme_pais (id_filme, id_pais) VALUES (30, 1);

-- Ligações Vingadores (31)
INSERT INTO Filme_Genero (id_filme, id_genero) VALUES (31, 1), (31, 2), (31, 3);
INSERT INTO Filme_ator (id_filme, id_ator) VALUES (31, (SELECT id_ator FROM Ator WHERE nome = 'Robert' AND sobrenome = 'Downey Jr.'));
INSERT INTO Filme_diretor (id_filme, id_diretor) VALUES (31, (SELECT id_diretor FROM Diretor WHERE nome = 'Anthony' AND sobrenome = 'Russo'));
INSERT INTO Filme_produtora (id_filme, id_produtora) VALUES (31, (SELECT id_produtora FROM Produtora WHERE produtora = 'Marvel Studios'));
INSERT INTO Filme_linguagem (id_filme, id_linguagem) VALUES (31, 1);
INSERT INTO Filme_pais (id_filme, id_pais) VALUES (31, 1);


-- --- INSERE OS NOVOS USUÁRIOS DE TESTE ---
-- Senha para ambos é: senha123

INSERT INTO Usuario (email, senha_hash, tipo_usuario) 
VALUES ('thai@filminis.com', '55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251', 'admin');

INSERT INTO Usuario (email, senha_hash, tipo_usuario) 
VALUES ('rebs@filminis.com', '55a5e9e78207b4df8699d60886fa070079463547b095d1a05bc719bb4e6cd251', 'comum');
-- --- FIM DOS INSERTS DE USUÁRIO ---


-- 9. VERIFICAÇÃO FINAL
select * from filme;
select * from usuario;