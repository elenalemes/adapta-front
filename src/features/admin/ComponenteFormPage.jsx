import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { componenteSchema } from "./componenteSchema";
import { listarAreas } from "../../shared/services/areasApi";
import {
  buscarComponentePorId,
  criarComponente,
  atualizarComponente,
} from "../../shared/services/componentesApi";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";

// Mesmo padrão do JogoFormPage: busca os dados (áreas, e o componente quando
// é edição) e só monta o formulário depois que tudo chegou. O `key` recria
// o <ComponenteForm /> do zero se a pessoa for de "editar A" pra "editar B".
export function ComponenteFormPage() {
  const { id } = useParams();
  const modoEdicao = !!id;

  const { data: areas } = useQuery({ queryKey: ["areas"], queryFn: listarAreas });
  const { data: componente, isLoading: carregandoComponente } = useQuery({
    queryKey: ["componentes", id],
    queryFn: () => buscarComponentePorId(id),
    enabled: modoEdicao,
  });

  if ((modoEdicao && carregandoComponente) || !areas) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando...</p>;
  }

  return (
    <ComponenteForm
      key={id ?? "novo"}
      modoEdicao={modoEdicao}
      id={id}
      componente={componente}
      areas={areas}
    />
  );
}

function ComponenteForm({ modoEdicao, id, componente, areas }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [erroApi, setErroApi] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(componenteSchema),
    defaultValues: {
      nome: componente?.nome ?? "",
      codigo: componente?.codigo ?? "",
      descricao: componente?.descricao ?? "",
      areaId: componente?.areaId ? String(componente.areaId) : "",
    },
  });

  const { onChange: onChangeCodigo, ...camposCodigo } = register("codigo");

  async function onSubmit(dadosFormulario) {
    setErroApi(null);
    const dto = {
      nome: dadosFormulario.nome,
      codigo: dadosFormulario.codigo,
      descricao: dadosFormulario.descricao || null,
      areaId: Number(dadosFormulario.areaId),
    };

    try {
      if (modoEdicao) {
        await atualizarComponente(id, dto);
      } else {
        await criarComponente(dto);
      }
      // "areas" alimenta o FiltroBNCC e o formulário de jogos em outras
      // páginas — sem invalidar, elas continuariam mostrando o nome antigo.
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "componentes"] });
      navigate("/admin/componentes");
    } catch (error) {
      const tratouPorCampo = aplicarErrosDeValidacao(error, setError);
      if (!tratouPorCampo) {
        setErroApi(mensagemDeErro(error, "Não foi possível salvar o componente curricular."));
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {modoEdicao ? "Editar componente curricular" : "Novo componente curricular"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="nome">
            Nome
          </label>
          <input
            id="nome"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("nome")}
          />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="codigo">
            Código
          </label>
          <input
            id="codigo"
            placeholder="Ex.: LINGUA_PORTUGUESA"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 uppercase focus:border-blue-500 focus:outline-none"
            {...camposCodigo}
            onChange={(evento) => {
              // A classe CSS já mostra em maiúsculas, mas o valor real
              // precisa virar maiúsculo também — senão passa na tela e
              // falha na validação (o regex exige A-Z). Muta o evento antes
              // de repassar pro onChange do react-hook-form, que lê o value
              // direto do target.
              evento.target.value = evento.target.value.toUpperCase();
              onChangeCodigo(evento);
            }}
          />
          <p className="mt-1 text-xs text-gray-500">
            Só letras maiúsculas, números e underscore.
          </p>
          {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="descricao">
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("descricao")}
          />
          {errors.descricao && (
            <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="areaId">
            Área do conhecimento
          </label>
          <select
            id="areaId"
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("areaId")}
          >
            <option value="">Selecione a área do conhecimento</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>
          {errors.areaId && <p className="mt-1 text-sm text-red-600">{errors.areaId.message}</p>}
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
            onClick={() => navigate("/admin/componentes")}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
