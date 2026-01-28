import { useState } from "react";
import Card from "../Components/Card";
import "./Home.css";
import logoBugatti from "../assets/Logo.png";

function Home() {
    const [favoritos, setFavoritos] = useState([]);

    const alternarFavorito = (nomeProduto) => {
        setFavoritos((prevFavoritos) => {
            if (prevFavoritos.includes(nomeProduto)) {
                return prevFavoritos.filter(item => item !== nomeProduto);
            }
            else {
                return [...prevFavoritos, nomeProduto];
            }
        });
    };

    return (
        <main className="home">
            <span className="contadorFavoritos">
                🤍 Favoritos: <strong>{favoritos.length}</strong>
            </span>

            <header className="homeHeader">
                <img src={logoBugatti} alt="Logo Doceria Bugatti" className="logoImage" />
                <h1>Bem-Vindo à Doceria Bugatti's</h1>
            </header>

            <section className="cardsContainer">
                <Card
                    nome="Brigadeiro"
                    descricao="Clássico doce brasileiro feito com chocolate e granulado."
                    preco="3,50"
                    imagem="https://comidinhasdochef.com/wp-content/uploads/2024/12/brigadeiro_com_barra_de_chocolate_085071d8.webp"
                    isFavorito={favoritos.includes("Brigadeiro")}
                    onFavoritar={() => alternarFavorito("Brigadeiro")}
                />

                <Card
                    nome="Bolo de Chocolate"
                    descricao="Massa sabor chocolate com recheio de brigadeiro e cobertura de ganache de chocolate"
                    preco="10,00"
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnycCR2v2q_LyBLVEip1JNbTfWggPbeMRRFQ&s"
                    isFavorito={favoritos.includes("Bolo de Chocolate")}
                    onFavoritar={() => alternarFavorito("Bolo de Chocolate")}
                />

                <Card
                    nome="Cupcake"
                    descricao="Massa fofinha com cobertura cremosa e decorada."
                    preco="6,00"
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD_dKs70fidLjTIgraGs2yvUZ2ZWiimpb67w&s"
                    isFavorito={favoritos.includes("Cupcake")}
                    onFavoritar={() => alternarFavorito("Cupcake")}
                />

                <Card
                    nome="Donut"
                    descricao="Rosquinha macia com cobertura doce e confeitos."
                    preco="7,00"
                    imagem="https://i1.pickpik.com/photos/205/915/768/cute-sweet-tasty-delicious-preview.jpg"
                    isFavorito={favoritos.includes("Donut")}
                    onFavoritar={() => alternarFavorito("Donut")}
                />

                <Card
                    nome="Brownie com sorvete"
                    descricao="Brownie de chocolate finalizado com uma bola de sorvete de creme por cima."
                    preco="12,00"
                    imagem="https://images.pexels.com/photos/29177177/pexels-photo-29177177/free-photo-of-delicioso-brownie-de-chocolate-com-sorvete.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    isFavorito={favoritos.includes("Brownie com sorvete")}
                    onFavoritar={() => alternarFavorito("Brownie com sorvete")}
                />

                <Card
                    nome="Croissant"
                    descricao="Massa folheada com recheio de morango e nutella."
                    preco="15,00"
                    imagem="https://fillmorebr.com/wp-content/uploads/2023/11/Croissant-com-Nutella.jpg"
                    isFavorito={favoritos.includes("Croissant")}
                    onFavoritar={() => alternarFavorito("Croissant")}
                />

                <Card
                    nome="Torta de Maracujá"
                    descricao="Base crocante de biscoito, recheio de mousse de maracujá e cobertura de geleia de maracujá."
                    preco="15,00"
                    imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx320HSYGrAsK8_r63e_5-slYdkyGBcqv8fg&s"
                    isFavorito={favoritos.includes("Torta de Maracujá")}
                    onFavoritar={() => alternarFavorito("Torta de Maracujá")}
                />

                <Card
                    nome="Macaron"
                    descricao="Doce francês delicado com recheio cremoso."
                    preco="9,00"
                    imagem="https://guiadacozinha.com.br/wp-content/uploads/2021/08/macaron.jpg"
                    isFavorito={favoritos.includes("Macaron")}
                    onFavoritar={() => alternarFavorito("Macaron")}
                />
            </section>
        </main>
    );
}

export default Home;
