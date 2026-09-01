import { Link } from "react-router-dom";
import { Gamepad2, Play } from "lucide-react";

// O card inteiro precisa continuar clicável, mas o botão "Jogar" precisa ser
// um alvo de foco/leitor de tela próprio e com rótulo claro — por isso não é
// um <button> dentro do <Link> do card (HTML não permite interativo dentro de
// interativo). Em vez disso, o título vira um link "esticado" (cobre o card
// inteiro via ::after) e o botão "Jogar" é um segundo link, irmão do
// primeiro, com z-index acima do link esticado.
export function JogoCard({ jogo }) {
  const tag = jogo.componentes?.[0]?.nome;
  const emDesenvolvimento = !jogo.urlJogo;

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-gray-100 p-6 text-center shadow-sm transition hover:shadow-md">
      {emDesenvolvimento && (
        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
          Em desenvolvimento
        </span>
      )}

      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100">
        {jogo.imagem ? (
          <img src={jogo.imagem} alt="" className="h-full w-full object-cover" />
        ) : (
          <Gamepad2 className="h-10 w-10 text-gray-400" aria-hidden="true" />
        )}
      </div>

      <h3 className="font-semibold text-gray-900">
        <Link to={`/jogos/${jogo.id}`} className="after:absolute after:inset-0">
          {jogo.titulo}
        </Link>
      </h3>
      <p className="text-xs font-medium text-gray-400">Sobre o jogo</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {tag && (
          <span className="rounded-full border border-black bg-yellow-400 px-3 py-1 text-xs font-medium text-black">
            #{tag.replace(/\s+/g, "")}
          </span>
        )}
        {jogo.anoInicial && jogo.anoFinal && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {jogo.anoInicial}º ao {jogo.anoFinal}º ano
          </span>
        )}
      </div>

      <Link
        to={`/jogos/${jogo.id}`}
        className="relative z-10 mt-1 inline-flex items-center gap-2 rounded-full bg-blue-600 px-[76px] py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        Jogar
      </Link>
    </div>
  );
}
