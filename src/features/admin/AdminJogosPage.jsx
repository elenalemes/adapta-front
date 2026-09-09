import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { listarJogos, excluirJogo } from "../../shared/services/jogosApi";

const TAMANHO_PAGINA = 10;

export function AdminJogosPage() {
  const [pagina, setPagina] = useState(0);
  const [excluindoId, setExcluindoId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "jogos", pagina],
    queryFn: () => listarJogos({ page: pagina, size: TAMANHO_PAGINA }),
  });

  async function handleExcluir(jogo) {
    const confirmou = window.confirm(
      `Excluir "${jogo.titulo}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setExcluindoId(jogo.id);
    try {
      await excluirJogo(jogo.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "jogos"] });
    } catch {
      window.alert("Não foi possível excluir este jogo. Ele pode estar vinculado a outros dados.");
    } finally {
      setExcluindoId(null);
    }
  }

  const jogos = data?.conteudo ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Jogos</h1>
        <Link
          to="/admin/jogos/novo"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo jogo
        </Link>
      </div>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {!isLoading && jogos.length === 0 && (
        <p className="text-gray-500">Nenhum jogo cadastrado ainda.</p>
      )}

      {jogos.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Componentes</th>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jogos.map((jogo) => (
                <tr key={jogo.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{jogo.titulo}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {jogo.componentes?.map((c) => c.nome).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {jogo.urlJogo ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        Em desenvolvimento
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/jogos/${jogo.id}/editar`}
                        className="text-gray-500 hover:text-blue-600"
                        aria-label={`Editar ${jogo.titulo}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleExcluir(jogo)}
                        disabled={excluindoId === jogo.id}
                        className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Excluir ${jogo.titulo}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={data.primeira}
            className="text-sm font-medium text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {data.pagina + 1} de {data.totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => p + 1)}
            disabled={data.ultima}
            className="text-sm font-medium text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
