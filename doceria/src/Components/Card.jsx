import "./Card.css";

function Card({ nome, descricao, preco, imagem, onFavoritar, isFavorito }) {
    return (
        <article className={`card ${isFavorito ? "selecionado" : ""}`}>
            <figure className="cardFigura">
                <img src={imagem} alt={nome} className="cardImagem" />
            </figure>

            <section className="cardInfos">
                <header>
                    <h3 className="cardTitulo">{nome}</h3>
                </header>

                <p className="cardDescricao">{descricao}</p>

                <footer>
                    <span className="cardPreco">R$ {preco}</span>
                    {/* Aqui mudamos a classe do botão também se quiser */}
                    <button 
                        className={`btnFavoritar ${isFavorito ? "ativo" : ""}`} 
                        onClick={onFavoritar}
                    >
                        {isFavorito ? "🤍 Favoritado" : "❤️ Favoritar"}
                    </button>
                </footer>
            </section>
        </article>
    );
}

export default Card;