import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logoAzul from "../../assets/logo_azul.png";

const LINKS = [
  { to: "/jogos", label: "Jogos" },
  { to: "/sobre-nos", label: "Sobre nós" },
  { to: "/blog", label: "Blog" },
];

export function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center" aria-label="Ir para a página inicial do Adapta">
          <img src={logoAzul} alt="Adapta" className="h-9 w-auto" />
        </Link>

        <nav aria-label="Navegação principal" className="hidden gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 transition hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ContaMenu />
          <button
            type="button"
            onClick={() => setMenuAberto((valor) => !valor)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            className="text-gray-700 md:hidden"
          >
            {menuAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal (mobile)"
          className="border-t border-gray-100 md:hidden"
        >
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuAberto(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function ContaMenu() {
  const { estaLogado, usuario, carregandoUsuario, isAdmin, sair } = useAuth();
  const [aberto, setAberto] = useState(false);

  if (!estaLogado) {
    return (
      <Link
        to="/entrar"
        className="rounded-full border border-blue-600 bg-white px-5 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-50"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-50"
      >
        {carregandoUsuario ? "Carregando..." : (usuario?.username ?? "Minha conta")}
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          <Link
            to="/perfil"
            role="menuitem"
            onClick={() => setAberto(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Meu perfil
          </Link>
          {isAdmin && (
            <Link
              to="/admin/jogos"
              role="menuitem"
              onClick={() => setAberto(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Painel admin
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              sair();
              setAberto(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
