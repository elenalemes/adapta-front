import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Autor removido: o backend já troca título/conteúdo pelo aviso e zera a
// imagem — aqui só aplicamos um estilo diferente pro nome do autor.
export function PostCard({ postagem }) {
  const autorRemovido = !postagem.userId;

  return (
    <Link
      to={`/blog/${postagem.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-40 items-center justify-center overflow-hidden bg-gray-100">
        {postagem.imagem ? (
          <img src={postagem.imagem} alt="" className="h-full w-full object-cover" />
        ) : (
          <Newspaper className="h-10 w-10 text-gray-400" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-gray-900">{postagem.titulo}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-gray-600">{postagem.conteudo}</p>
        <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
          <span className={autorRemovido ? "italic text-gray-400" : ""}>
            Por {postagem.username ?? "usuário excluído"}
          </span>
          <span>·</span>
          <span>{formatarData(postagem.dataPublicacao)}</span>
        </div>
      </div>
    </Link>
  );
}
