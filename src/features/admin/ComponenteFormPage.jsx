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
import { Campo, Selecao } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";


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
    return <p className="px-4 py-24 text-center text-body-lg text-gray-500">Carregando...</p>;
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
      <h1 className="mb-6 text-headline-sm font-bold text-gray-900">
        {modoEdicao ? "Editar componente curricular" : "Novo componente curricular"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo id="nome" label="Nome" erro={errors.nome?.message} {...register("nome")} />

        <Campo
          id="codigo"
          label="Código"
          placeholder="Ex.: LINGUA_PORTUGUESA"
          className="uppercase"
          ajuda="Só letras maiúsculas, números e underscore."
          erro={errors.codigo?.message}
          {...camposCodigo}
          onChange={(evento) => {
            evento.target.value = evento.target.value.toUpperCase();
            onChangeCodigo(evento);
          }}
        />

        <Campo
          id="descricao"
          label="Descrição (opcional)"
          multilinha
          rows={3}
          erro={errors.descricao?.message}
          {...register("descricao")}
        />

        <Selecao
          id="areaId"
          label="Área do conhecimento"
          erro={errors.areaId?.message}
          {...register("areaId")}
        >
          <option value="">Selecione a área do conhecimento</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nome}
            </option>
          ))}
        </Selecao>

        <div className="flex flex-wrap gap-3">
          <Botao type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Botao>
          <Botao
            type="button"
            variante="secundario"
            onClick={() => navigate("/admin/componentes")}
          >
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
