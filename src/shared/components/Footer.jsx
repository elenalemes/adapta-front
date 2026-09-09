import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import logoBranco from "../../assets/logo_branco.png";

const LINKS = [
  { to: "/jogos", label: "Jogos" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre-nos", label: "Sobre nós" },
  { to: "/ajuda", label: "Ajuda" },
];

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-blue-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-left">
          <h2 className="text-lg font-semibold text-white">Conheça o Adapta</h2>
          <ul className="mt-4 space-y-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-blue-100 transition hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <img src={logoBranco} alt="Adapta" className="h-12 w-auto" />
      </div>

      <div className="border-t border-blue-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-blue-200 sm:flex-row">
          <p>Adapta® — Copyright {ano}. Todos os direitos reservados.</p>
          <div className="flex gap-3">
            <a href="#" aria-label="WhatsApp" className="transition hover:text-white">
              <MessageCircle size={18} />
            </a>
            <a href="#" aria-label="E-mail" className="transition hover:text-white">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
