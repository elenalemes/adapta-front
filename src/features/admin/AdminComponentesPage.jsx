import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { listarComponentes, excluirComponente } from "../../shared/services/componentesApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

// Agrupa por área só pra exibição — a lista em si vem plana da API.
function agruparPorArea(componentes) {
  const areas = new Map();
  for (const componente of componentes) {
    if (!areas.has(componente.areaId)) {
      areas.set(componente.areaId, { id: componente.areaId, nome: componente.areaNome, itens: [] });
    }
    areas.get(componente.areaId).itens.push(componente);
  }
  return [...areas.values()];
}

export function AdminComponentesPage() {
  const [excluindoId, setExcluindoId] = useState(null);
  const [erro, setErro] = useState(null);
  const queryClient = useQueryClient();

  const { data: componentes, isLoading } = useQuery({
    queryKey: ["admin", "componentes"],
    queryFn: listarComponentes,
  });

  async function handleExcluir(componente) {
    const confirmou = window.confirm(
      `Excluir "${componente.nome}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setErro(null);
    setExcluindoId(componente.id);
    try {
      await excluirComponente(componente.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "componentes"] });
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    } catch (error) {
      // O backend recusa (400) se o componente estiver vinculado a algum
      // jogo — a mensagem explica exatamente isso, então mostramos direto.
      setErro(mensagemDeErro(error, "Não foi possível excluir este componente curricular."));
    } finally {
      setExcluindoId(null);
    }
  }

  const areasAgrupadas = agruparPorArea(componentes ?? []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Componentes curriculares</h1>
        <Link
          to="/admin/componentes/novo"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo componente
        </Link>
      </div>

      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {erro}
        </p>
      )}

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {!isLoading && areasAgrupadas.length === 0 && (
        <p className="text-gray-500">Nenhum componente curricular cadastrado ainda.</p>
      )}

      <div className="space-y-6">
        {areasAgrupadas.map((area) => (
          <div key={area.id} className="overflow-hidden rounded-2xl border border-gray-200">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-500">
              {area.nome}
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-100">
                {area.itens.map((componente) => (
                  <tr key={componente.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{componente.nome}</td>
                    <td className="px-4 py-3 text-gray-500">{componente.codigo}</td>
                    <td className="px-4 py-3 text-gray-500">{componente.descricao || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/componentes/${componente.id}/editar`}
                          className="text-gray-500 hover:text-blue-600"
                          aria-label={`Editar ${componente.nome}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleExcluir(componente)}
                          disabled={excluindoId === componente.id}
                          className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                          aria-label={`Excluir ${componente.nome}`}
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
        ))}
      </div>
    </div>
  );
}
