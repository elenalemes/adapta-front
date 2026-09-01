import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { esqueciSenhaSchema } from "./schemas";
import { esqueciSenha } from "./authApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

export function EsqueciSenhaPage() {
  const [enviado, setEnviado] = useState(false);
  const [erroApi, setErroApi] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esqueciSenhaSchema) });

  async function onSubmit(dados) {
    setErroApi(null);
    try {
      await esqueciSenha(dados.email);
      // A API sempre responde 200 com a mesma mensagem, exista ou não a
      // conta — proposital, pra não revelar quais e-mails estão cadastrados.
      setEnviado(true);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível processar o pedido."));
    }
  }

  if (enviado) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Verifique seu e-mail</h1>
          <p className="text-gray-600">
            Se houver uma conta com esse e-mail, enviamos um link pra você redefinir a senha.
          </p>
          <Link to="/entrar" className="text-blue-600 hover:underline">
            Voltar pro login
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
        <h1 className="text-2xl font-bold text-gray-900">Esqueci minha senha</h1>
        <p className="text-sm text-gray-600">
          Informe o e-mail da sua conta e enviaremos um link pra você criar uma nova senha.
        </p>

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
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar link"}
        </button>

        <p className="text-center text-sm text-gray-600">
          <Link to="/entrar" className="text-blue-600 hover:underline">
            Voltar pro login
          </Link>
        </p>
      </form>
    </div>
  );
}
