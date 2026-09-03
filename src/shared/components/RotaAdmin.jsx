import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ABAS = [
  { to: "/admin/jogos", label: "Jogos" },
  { to: "/admin/componentes", label: "Componentes" },
  { to: "/admin/usuarios", label: "Usuários" },
];

/**
 * Protege toda a árvore de rotas /admin/*. Esconder o link no menu é só
 * conveniência — quem realmente barra é o backend (@Secured("ROLE_ADMIN")
 * em cada endpoint, 403 se tentar mesmo assim). Este guard existe pra dar
 * uma mensagem clara em vez de deixar a pessoa tomar erro de API.
 */
export function RotaAdmin() {
  const { estaLogado, isAdmin, carregandoUsuario } = useAuth();
  const location = useLocation();

  if (!estaLogado) {
    return <Navigate to="/entrar" state={{ de: location.pathname }} replace />;
  }

  if (carregandoUsuario) {
    return <p className="px-4 py-24 text-center text-gray-500">Carregando...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900">Acesso restrito</h1>
        <p className="mt-2 text-gray-600">Essa área é só para administradores.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-100 bg-gray-50">
        <nav className="mx-auto flex max-w-5xl gap-6 px-4" aria-label="Navegação de administração">
          {ABAS.map((aba) => (
            <NavLink
              key={aba.to}
              to={aba.to}
              className={({ isActive }) =>
                `border-b-2 px-1 py-3 text-sm font-medium ${
                  isActive
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {aba.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
