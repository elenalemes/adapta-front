import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { listarPostagens } from "./postagensApi";
import { PostCard } from "./PostCard";
import { useAuth } from "../../shared/hooks/useAuth";

const TAMANHO_PAGINA = 9;

export function BlogListPage() {
  const { estaLogado } = useAuth();
  const [pagina, setPagina] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["postagens", pagina],
    queryFn: () => listarPostagens({ page: pagina, size: TAMANHO_PAGINA }),
  });

  const postagens = data?.conteudo ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline-sm font-bold text-gray-900">Blog</h1>
        {estaLogado && (
          <Link
            to="/blog/novo"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-6 text-label-lg text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova postagem
          </Link>
        )}
      </div>

      <h2 className="sr-only">Postagens publicadas</h2>

      {isLoading && <p className="text-body-lg text-gray-500">Carregando...</p>}

      {!isLoading && postagens.length === 0 && (
        <p className="text-body-lg text-gray-500">Nenhuma postagem ainda.</p>
      )}

      {postagens.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {postagens.map((postagem) => (
            <PostCard key={postagem.id} postagem={postagem} />
          ))}
        </div>
      )}

      {data && data.totalPaginas > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={data.primeira}
            className="inline-flex min-h-11 items-center px-2 text-label-lg text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Anterior
          </button>
          <span className="text-body-md text-gray-600" role="status">
            Página {data.pagina + 1} de {data.totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => p + 1)}
            disabled={data.ultima}
            className="inline-flex min-h-11 items-center px-2 text-label-lg text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
