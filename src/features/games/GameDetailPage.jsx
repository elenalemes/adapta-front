import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarJogoPorId } from "../../shared/services/jogosApi";
import { VisualizadorJogo } from "./VisualizadorJogo";
import { EstrelasMedia } from "./EstrelasMedia";
import { SeletorNota } from "./SeletorNota";
import { BotaoFavoritar } from "./BotaoFavoritar";
import { ComentariosSecao } from "../comments/ComentariosSecao";

// Cada componente curricular já vem com os dados da sua área (categoria)
// aninhados — só precisamos agrupar por área pra exibir.
function agruparPorArea(componentes) {
  const areas = new Map();
  for (const componente of componentes ?? []) {
    if (!areas.has(componente.areaId)) {
      areas.set(componente.areaId, {
        id: componente.areaId,
        nome: componente.areaNome,
        componentes: [],
      });
    }
    areas.get(componente.areaId).componentes.push(componente);
  }
  return [...areas.values()];
}

export function GameDetailPage() {
  const { id } = useParams();

  const {
    data: jogo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jogos", id],
    queryFn: () => buscarJogoPorId(id),
  });

  if (isLoading) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando jogo...</p>;
  }

  if (isError || !jogo) {
    return (
      <p className="px-4 py-24 text-center text-gray-500">
        Não foi possível carregar este jogo.
      </p>
    );
  }

  const areasAgrupadas = agruparPorArea(jogo.componentes);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{jogo.titulo}</h1>
        {jogo.anoInicial && jogo.anoFinal && (
          <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            Ano escolar: {jogo.anoInicial}º ao {jogo.anoFinal}º ano
          </span>
        )}
      </div>

      {areasAgrupadas.length > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Este jogo está de acordo com o currículo da BNCC!
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            A BNCC organiza o currículo de aprendizado infantil em áreas do conhecimento
            categorias e componentes curriculares. Este jogo trabalha com:
          </p>

          <div className="mt-4 space-y-4">
            {areasAgrupadas.map((area) => (
              <div key={area.id}>
                <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Categoria: {area.nome}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {area.componentes.map((componente) => (
                    <span
                      key={componente.id}
                      className="max-w-xs rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs"
                    >
                      <span className="block font-medium text-blue-700">
                        Componente curricular: {componente.nome}
                      </span>
                      {componente.descricao && (
                        <span className="mt-0.5 block text-gray-500">{componente.descricao}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <VisualizadorJogo key={jogo.id} urlJogo={jogo.urlJogo} titulo={jogo.titulo} />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <EstrelasMedia media={jogo.mediaAvaliacao} total={jogo.totalAvaliacoes} />
        <BotaoFavoritar jogoId={jogo.id} favoritadoInicial={jogo.favoritado} />
      </div>

      <p className="mb-10 leading-relaxed text-gray-700">{jogo.descricao}</p>

      <div className="mb-10 border-t border-gray-100 pt-6">
        <SeletorNota jogoId={jogo.id} minhaNotaInicial={jogo.minhaNota} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <ComentariosSecao
          tipo="jogo"
          alvoId={jogo.id}
          comentariosIniciais={jogo.comentarios ?? []}
          totalInicial={jogo.totalComentarios ?? 0}
        />
      </div>
    </div>
  );
}
