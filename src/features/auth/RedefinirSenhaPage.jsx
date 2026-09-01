import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { redefinirSenhaSchema } from "./schemas";
import { redefinirSenha } from "./authApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

// Rota que o link do e-mail aponta: /redefinir-senha?token=xxx
export function RedefinirSenhaPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [concluido, setConcluido] = useState(false);
  const [erroApi, setErroApi] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(redefinirSenhaSchema) });

  async function onSubmit(dados) {
    setErroApi(null);
    try {
      await redefinirSenha(token, dados.novaSenha);
      setConcluido(true);
    } catch (error) {
      // Token vencido (1h) ou já usado cai aqui, com a mensagem do backend.
      setErroApi(mensagemDeErro(error, "Não foi possível redefinir a senha."));
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Link inválido</h1>
          <p className="text-gray-600">
            Esse link de redefinição está incompleto. Peça um novo na tela de recuperação de
            senha.
          </p>
          <Link to="/esqueci-senha" className="text-blue-600 hover:underline">
            Pedir novo link
          </Link>
        </div>
      </div>
    );
  }

  if (concluido) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Senha redefinida!</h1>
          <p className="text-gray-600">Você já pode entrar com a nova senha.</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Nova senha</h1>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="novaSenha">
            Nova senha
          </label>
          <input
            id="novaSenha"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("novaSenha")}
          />
          {errors.novaSenha && (
            <p className="mt-1 text-sm text-red-600">{errors.novaSenha.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 6 caracteres, com uma maiúscula, um número e um símbolo.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="confirmarSenha">
            Confirmar nova senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            {...register("confirmarSenha")}
          />
          {errors.confirmarSenha && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmarSenha.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}
