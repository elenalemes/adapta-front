import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listarAreas } from "../../shared/services/areasApi";
import {
  listarJogos,
  listarJogosPorArea,
  listarJogosPorComponente,
} from "../../shared/services/jogosApi";
import { listarPostagens } from "../posts/postagensApi";
import { PostCard } from "../posts/PostCard";
import { FiltroBNCC } from "./FiltroBNCC";
import { JogoCard } from "./JogoCard";
import bannerHome from "../../assets/banner_atualizado.png";
import sobreNos1 from "../../assets/sobrenos_1.png";
import sobreNos2 from "../../assets/sobrenos_2.jpeg";
import sobreNos3 from "../../assets/sobrenos_3.jpeg";
import professoraAluno from "../../assets/professora_aluno.jpg";

const TAMANHO_VITRINE = 8;
const TAMANHO_BLOG_VITRINE = 3;

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
        return listarJogosPorComponente(componenteId, {
          size: TAMANHO_VITRINE,
        });
      }
      if (areaId) {
        return listarJogosPorArea(areaId, { size: TAMANHO_VITRINE });
      }
      return listarJogos({ size: TAMANHO_VITRINE });
    },
  });

  function handleAreaChange(novaAreaId) {
    setAreaId(novaAreaId);
    setComponenteId(null); // trocar de área invalida o componente curricular escolhido antes
  }

  const { data: paginaPostagens } = useQuery({
    queryKey: ["postagens", "vitrine"],
    queryFn: () => listarPostagens({ size: TAMANHO_BLOG_VITRINE }),
  });

  const jogos = paginaJogos?.conteudo ?? [];
  const postagens = paginaPostagens?.conteudo ?? [];

  return (
    <div>
      <section className="relative bg-[#00579D]">
        <img
          src={bannerHome}
          alt=""
          className="h-60 w-full object-cover object-center sm:h-80 lg:h-[480px]"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <p className="text-label-lg text-white sm:text-title-md lg:text-title-lg">
              Jogos adaptados
            </p>
            <h1 className="mt-1 max-w-[12ch] text-headline-lg font-bold text-balance text-white sm:max-w-[14ch] sm:text-display-md lg:max-w-xl lg:text-display-lg">
              Para Brincar &amp; Aprender
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 text-center">
        <h2 className="text-headline-sm font-bold text-gray-900">
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
            <p className="col-span-full text-body-lg text-gray-500">
              Carregando jogos...
            </p>
          )}
          {!carregandoJogos && jogos.length === 0 && (
            <p className="col-span-full text-body-lg text-gray-500">
              Nenhum jogo encontrado para esse filtro.
            </p>
          )}
          {jogos.map((jogo) => (
            <JogoCard key={jogo.id} jogo={jogo} />
          ))}
        </div>

        <Link
          to="/jogos"
          className="mt-10 inline-flex min-h-11 items-center rounded-full border border-blue-600 px-6 text-label-lg text-blue-700 transition hover:bg-blue-50"
        >
          Ver catálogo completo
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-headline-sm font-bold text-gray-900">Sobre nós</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <img
            src={sobreNos1}
            alt=""
            className="h-64 w-full rounded-2xl object-cover"
          />
          <img
            src={sobreNos2}
            alt=""
            className="h-64 w-full rounded-2xl object-cover"
          />
          <img
            src={sobreNos3}
            alt=""
            className="h-64 w-full rounded-2xl object-cover"
          />
        </div>

        <p className="mt-6 max-w-3xl text-body-lg text-texto-fraco">
          O Adapta é um projeto acadêmico que nasceu da necessidade de tornar a
          educação mais acessível por meio de tecnologia para todas as crianças,
          especialmente aquelas com dificuldades para aprender da maneira
          regular em sala de aula. Sabemos que cada indivíduo é especial e
          acreditamos que a tecnologia pode ser uma aliada poderosa na educaçã e
          por isso desenvolvemos jogos educacionais adaptados, que respeitam o
          jeito de aprender de cada criança.
        </p>

        <p className="mt-4 max-w-3xl text-body-lg text-texto-fraco">
          Aqui, reunimos jogos educacionais livres e gratuítos, desenvolvidos
          com atenção às diretrizes de acessibilidade, para que professores,
          terapeutas e famílias encontrem, em um só lugar, atividades pensadas
          de verdade para o jeito de aprender de cada criança.
        </p>

        <Link
          to="/sobre-nos"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-blue-600 px-6 text-label-lg text-white transition hover:bg-blue-700"
        >
          Saiba mais
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <h2 className="text-headline-sm font-bold text-gray-900">
              Você é professor, terapeuta ou responsável?
            </h2>
            <p className="mt-4 max-w-md text-body-lg text-texto-fraco">
              Se você acompanha o dia a dia de uma criança autista ou que faz
              parte da aprendizagem especial, seja em sala de aula, no
              atendimento educacional especializado ou em casa, o Adapta pode
              ser uma ferramenta útil para te ajudar. Crie sua conta e faça
              parte da nossa comunidade! Encontre jogos, acompanhe as novidades
              do blog e ajude a construir uma plataforma cada vez mais alinhada
              às necessidades reais de quem ensina e de quem aprende.
            </p>
            <Link
              to="/cadastro"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-blue-600 px-6 text-label-lg text-white transition hover:bg-blue-700"
            >
              Criar conta
            </Link>
          </div>
          <img
            src={professoraAluno}
            alt=""
            className="h-80 w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-headline-sm font-bold text-gray-900">
            Sessão Blog
          </h2>
          <Link
            to="/blog"
            className="text-label-lg font-medium text-blue-600 hover:underline"
          >
            Ver blog completo
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {postagens.map((postagem) => (
            <PostCard key={postagem.id} postagem={postagem} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-blue-50 px-6 py-10 text-center sm:px-12">
          <h2 className="text-headline-sm font-bold text-gray-900">
            O Adapta vai até você!
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-gray-700">
            O Adapta é um projeto educacional que torna a educação mais
            acessível para todas as crianças! Se quer saber mais ou precisa de
            ajuda com algum dos nossos jogos, entre em contato com a nossa
            equipe!
          </p>
          <div className="mt-6 text-body-md text-gray-600">
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
