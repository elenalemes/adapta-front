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

// Busca a postagem (só em modo edição) e só monta o formulário depois que
// os dados chegaram — mesmo padrão do JogoFormPage, pra não precisar
// sincronizar dado assíncrono com estado local via efeito.
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
    return <p className="px-4 py-24 text-center text-gray-500">Carregando...</p>;
  }

  // Editar é só do dono — admin modera (exclui), não reescreve texto alheio.
  if (modoEdicao && postagem && usuario?.id !== postagem.userId) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900">Acesso restrito</h1>
        <p className="mt-2 text-gray-600">Você só pode editar as próprias postagens.</p>
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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {modoEdicao ? "Editar postagem" : "Nova postagem"}
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
          <label className="block text-sm font-medium text-gray-700" htmlFor="conteudo">
            Conteúdo
          </label>
          <textarea
            id="conteudo"
            rows={10}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("conteudo")}
          />
          {errors.conteudo && (
            <p className="mt-1 text-sm text-red-600">{errors.conteudo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="imagem">
            Capa da postagem (opcional, até 10MB — jpg, jpeg, png ou webp)
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
            {isSubmitting ? "Salvando..." : "Publicar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
