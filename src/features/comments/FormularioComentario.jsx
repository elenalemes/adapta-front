import { useState } from "react";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

export function FormularioComentario({ onEnviar, placeholder = "Escreva um comentário..." }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!texto.trim()) return;

    setErro(null);
    setEnviando(true);
    try {
      await onEnviar(texto.trim());
      setTexto(""); // só limpa o campo se deu certo
    } catch (error) {
      // Se a moderação recusar o texto (400 "Conteúdo inadequado"), a
      // mensagem não diz qual palavra foi barrada de propósito — por isso
      // mantemos o texto no campo pra pessoa editar, em vez de reescrever tudo.
      setErro(mensagemDeErro(error, "Não foi possível publicar o comentário."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {erro && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {erro}
        </p>
      )}
      <textarea
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={1000}
        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={enviando || !texto.trim()}
        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {enviando ? "Publicando..." : "Comentar"}
      </button>
    </form>
  );
}
