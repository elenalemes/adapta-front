import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Guard genérico pra qualquer rota que só exige estar logado (perfil,
// publicar no blog, etc.) — diferente do RotaAdmin, que também checa perfil.
export function RotaProtegida() {
  const { estaLogado } = useAuth();
  const location = useLocation();

  if (!estaLogado) {
    return <Navigate to="/entrar" state={{ de: location.pathname }} replace />;
  }

  return <Outlet />;
}
