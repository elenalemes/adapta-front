import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RotaProtegida() {
  const { estaLogado } = useAuth();
  const location = useLocation();

  if (!estaLogado) {
    return <Navigate to="/entrar" state={{ de: location.pathname }} replace />;
  }

  return <Outlet />;
}
