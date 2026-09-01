import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listarAreas } from "../../shared/services/areasApi";
import {
  listarJogos,
  listarJogosPorArea,
  listarJogosPorComponente,
} from "../../shared/services/jogosApi";
import { FiltroBNCC } from "./FiltroBNCC";
import { JogoCard } from "./JogoCard";
import bannerHome from "../../assets/BannerHome.png";

// Home mostra uma vitrine de 8 jogos (o catálogo completo, com paginação de
// verdade, fica na página /jogos — ainda não construída).
const TAMANHO_VITRINE = 8;

export function HomePage() {
  const [areaId, setAreaId] = useState(null);
  const [componenteId, setComponenteId] = useState(null);

  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: listarAreas,
  });

  const { data: paginaJogos, isLoading: carregandoJogos } = useQuery({
    queryKey: ["jogos", "vitrine", areaId, componenteId],
    queryFn: () => {
      if (componenteId) {
        return listarJogosPorComponente(componenteId, { size: TAMANHO_VITRINE });
      }
      if (areaId) {
        return listarJogosPorArea(areaId, { size: TAMANHO_VITRINE });
      }
      return listarJogos({ size: TAMANHO_VITRINE });
    },
  });

  function handleAreaChange(novaAreaId) {
    setAreaId(novaAreaId);
    setComponenteId(null); // trocar de área invalida a habilidade escolhida antes
  }

  const jogos = paginaJogos?.conteudo ?? [];

  return (
    <div>
      <section>
        <img
          src={bannerHome}
          alt="Adapta: jogos adaptados para brincar e aprender. Duas crianças sorridentes usando um laptop juntas."
          className="h-60 w-full object-cover object-center sm:h-80 lg:h-[480px]"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Busque jogos por categoria da BNCC!
        </h2>

        <div className="mt-6">
          <FiltroBNCC
            areas={areas}
            areaId={areaId}
            componenteId={componenteId}
            onAreaChange={handleAreaChange}
            onComponenteChange={setComponenteId}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {carregandoJogos && (
            <p className="col-span-full text-gray-500">Carregando jogos...</p>
          )}
          {!carregandoJogos && jogos.length === 0 && (
            <p className="col-span-full text-gray-500">
              Nenhum jogo encontrado para esse filtro.
            </p>
          )}
          {jogos.map((jogo) => (
            <JogoCard key={jogo.id} jogo={jogo} />
          ))}
        </div>

        <Link
          to="/jogos"
          className="mt-10 inline-block rounded-full border border-blue-600 px-6 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
        >
          Ver catálogo completo
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-blue-50 px-6 py-10 text-center sm:px-12">
          <h2 className="text-xl font-bold text-gray-900">O Adapta vai até você!</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-700">
            O Adapta é um projeto educacional que torna a educação por meio de tecnologia mais
            acessível para todas as crianças! Se quiser saber mais ou precisa de ajuda com algum
            dos nossos jogos, entre em contato com a nossa equipe!
          </p>
          <div className="mt-6 text-sm text-gray-600">
            <p>Responsável: Elena Lemes</p>
            <a
              href="mailto:elenavieiralemes@gmail.com"
              className="font-medium text-blue-700 hover:underline"
            >
              elenavieiralemes@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
