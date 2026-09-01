import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "./schemas";
import { login } from "./authApi";
import { useAuth } from "../../shared/hooks/useAuth";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

export function LoginPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(dados) {
    setErroApi(null);
    try {
      const { token } = await login(dados);
      entrar(token);
      navigate("/");
    } catch (error) {
      // Login não tem erro por campo — o backend responde 401 genérico
      // ("E-mail ou senha inválidos") de propósito, pra não revelar qual
      // dos dois está errado. Também cobre o caso de conta não confirmada.
      setErroApi(mensagemDeErro(error, "Não foi possível entrar. Tente novamente."));
    }
  }

  return (
    <div className="flex items-center justify-center bg-white px-4 py-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 shadow-sm"
        noValidate
      >
        <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erroApi}
          </p>
        )}

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
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("senha")}
          />
          {errors.senha && (
            <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
          )}
          <Link
            to="/esqueci-senha"
            className="mt-1 inline-block text-xs text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
