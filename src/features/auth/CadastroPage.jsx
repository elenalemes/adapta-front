import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { cadastroSchema } from "./schemas";
import { cadastrar } from "./authApi";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";

export function CadastroPage() {
  const [erroApi, setErroApi] = useState(null);
  const [contaCriada, setContaCriada] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(cadastroSchema) });

  async function onSubmit(dados) {
    setErroApi(null);
    try {
      await cadastrar(dados);
      // Cadastro não devolve token: a conta só fica utilizável depois de
      // confirmada pelo link enviado por e-mail (POST /users é só o passo 1).
      setContaCriada(true);
    } catch (error) {
      const tratouPorCampo = aplicarErrosDeValidacao(error, setError);
      if (!tratouPorCampo) {
        setErroApi(mensagemDeErro(error, "Não foi possível criar sua conta."));
      }
    }
  }

  if (contaCriada) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Quase lá!</h1>
          <p className="text-gray-600">
            Enviamos um link de confirmação para o seu e-mail. Confirme a
            conta antes de entrar.
          </p>
          <Link to="/entrar" className="text-blue-600 hover:underline">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-white px-4 py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 shadow-sm"
        noValidate
      >
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="username">
            Nome de usuário
          </label>
          <input
            id="username"
            autoComplete="username"
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
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("senha")}
          />
          {errors.senha && (
            <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 6 caracteres, com uma maiúscula, um número e um símbolo.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <Link to="/entrar" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
