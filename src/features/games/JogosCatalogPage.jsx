import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { listarAreas } from "../../shared/services/areasApi";
import {
  listarJogos,
  listarJogosPorArea,
  listarJogosPorComponente,
  buscarJogosPorTitulo,
} from "../../shared/services/jogosApi";
import { FiltroBNCC } from "./FiltroBNCC";
import { JogoCard } from "./JogoCard";

const TAMANHO_PAGINA = 12;

// A API não combina busca por texto com filtro de área/componente — são
// rotas diferentes. Por isso os dois são mutuamente exclusivos aqui: usar
// um limpa o outro, em vez de fingir que os dois se somam.
export function JogosCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const areaId = searchParams.get("area");
  const componenteId = searchParams.get("componente");
  const busca = searchParams.get("busca") ?? "";
  const pagina = Number(searchParams.get("page") ?? 0);

  const [textoBusca, setTextoBusca] = useState(busca);

  const { data: areas } = useQuery({ queryKey: ["areas"], queryFn: listarAreas });

  const { data, isLoading } = useQuery({
    queryKey: ["jogos", "catalogo", { areaId, componenteId, busca, pagina }],
    queryFn: () => {
      const paginacao = { page: pagina, size: TAMANHO_PAGINA };
      if (busca) return buscarJogosPorTitulo(busca, paginacao);
      if (componenteId) return listarJogosPorComponente(componenteId, paginacao);
      if (areaId) return listarJogosPorArea(areaId, paginacao);
      return listarJogos(paginacao);
    },
  });

  function irParaPagina(novaPagina) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(novaPagina));
    setSearchParams(params);
  }

  function handleSubmitBusca(evento) {
    evento.preventDefault();
    const params = new URLSearchParams();
    if (textoBusca.trim()) params.set("busca", textoBusca.trim());
    setSearchParams(params);
  }

  function handleAreaChange(novaAreaId) {
    const params = new URLSearchParams();
    if (novaAreaId) params.set("area", novaAreaId);
    setTextoBusca("");
    setSearchParams(params);
  }

  function handleComponenteChange(novoComponenteId) {
    const params = new URLSearchParams();
    if (areaId) params.set("area", areaId);
    if (novoComponenteId) params.set("componente", novoComponenteId);
    setTextoBusca("");
    setSearchParams(params);
  }

  const jogos = data?.conteudo ?? [];
  const temFiltroAtivo = !!(busca || areaId || componenteId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Catálogo de jogos</h1>

      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-left text-base font-semibold text-gray-700">
            Encontre seu jogo favorito!
          </h2>
          <form onSubmit={handleSubmitBusca} className="flex max-w-md gap-2">
            <input
              type="search"
              value={textoBusca}
              onChange={(evento) => setTextoBusca(evento.target.value)}
              placeholder="Buscar jogo por título..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-left text-base font-semibold text-gray-700">
            Ou selecione uma categoria BNCC
          </h2>
          <FiltroBNCC
            areas={areas}
            areaId={areaId}
            componenteId={componenteId}
            onAreaChange={handleAreaChange}
            onComponenteChange={handleComponenteChange}
            centralizado={false}
          />
        </div>
      </div>

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {!isLoading && jogos.length === 0 && (
        <p className="text-gray-500">
          {temFiltroAtivo
            ? "Nenhum jogo encontrado para esse filtro."
            : "Nenhum jogo cadastrado ainda."}
        </p>
      )}

      {jogos.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jogos.map((jogo) => (
            <JogoCard key={jogo.id} jogo={jogo} />
          ))}
        </div>
      )}

      {data && data.totalPaginas > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => irParaPagina(Math.max(0, pagina - 1))}
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
            onClick={() => irParaPagina(pagina + 1)}
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
