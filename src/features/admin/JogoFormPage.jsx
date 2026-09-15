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
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

const ANOS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    return <p className="px-4 py-24 text-center text-body-lg text-gray-500">Carregando...</p>;
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
      <h1 className="mb-6 text-headline-sm font-bold text-gray-900">
        {modoEdicao ? "Editar jogo" : "Novo jogo"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo id="titulo" label="Título" erro={errors.titulo?.message} {...register("titulo")} />

        <Campo
          id="descricao"
          label="Descrição"
          multilinha
          rows={4}
          erro={errors.descricao?.message}
          {...register("descricao")}
        />

        <Campo
          id="urlJogo"
          label="Link do jogo (WebGL)"
          placeholder="https://..."
          ajuda="Deixe em branco se o jogo ainda estiver em desenvolvimento — ele aparece no catálogo normalmente, só sem o botão de jogar."
          erro={errors.urlJogo?.message}
          {...register("urlJogo")}
        />

        <fieldset>
          <legend className="text-title-sm text-gray-700">Componentes curriculares</legend>
          <div
            className="mt-2 space-y-3"
            aria-describedby={erroComponentes ? "erro-componentes" : undefined}
          >
            {areas.map((area) => (
              <div key={area.id}>
                <p className="text-label-md uppercase text-texto-fraco">{area.nome}</p>
                <div className="mt-1 flex flex-wrap gap-x-4">
                  {area.componentes.map((componente) => (
                    <label
                      key={componente.id}
                      className="inline-flex min-h-11 items-center gap-2 text-body-lg text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={componenteIds.includes(String(componente.id))}
                        onChange={() => alternarComponente(componente.id)}
                        className="h-5 w-5 rounded border-borda text-blue-600"
                      />
                      {componente.nome}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {erroComponentes && (
            <p id="erro-componentes" className="mt-1 text-body-md text-red-700" role="alert">
              {erroComponentes}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="text-title-sm text-gray-700">Faixa de anos (opcional)</legend>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <select
              aria-label="Ano inicial"
              value={anoInicial}
              onChange={(evento) => setAnoInicial(evento.target.value)}
              className="min-h-11 rounded-lg border border-borda bg-white px-3 text-body-lg text-gray-900"
            >
              <option value="">—</option>
              {ANOS.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}º ano
                </option>
              ))}
            </select>
            <span className="text-body-lg text-gray-700">até</span>
            <select
              aria-label="Ano final"
              value={anoFinal}
              onChange={(evento) => setAnoFinal(evento.target.value)}
              className="min-h-11 rounded-lg border border-borda bg-white px-3 text-body-lg text-gray-900"
            >
              <option value="">—</option>
              {ANOS.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}º ano
                </option>
              ))}
            </select>
          </div>
          {erroAnos && (
            <p className="mt-1 text-body-md text-red-700" role="alert">
              {erroAnos}
            </p>
          )}
        </fieldset>

        <div>
          <label className="block text-title-sm text-gray-700" htmlFor="imagem">
            Capa do jogo (opcional, até 10MB — jpg, jpeg, png ou webp)
          </label>
          <input
            id="imagem"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(evento) => setArquivoImagem(evento.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-body-md text-gray-600 file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:text-label-lg file:text-white file:transition hover:file:bg-blue-700"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Botao type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Botao>
          <Botao type="button" variante="secundario" onClick={() => navigate("/admin/jogos")}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
