export default function Quadrado({value, onQuadrado}){

    return <button className="quadrado"
    onClick={onQuadrado}>{value}</button>
}