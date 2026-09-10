import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { avaliar } from "../../shared/services/avaliacoesApi";

export function SeletorNota({ jogoId, minhaNotaInicial }) {
  const { estaLogado } = useAuth();
  const [minhaNota, setMinhaNota] = useState(minhaNotaInicial ?? null);
  const [enviando, setEnviando] = useState(false);

  if (!estaLogado) {
    return (
      <p className="text-sm text-gray-600">
        <Link to="/entrar" className="text-blue-600 hover:underline">
          Entre
        </Link>{" "}
        pra avaliar este jogo.
      </p>
    );
  }

  async function handleAvaliar(nota) {
    if (enviando) return;
    setEnviando(true);
    try {
      await avaliar(jogoId, nota);
      setMinhaNota(nota);
    } catch {
      // Erro
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">
        {minhaNota ? `Sua avaliação: ${minhaNota} de 5` : "Avalie este jogo:"}
      </p>
      <div className="flex gap-1" role="radiogroup" aria-label="Sua nota para este jogo">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={minhaNota === n}
            disabled={enviando}
            onClick={() => handleAvaliar(n)}
            className="disabled:opacity-50"
          >
            <Star
              className="h-7 w-7"
              fill={minhaNota && n <= minhaNota ? "#B8860B" : "none"}
              stroke="#1A1A1A"
              strokeWidth={1.5}
            />
            <span className="sr-only">
              {n} estrela{n > 1 ? "s" : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
