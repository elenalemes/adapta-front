import { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { favoritar, desfavoritar } from "../../shared/services/favoritosApi";

export function BotaoFavoritar({ jogoId, favoritadoInicial }) {
  const { estaLogado } = useAuth();
  const [favoritado, setFavoritado] = useState(!!favoritadoInicial);
  const [enviando, setEnviando] = useState(false);

  if (!estaLogado) {
    return (
      <Link
        to="/entrar"
        className="flex items-center gap-2 rounded-full border border-borda px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        Favoritar
      </Link>
    );
  }

  async function alternar() {
    if (enviando) return;
    setEnviando(true);
    const novoValor = !favoritado;
    try {
      if (novoValor) {
        await favoritar(jogoId);
      } else {
        await desfavoritar(jogoId);
      }
      setFavoritado(novoValor);
    } catch {
      // Erro
    } finally {
      setEnviando(false);
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={enviando}
      aria-pressed={favoritado}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition disabled:opacity-50 ${
        favoritado
          ? "border-favorito bg-pink-50 text-favorito"
          : "border-borda text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Heart className="h-4 w-4" fill={favoritado ? "currentColor" : "none"} aria-hidden="true" />
      {favoritado ? "Favoritado" : "Favoritar"}
    </button>
  );
}
