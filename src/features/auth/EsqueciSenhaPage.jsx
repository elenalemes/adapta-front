import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { esqueciSenhaSchema } from "./schemas";
import { esqueciSenha } from "./authApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

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
      setEnviado(true);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível processar o pedido."));
    }
  }

  if (enviado) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-headline-sm font-bold text-gray-900">Verifique seu e-mail</h1>
          <p className="text-body-lg text-gray-600">
            Se houver uma conta com esse e-mail, enviamos um link pra você redefinir a senha.
          </p>
          <Link to="/entrar" className="inline-block py-2 text-body-lg text-blue-700 hover:underline">
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
        <h1 className="text-headline-sm font-bold text-gray-900">Esqueci minha senha</h1>
        <p className="text-body-lg text-gray-600">
          Informe o e-mail da sua conta e enviaremos um link pra você criar uma nova senha.
        </p>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          erro={errors.email?.message}
          {...register("email")}
        />

        <Botao type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando..." : "Enviar link"}
        </Botao>

        <p className="text-center text-body-md text-gray-600">
          <Link to="/entrar" className="inline-block py-2 text-blue-700 hover:underline">
            Voltar pro login
          </Link>
        </p>
      </form>
    </div>
  );
}
