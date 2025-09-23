function Bio(props) {
  return (
    <div className="infoBox">
      <h2>{props.nome}</h2>
      <p><strong>Data de Nascimento:</strong> {props.data}</p>
      <p><strong>Onde nasceu:</strong> {props.lugar}</p>
      <p><strong>O que faz da vida:</strong> {props.oqfaz}</p>
      <p><strong>De onde é:</strong> {props.origem}</p>
      <p><strong>Descrição: </strong>{props.descricao}</p>
    </div>
  );
}

export default Bio;