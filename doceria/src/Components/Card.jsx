import "./Card.css";

// Props desestruturadas para facilitar o uso
function Card({ nome, descricao, preco, imagem, onFavoritar, isFavorito }) {
    return (
        // Uso de tag semântica <article> para acessibilidade
        <article className={`card ${isFavorito ? "selecionado" : ""}`}>
            <figure className="cardFigura">
                {/* Alt dinâmico para acessibilidade visual */}
                <img src={imagem} alt={`Foto de um ${nome}`} className="cardImagem" />
            </figure>

            <section className="cardInfos">
                <header>
                    <h3 className="cardTitulo">{nome}</h3>
                </header>

                <p className="cardDescricao">{descricao}</p>

                <footer>
                    <span className="cardPreco">R$ {preco}</span>
                    {/* Botão que altera o estado global via props */}
                    <button 
                        className={`btnFavoritar ${isFavorito ? "ativo" : ""}`} 
                        onClick={onFavoritar}
                        aria-pressed={isFavorito} // Melhora a acessibilidade para leitores de tela
                    >
                        {isFavorito ? "🤍 Favoritado" : "❤️ Favoritar"}
                    </button>
                </footer>
            </section>
        </article>
    );
}

export default Card;