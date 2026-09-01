import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, setToken, clearToken } from "../shared/services/token";
import { buscarUsuarioLogado } from "../features/auth/authApi";
import { AuthContext } from "../shared/context/AuthContext";

/**
 * Fonte única da verdade sobre "quem está logado" no app inteiro.
 *
 * Importante: o backend NÃO diz se a pessoa é admin dentro do token — isso
 * só vem consultando GET /users/me (campo `perfis`). Por isso, ter um token
 * salvo dispara automaticamente essa consulta aqui, uma vez, e o resultado
 * fica em cache pelo TanStack Query em vez de cada tela buscar de novo.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [temToken, setTemToken] = useState(() => !!getToken());

  const { data: usuario, isLoading } = useQuery({
    queryKey: ["users", "me"],
    queryFn: buscarUsuarioLogado,
    enabled: temToken,
    retry: false,
  });

  const entrar = useCallback((token) => {
    setToken(token);
    setTemToken(true);
  }, []);

  const sair = useCallback(() => {
    clearToken();
    setTemToken(false);
    queryClient.removeQueries({ queryKey: ["users", "me"] });
  }, [queryClient]);

  const isAdmin = !!usuario?.perfis?.some((p) => p.nome === "ROLE_ADMIN");

  const value = {
    usuario,
    estaLogado: temToken,
    carregandoUsuario: temToken && isLoading,
    isAdmin,
    entrar,
    sair,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
