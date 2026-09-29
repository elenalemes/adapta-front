import sobreNos1 from "../../assets/sobrenos_1.png";

export function SobreNosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-headline-lg font-bold text-gray-900">
        Sobre o Adapta
      </h1>

      <p className="mt-6 text-body-lg text-texto-fraco">
        O Adapta nasceu dentro do +Ludus, um projeto de estudantes e professores
        do Instituto Federal Sul-rio-grandense (IFSul) dedicado à criação de
        jogos digitais educacionais acessíveis. Ao longo do desenvolvimento
        desses jogos, percebeu-se a necessidade de um ambiente organizado,
        acessível e disponível direto no navegador para reunir os jogos e
        disponibiliza-los à comunidade. Assim, o Adapta foi criado para ser um
        catálogo de jogos educativos voltados especialmente para crianças com
        Transtorno do Espectro Autista (TEA), mas que podem ser aproveitados por
        qualquer criança.
      </p>

      <p className="mt-4 text-body-lg text-texto-fraco">
        Hoje o Adapta reúne jogos educativos organizados pelas áreas de
        conhecimento e componentes curriculares da Base Nacional Comum
        Curricular (BNCC), para que professores, terapeutas e famílias
        encontrem, em um só lugar, atividades pensadas de verdade para o jeito
        de aprender de cada criança.
      </p>

      <h2 className="mt-14 text-headline-sm font-bold text-gray-900">
        Os jogos
      </h2>

      <p className="mt-4 text-body-lg text-texto-fraco">
        Por enquanto, nosso catálogo disponibiliza dois jogos: O Jogo das
        Sílabas e o Abc em Movimento. O Jogo das Sílabas trabalha o
        reconhecimento de vogais e consoantes, a contagem de letras e a
        consciência silábica, voltado ao segundo e ao terceiro anos do ensino
        fundamental. Já o Abc em Movimento é focado na consciência fonológica e
        fonêmica das palavras, incluindo rimas, percepção da quantidade de sons
        e distinção entre letras, números e símbolos, voltado ao primeiro e ao
        segundo anos. Os dois jogos podem ser jogados direto pelo catálogo, sem
        necessidade de instalação.
      </p>

      <h2 className="mt-14 text-headline-sm font-bold text-gray-900">
        Compromisso com a acessibilidade
      </h2>

      <p className="mt-4 text-body-lg text-texto-fraco">
        O Adapta segue as diretrizes de acessibilidade WCAG 2.1 no nível AA e as
        recomendações do GAIA, guia de acessibilidade de interfaces voltado
        especificamente às necessidades de pessoas com Transtorno do Espectro
        Autista (TEA). Isso significa que o cuidado com contraste, tamanho de
        fonte, previsibilidade dos elementos e clareza das instruções não é só
        um recurso da plataforma: é um compromisso com a experiência de quem
        usa. Você pode conferir mais sobre as diretrizes de acessibilidade que
        seguimos nos links abaixo:
        <p>WCAG: https://guia-wcag.com/</p>
        <p>GAIA: https://gaia.wiki.br//</p>
      </p>

      <div className="mt-14 rounded-3xl bg-blue-50 px-6 py-10 text-center sm:px-12">
        <h2 className="text-headline-sm font-bold text-gray-900">
          Fale com a gente
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-gray-700">
          Tem alguma dúvida, sugestão ou quer saber mais sobre o Adapta? Entre
          em contato com a nossa equipe.
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
    </div>
  );
}
