import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, setToken, clearToken } from "../shared/services/token";
import { buscarUsuarioLogado } from "../features/auth/authApi";
import { AuthContext } from "../shared/context/AuthContext";

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
