import Quadrado from "./quadrado";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function Tabuleiro() {
  const [quadrados, setQuadrado] = useState(Array(9).fill(null));
  const [xProximo, setxProximo] = useState(true);

  const venceu = vencedor(quadrados);

  const deuVelha = !venceu && quadrados.every((q) => q !== null);

  useEffect(() => {
    if (venceu) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [venceu]);

  function handleClick(i) {
    if (quadrados[i] || vencedor(quadrados)) {
      return;
    }

    const nextQuadrado = quadrados.slice();
    nextQuadrado[i] = xProximo ? "❌" : "❤️";

    setQuadrado(nextQuadrado);
    setxProximo(!xProximo);
  }

  function reiniciar() {
    setQuadrado(Array(9).fill(null));
    setxProximo(true);
  }

  let status;
  if (venceu) {
    status = "Vencedor é: " + venceu;
  } else {
    status = "O próximo jogador é: " + (xProximo ? "❌" : "❤️");
  }

  return (
    <>
      <h1 className="titulo">Jogo da Velha da Thai</h1>
      {venceu ? (
      <div className="caixa-vencedor">
        🎉 O vencedor é: {venceu} 🎉
      </div>
    ) : deuVelha ? (
      <div className="caixa-velha">
        Deu velha! Ninguém venceu.
      </div>
    ) : (
      <h3>{status}</h3>
    )}
      <div className="linha">
        <Quadrado value={quadrados[0]} onQuadrado={() => handleClick(0)} />
        <Quadrado value={quadrados[1]} onQuadrado={() => handleClick(1)} />
        <Quadrado value={quadrados[2]} onQuadrado={() => handleClick(2)} />
      </div>
      <div className="linha">
        <Quadrado value={quadrados[3]} onQuadrado={() => handleClick(3)} />
        <Quadrado value={quadrados[4]} onQuadrado={() => handleClick(4)} />
        <Quadrado value={quadrados[5]} onQuadrado={() => handleClick(5)} />
      </div>
      <div className="linha">
        <Quadrado value={quadrados[6]} onQuadrado={() => handleClick(6)} />
        <Quadrado value={quadrados[7]} onQuadrado={() => handleClick(7)} />
        <Quadrado value={quadrados[8]} onQuadrado={() => handleClick(8)} />
      </div>

      <button className="botao-reiniciar" onClick={reiniciar}>
        ⟳
        </button>
    </>
  );

  function vencedor(quadrados) {
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < linhas.length; i++) {
      const [a, b, c] = linhas[i];
      if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
        return quadrados[a];
      }
    }
  }
}
