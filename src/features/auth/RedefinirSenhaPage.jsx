import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { redefinirSenhaSchema } from "./schemas";
import { redefinirSenha } from "./authApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

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
      setErroApi(mensagemDeErro(error, "Não foi possível redefinir a senha."));
    }
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-headline-sm font-bold text-gray-900">Link inválido</h1>
          <p className="text-body-lg text-gray-600">
            Esse link de redefinição está incompleto. Peça um novo na tela de recuperação de
            senha.
          </p>
          <Link
            to="/esqueci-senha"
            className="inline-block py-2 text-body-lg text-blue-700 hover:underline"
          >
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
          <h1 className="text-headline-sm font-bold text-gray-900">Senha redefinida!</h1>
          <p className="text-body-lg text-gray-600">Você já pode entrar com a nova senha.</p>
          <Link to="/entrar" className="inline-block py-2 text-body-lg text-blue-700 hover:underline">
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
        <h1 className="text-headline-sm font-bold text-gray-900">Nova senha</h1>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo
          id="novaSenha"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          erro={errors.novaSenha?.message}
          ajuda="Mínimo 6 caracteres, com uma maiúscula, um número e um símbolo."
          {...register("novaSenha")}
        />

        <Campo
          id="confirmarSenha"
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          erro={errors.confirmarSenha?.message}
          {...register("confirmarSenha")}
        />

        <Botao type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </Botao>
      </form>
    </div>
  );
}
