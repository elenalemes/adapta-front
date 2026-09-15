import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "./schemas";
import { login } from "./authApi";
import { useAuth } from "../../shared/hooks/useAuth";
import { mensagemDeErro } from "../../shared/utils/apiErrors";
import { Campo } from "../../shared/components/Campo";
import { Botao } from "../../shared/components/Botao";

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
        <h1 className="text-headline-sm font-bold text-gray-900">Entrar</h1>

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

        <div>
          <Campo
            id="senha"
            label="Senha"
            type="password"
            autoComplete="current-password"
            erro={errors.senha?.message}
            {...register("senha")}
          />
          <Link
            to="/esqueci-senha"
            className="mt-1 inline-block py-2 text-body-md text-blue-700 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Botao type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Botao>

        <p className="text-center text-body-md text-gray-600">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-blue-700 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
