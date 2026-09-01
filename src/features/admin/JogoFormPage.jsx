import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { jogoSchema } from "./jogoSchema";
import { listarAreas } from "../../shared/services/areasApi";
import {
  buscarJogoPorId,
  criarJogo,
  atualizarJogo,
  enviarImagemJogo,
} from "../../shared/services/jogosApi";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";

const ANOS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Busca os dados (áreas, e o jogo quando é edição) e só monta o formulário
// depois que tudo chegou. O `key` força o React a recriar o <JogoForm />
// do zero se a pessoa navegar de "editar jogo A" pra "editar jogo B" sem
// dar refresh — assim o estado interno nunca fica do jogo errado.
export function JogoFormPage() {
  const { id } = useParams();
  const modoEdicao = !!id;

  const { data: areas } = useQuery({ queryKey: ["areas"], queryFn: listarAreas });
  const { data: jogo, isLoading: carregandoJogo } = useQuery({
    queryKey: ["jogos", id],
    queryFn: () => buscarJogoPorId(id),
    enabled: modoEdicao,
  });

  if ((modoEdicao && carregandoJogo) || !areas) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando...</p>;
  }

  return (
    <JogoForm key={id ?? "novo"} modoEdicao={modoEdicao} id={id} jogo={jogo} areas={areas} />
  );
}

function JogoForm({ modoEdicao, id, jogo, areas }) {
  const navigate = useNavigate();

  const [componenteIds, setComponenteIds] = useState(
    () => jogo?.componentes?.map((c) => String(c.id)) ?? []
  );
  const [anoInicial, setAnoInicial] = useState(() =>
    jogo?.anoInicial ? String(jogo.anoInicial) : ""
  );
  const [anoFinal, setAnoFinal] = useState(() => (jogo?.anoFinal ? String(jogo.anoFinal) : ""));
  const [erroAnos, setErroAnos] = useState(null);
  const [erroComponentes, setErroComponentes] = useState(null);
  const [erroApi, setErroApi] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jogoSchema),
    defaultValues: {
      titulo: jogo?.titulo ?? "",
      descricao: jogo?.descricao ?? "",
      urlJogo: jogo?.urlJogo ?? "",
    },
  });

  function alternarComponente(componenteId) {
    const idStr = String(componenteId);
    setComponenteIds((atuais) =>
      atuais.includes(idStr) ? atuais.filter((c) => c !== idStr) : [...atuais, idStr]
    );
  }

  function validarCamposManuais() {
    let valido = true;

    if (componenteIds.length === 0) {
      setErroComponentes("Selecione ao menos um componente curricular.");
      valido = false;
    } else {
      setErroComponentes(null);
    }

    const temInicial = anoInicial !== "";
    const temFinal = anoFinal !== "";
    if (temInicial !== temFinal) {
      setErroAnos("Informe o ano inicial e o ano final juntos, ou deixe ambos em branco.");
      valido = false;
    } else if (temInicial && Number(anoInicial) > Number(anoFinal)) {
      setErroAnos("O ano inicial não pode ser maior que o ano final.");
      valido = false;
    } else {
      setErroAnos(null);
    }

    return valido;
  }

  async function onSubmit(dadosFormulario) {
    setErroApi(null);
    if (!validarCamposManuais()) return;

    const dto = {
      titulo: dadosFormulario.titulo,
      descricao: dadosFormulario.descricao,
      urlJogo: dadosFormulario.urlJogo || null,
      componenteIds: componenteIds.map(Number),
      anoInicial: anoInicial === "" ? null : Number(anoInicial),
      anoFinal: anoFinal === "" ? null : Number(anoFinal),
    };

    try {
      const jogoSalvo = modoEdicao ? await atualizarJogo(id, dto) : await criarJogo(dto);

      if (arquivoImagem) {
        await enviarImagemJogo(jogoSalvo.id, arquivoImagem);
      }

      navigate("/admin/jogos");
    } catch (error) {
      const tratouPorCampo = aplicarErrosDeValidacao(error, setError);
      if (!tratouPorCampo) {
        setErroApi(mensagemDeErro(error, "Não foi possível salvar o jogo."));
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {modoEdicao ? "Editar jogo" : "Novo jogo"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("titulo")}
          />
          {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("descricao")}
          />
          {errors.descricao && (
            <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="urlJogo">
            Link do jogo (WebGL)
          </label>
          <input
            id="urlJogo"
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("urlJogo")}
          />
          <p className="mt-1 text-xs text-gray-500">
            Deixe em branco se o jogo ainda estiver em desenvolvimento — ele aparece no
            catálogo normalmente, só sem o botão de jogar.
          </p>
          {errors.urlJogo && <p className="mt-1 text-sm text-red-600">{errors.urlJogo.message}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">Componentes curriculares</span>
          <div className="mt-2 space-y-3">
            {areas.map((area) => (
              <div key={area.id}>
                <p className="text-xs font-semibold uppercase text-gray-400">{area.nome}</p>
                <div className="mt-1 flex flex-wrap gap-3">
                  {area.componentes.map((componente) => (
                    <label
                      key={componente.id}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={componenteIds.includes(String(componente.id))}
                        onChange={() => alternarComponente(componente.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {componente.nome}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {erroComponentes && <p className="mt-1 text-sm text-red-600">{erroComponentes}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700">
            Faixa de anos (opcional)
          </span>
          <div className="mt-1 flex items-center gap-3">
            <select
              aria-label="Ano inicial"
              value={anoInicial}
              onChange={(evento) => setAnoInicial(evento.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">—</option>
              {ANOS.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}º ano
                </option>
              ))}
            </select>
            <span className="text-gray-400">até</span>
            <select
              aria-label="Ano final"
              value={anoFinal}
              onChange={(evento) => setAnoFinal(evento.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">—</option>
              {ANOS.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}º ano
                </option>
              ))}
            </select>
          </div>
          {erroAnos && <p className="mt-1 text-sm text-red-600">{erroAnos}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="imagem">
            Capa do jogo (opcional, até 10MB — jpg, jpeg, png ou webp)
          </label>
          <input
            id="imagem"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(evento) => setArquivoImagem(evento.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-blue-700"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/jogos")}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
