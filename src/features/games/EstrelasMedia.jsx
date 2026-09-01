import { Star } from "lucide-react";

// Só exibição — usada pra mostrar a média geral do jogo (mediaAvaliacao +
// totalAvaliacoes), não é clicável.
export function EstrelasMedia({ media, total }) {
  const cheias = Math.round(media);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className="h-4 w-4"
            fill={n <= cheias ? "#facc15" : "none"}
            stroke="#facc15"
          />
        ))}
      </div>
      <span>
        {media.toFixed(1)} ({total} avaliaç{total === 1 ? "ão" : "ões"})
      </span>
    </div>
  );
}
