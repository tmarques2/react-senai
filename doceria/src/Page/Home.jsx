import { useState, useEffect } from "react";
import Card from "../Components/Card";
import "./Home.css";
import logoBugatti from "../assets/Logo.png";

function Home() {
    // LocalStorage
    const [favoritos, setFavoritos] = useState(() => {
        const salvos = localStorage.getItem("favoritos_doceria");
        return salvos ? JSON.parse(salvos) : [];
    });

    // Tema
    const [temaEscuro, setTemaEscuro] = useState(() => {
        return localStorage.getItem("tema_doceria") === "escuro";
    });

    // Lista de itens do catalogo
    const listaDoces = [
        { id: 1, nome: "Brigadeiro", preco: "3,50", descricao: "Clássico doce brasileiro feito com chocolate e granulado.", imagem: "https://comidinhasdochef.com/wp-content/uploads/2024/12/brigadeiro_com_barra_de_chocolate_085071d8.webp" },
        { id: 2, nome: "Bolo de Chocolate", preco: "10,00", descricao: "Recheio de brigadeiro e cobertura de ganache de chocolate", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnycCR2v2q_LyBLVEip1JNbTfWggPbeMRRFQ&s" },
        { id: 3, nome: "Cupcake", preco: "6,00", descricao: "Massa fofinha com cobertura cremosa e decorada.", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD_dKs70fidLjTIgraGs2yvUZ2ZWiimpb67w&s" },
        { id: 4, nome: "Donut", preco: "7,00", descricao: "Rosquinha macia com cobertura doce e confeitos.", imagem: "https://i1.pickpik.com/photos/205/915/768/cute-sweet-tasty-delicious-preview.jpg" },
        { id: 5, nome: "Brownie com sorvete", preco: "12,00", descricao: "Brownie de chocolate finalizado com uma bola de sorvete de creme por cima.", imagem: "https://images.pexels.com/photos/29177177/pexels-photo-29177177/free-photo-of-delicioso-brownie-de-chocolate-com-sorvete.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
        { id: 6, nome: "Croissant", preco: "15,00", descricao: "Massa folheada com recheio de morango e nutella.", imagem: "https://fillmorebr.com/wp-content/uploads/2023/11/Croissant-com-Nutella.jpg" },
        { id: 7, nome: "Torta de Maracujá", preco: "15,00", descricao: "Base crocante de biscoito, recheio de mousse de maracujá.", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx320HSYGrAsK8_r63e_5-slYdkyGBcqv8fg&s" },
        { id: 8, nome: "Macaron", preco: "9,00", descricao: "Doce francês delicado com recheio cremoso.", imagem: "https://guiadacozinha.com.br/wp-content/uploads/2021/08/macaron.jpg" },
    ];

    // salva favoritos no localstorage
    useEffect(() => {
        localStorage.setItem("favoritos_doceria", JSON.stringify(favoritos));
    }, [favoritos]);

    // salva o tema da pagina no localstorage
    useEffect(() => {
        localStorage.setItem("tema_doceria", temaEscuro ? "escuro" : "claro");
    }, [temaEscuro]);

    // Função para adicionar ou remover dos favoritos (altera o estado)
    const alternarFavorito = (nomeProduto) => {
        setFavoritos((prev) =>
            prev.includes(nomeProduto)
                ? prev.filter(item => item !== nomeProduto)
                : [...prev, nomeProduto]
        );
    };

    return (
        <main className={`home ${temaEscuro ? "darkMode" : ""}`}>
            <aside className="controlesTopo" aria-label="Controles da pagina">
                {/* Contador global de favoritos */}
                <span className="contadorFavoritos" role="status" aria-live="polite">
                    🤍 Favoritos: <strong>{favoritos.length}</strong>
                </span>

                <button 
                className="btnTema"
                onClick={() => setTemaEscuro(!temaEscuro)}
                aria-label={temaEscuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
                aria-pressed={temaEscuro}
                >
                    {temaEscuro ? "☀️ Modo Claro" : "🌙Modo Escuro"}
                </button>
            </aside>

            <header className="homeHeader">
                <img src={logoBugatti} alt="Logo Doceria Bugatti" className="logoImage" />
                <h1>Bem-Vindo à Doceria Bugatti's</h1>
            </header>

            <section className="cardsContainer">
                {/* Uso do .map() para renderizar a lista */}
                {listaDoces.map((doce) => (
                    <Card
                        key={doce.id} // Chave única para o React
                        nome={doce.nome}
                        descricao={doce.descricao}
                        preco={doce.preco}
                        imagem={doce.imagem}
                        isFavorito={favoritos.includes(doce.nome)}
                        onFavoritar={() => alternarFavorito(doce.nome)}
                    />
                ))}
            </section>
        </main>
    );
}

export default Home;