import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import { perfilSchema } from "./perfilSchema";
import { atualizarPerfil, enviarFotoPerfil, excluirConta } from "../../shared/services/usersApi";
import { listarFavoritos } from "../../shared/services/favoritosApi";
import { listarPostagensPorAutor } from "../posts/postagensApi";
import { JogoCard } from "../games/JogoCard";
import { PostCard } from "../posts/PostCard";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";

// Só monta depois que o /users/me (via AuthContext) já respondeu — evita
// precisar sincronizar dados assíncronos com estado local via efeito.
export function ProfilePage() {
  const { usuario, carregandoUsuario } = useAuth();

  if (carregandoUsuario || !usuario) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando perfil...</p>;
  }

  return <PerfilConteudo key={usuario.id} usuario={usuario} />;
}

function PerfilConteudo({ usuario }) {
  const { sair } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);

  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState(null);
  const [erroApi, setErroApi] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: { username: usuario.username, email: usuario.email },
  });

  const { data: favoritos, isLoading: carregandoFavoritos } = useQuery({
    queryKey: ["favoritos"],
    queryFn: listarFavoritos,
  });

  const { data: minhasPostagens, isLoading: carregandoPostagens } = useQuery({
    queryKey: ["postagens", "usuario", usuario.id],
    queryFn: () => listarPostagensPorAutor(usuario.id, { size: 6 }),
  });

  async function onSubmit(dados) {
    setErroApi(null);
    setSucesso(false);
    try {
      await atualizarPerfil(usuario.id, dados);
      // Refaz o /users/me: assim a navbar e o resto do app também atualizam
      // o nome/e-mail exibidos, não só esta tela.
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      setSucesso(true);
    } catch (error) {
      const tratouPorCampo = aplicarErrosDeValidacao(error, setError);
      if (!tratouPorCampo) {
        setErroApi(mensagemDeErro(error, "Não foi possível salvar as alterações."));
      }
    }
  }

  async function handleTrocarFoto(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    setErroFoto(null);
    setEnviandoFoto(true);
    try {
      await enviarFotoPerfil(usuario.id, arquivo);
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    } catch (error) {
      setErroFoto(mensagemDeErro(error, "Não foi possível trocar a foto."));
    } finally {
      setEnviandoFoto(false);
      evento.target.value = ""; // permite escolher o mesmo arquivo de novo se precisar
    }
  }

  async function handleExcluirConta() {
    const confirmou = window.confirm(
      "Excluir sua conta é permanente. Seus comentários e postagens ficam marcados como " +
        "removidos, mas continuam no ar. Quer mesmo continuar?"
    );
    if (!confirmou) return;

    setExcluindo(true);
    try {
      await excluirConta(usuario.id);
      sair();
      navigate("/");
    } catch {
      window.alert("Não foi possível excluir a conta agora. Tente novamente mais tarde.");
      setExcluindo(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Meu perfil</h1>

      <section className="mb-10 flex items-center gap-5">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
          {usuario.imagem ? (
            <img src={usuario.imagem} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <User className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            disabled={enviandoFoto}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {enviandoFoto ? "Enviando..." : "Trocar foto"}
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleTrocarFoto}
            className="hidden"
          />
          {erroFoto && <p className="mt-1 text-sm text-red-600">{erroFoto}</p>}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Dados da conta</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4" noValidate>
          {erroApi && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {erroApi}
            </p>
          )}
          {sucesso && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Dados atualizados.
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Nome de usuário
            </label>
            <input
              id="username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register("username")}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Meus favoritos</h2>
        {carregandoFavoritos && <p className="text-gray-500">Carregando...</p>}
        {!carregandoFavoritos && favoritos?.length === 0 && (
          <p className="text-gray-500">Você ainda não favoritou nenhum jogo.</p>
        )}
        {favoritos?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((jogo) => (
              <JogoCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Minhas postagens</h2>
        {carregandoPostagens && <p className="text-gray-500">Carregando...</p>}
        {!carregandoPostagens && minhasPostagens?.conteudo?.length === 0 && (
          <p className="text-gray-500">Você ainda não publicou nada no blog.</p>
        )}
        {minhasPostagens?.conteudo?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {minhasPostagens.conteudo.map((postagem) => (
              <PostCard key={postagem.id} postagem={postagem} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-100 pt-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Excluir conta</h2>
        <p className="mb-4 text-sm text-gray-600">
          Essa ação é permanente. Seus comentários e postagens continuam no ar, marcados
          como de uma conta removida.
        </p>
        <button
          type="button"
          onClick={handleExcluirConta}
          disabled={excluindo}
          className="rounded-full border border-red-300 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {excluindo ? "Excluindo..." : "Excluir minha conta"}
        </button>
      </section>
    </div>
  );
}
