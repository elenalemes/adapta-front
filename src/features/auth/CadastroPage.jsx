import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { cadastroSchema } from "./schemas";
import { cadastrar } from "./authApi";
import { aplicarErrosDeValidacao, mensagemDeErro } from "../../shared/utils/apiErrors";
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

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
          <h1 className="text-headline-sm font-bold text-gray-900">Quase lá!</h1>
          <p className="text-body-lg text-gray-600">
            Enviamos um link de confirmação para o seu e-mail. Confirme a
            conta antes de entrar.
          </p>
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
        <h1 className="text-headline-sm font-bold text-gray-900">Criar conta</h1>

        {erroApi && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
            {erroApi}
          </p>
        )}

        <Campo
          id="username"
          label="Nome de usuário"
          autoComplete="username"
          erro={errors.username?.message}
          {...register("username")}
        />

        <Campo
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          erro={errors.email?.message}
          {...register("email")}
        />

        <Campo
          id="senha"
          label="Senha"
          type="password"
          autoComplete="new-password"
          erro={errors.senha?.message}
          ajuda="Mínimo 6 caracteres, com uma maiúscula, um número e um símbolo."
          {...register("senha")}
        />

        <Botao type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Botao>

        <p className="text-center text-body-md text-gray-600">
          Já tem conta?{" "}
          <Link to="/entrar" className="text-blue-700 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
