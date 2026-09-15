import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postagemSchema } from "./postagemSchema";
import {
  buscarPostagemPorId,
  criarPostagem,
  atualizarPostagem,
  enviarImagemPostagem,
} from "./postagensApi";
import { useAuth } from "../../shared/hooks/useAuth";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

export function PostFormPage() {
  const { id } = useParams();
  const modoEdicao = !!id;
  const { usuario } = useAuth();

  const { data: postagem, isLoading } = useQuery({
    queryKey: ["postagens", id],
    queryFn: () => buscarPostagemPorId(id),
    enabled: modoEdicao,
  });

  if (modoEdicao && isLoading) {
    return <p className="px-4 py-24 text-center text-body-lg text-gray-500">Carregando...</p>;
  }

  if (modoEdicao && postagem && usuario?.id !== postagem.userId) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-headline-sm font-bold text-gray-900">Acesso restrito</h1>
        <p className="mt-2 text-body-lg text-gray-600">
          Você só pode editar as próprias postagens.
        </p>
      </div>
    );
  }

  return (
    <PostForm key={id ?? "nova"} modoEdicao={modoEdicao} id={id} postagem={postagem} />
  );
}

function PostForm({ modoEdicao, id, postagem }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [erroApi, setErroApi] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(postagemSchema),
    defaultValues: {
      titulo: postagem?.titulo ?? "",
      conteudo: postagem?.conteudo ?? "",
    },
  });

  async function onSubmit(dados) {
    setErroApi(null);
    try {
      const postagemSalva = modoEdicao
        ? await atualizarPostagem(id, dados)
        : await criarPostagem(dados);

      if (arquivoImagem) {
        await enviarImagemPostagem(postagemSalva.id, arquivoImagem);
      }

      queryClient.invalidateQueries({ queryKey: ["postagens"] });
      navigate(`/blog/${postagemSalva.id}`);
    } catch (error) {
      const tratouPorCampo = aplicarErrosDeValidacao(error, setError);
      if (!tratouPorCampo) {
        setErroApi(mensagemDeErro(error, "Não foi possível salvar a postagem."));
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-headline-sm font-bold text-gray-900">
        {modoEdicao ? "Editar postagem" : "Nova postagem"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo
          id="titulo"
          label="Título"
          erro={errors.titulo?.message}
          {...register("titulo")}
        />

        <Campo
          id="conteudo"
          label="Conteúdo"
          multilinha
          rows={10}
          erro={errors.conteudo?.message}
          {...register("conteudo")}
        />

        <div>
          <label className="block text-title-sm text-gray-700" htmlFor="imagem">
            Capa da postagem (opcional, até 10MB — jpg, jpeg, png ou webp)
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
            {isSubmitting ? "Salvando..." : "Publicar"}
          </Botao>
          <Botao type="button" variante="secundario" onClick={() => navigate("/blog")}>
            Cancelar
          </Botao>
        </div>
      </form>
    </div>
  );
}
