import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { listarJogos, excluirJogo } from "../../shared/services/jogosApi";
import { BotaoIcone } from "../../shared/components/Botao";

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline-sm font-bold text-gray-900">Jogos</h1>
        <Link
          to="/admin/jogos/novo"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-6 text-label-lg text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo jogo
        </Link>
      </div>

      {isLoading && <p className="text-body-lg text-gray-500">Carregando...</p>}

      {!isLoading && jogos.length === 0 && (
        <p className="text-body-lg text-gray-500">Nenhum jogo cadastrado ainda.</p>
      )}

      {jogos.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[36rem] text-left text-body-md">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-title-sm">Título</th>
                <th className="px-4 py-3 text-title-sm">Componentes</th>
                <th className="px-4 py-3 text-title-sm">Link</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jogos.map((jogo) => (
                <tr key={jogo.id}>
                  <td className="px-4 py-3 text-title-sm text-gray-900">{jogo.titulo}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {jogo.componentes?.map((c) => c.nome).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {jogo.urlJogo ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-label-md text-green-800">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-label-md text-amber-800">
                        Em desenvolvimento
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/admin/jogos/${jogo.id}/editar`}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-gray-600 hover:text-blue-700"
                        aria-label={`Editar ${jogo.titulo}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <BotaoIcone
                        type="button"
                        onClick={() => handleExcluir(jogo)}
                        disabled={excluindoId === jogo.id}
                        className="text-gray-600 hover:text-red-700"
                        aria-label={`Excluir ${jogo.titulo}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </BotaoIcone>
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
