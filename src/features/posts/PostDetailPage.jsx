import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { buscarPostagemPorId, excluirPostagem } from "./postagensApi";
import { ComentariosSecao } from "../comments/ComentariosSecao";
import { useAuth } from "../../shared/hooks/useAuth";

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PostDetailPage() {
  const { id } = useParams();
  const { usuario, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [excluindo, setExcluindo] = useState(false);

  const {
    data: postagem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["postagens", id],
    queryFn: () => buscarPostagemPorId(id),
  });

  if (isLoading) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando postagem...</p>;
  }

  if (isError || !postagem) {
    return (
      <p className="px-4 py-24 text-center text-gray-500">
        Não foi possível carregar esta postagem.
      </p>
    );
  }

  const autorRemovido = !postagem.userId;
  const ehDono = usuario?.id === postagem.userId;
  // Editar é só do dono — admin modera (exclui), não reescreve texto alheio.
  const podeEditar = ehDono;
  const podeExcluir = ehDono || isAdmin;

  async function handleExcluir() {
    const confirmou = window.confirm(
      "Excluir esta postagem? Essa ação não pode ser desfeita."
    );
    if (!confirmou) return;

    setExcluindo(true);
    try {
      await excluirPostagem(postagem.id);
      queryClient.invalidateQueries({ queryKey: ["postagens"] });
      navigate("/blog");
    } catch {
      window.alert("Não foi possível excluir esta postagem.");
      setExcluindo(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {postagem.imagem && (
        <img
          src={postagem.imagem}
          alt=""
          className="mb-6 h-64 w-full rounded-2xl object-cover"
        />
      )}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{postagem.titulo}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
              {postagem.imagemUsuario && (
                <img
                  src={postagem.imagemUsuario}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <span className={autorRemovido ? "italic text-gray-400" : ""}>
              Por {postagem.username ?? "usuário excluído"}
            </span>
            <span>·</span>
            <span>{formatarData(postagem.dataPublicacao)}</span>
          </div>
        </div>

        {(podeEditar || podeExcluir) && (
          <div className="flex flex-shrink-0 gap-3">
            {podeEditar && (
              <Link
                to={`/blog/${postagem.id}/editar`}
                className="text-gray-500 hover:text-blue-600"
                aria-label="Editar postagem"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            )}
            {podeExcluir && (
              <button
                type="button"
                onClick={handleExcluir}
                disabled={excluindo}
                className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                aria-label="Excluir postagem"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mb-10 whitespace-pre-wrap leading-relaxed text-gray-700">
        {postagem.conteudo}
      </p>

      <div className="border-t border-gray-100 pt-6">
        <ComentariosSecao
          tipo="postagem"
          alvoId={postagem.id}
          comentariosIniciais={postagem.comentarios ?? []}
          totalInicial={postagem.totalComentarios ?? 0}
        />
      </div>
    </div>
  );
}
