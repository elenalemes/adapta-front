import { useState } from "react";
import { mensagemDeErro } from "../../shared/utils/apiErrors";
import { Botao } from "../../shared/components/Botao";

export function FormularioComentario({
  onEnviar,
  placeholder = "Escreva um comentário...",
  valorInicial = "",
  textoBotao = "Comentar",
  textoBotaoEnviando = "Publicando...",
  onCancelar,
}) {
  const [texto, setTexto] = useState(valorInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (!texto.trim()) return;

    setErro(null);
    setEnviando(true);
    try {
      await onEnviar(texto.trim());
      if (!onCancelar) setTexto("");
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível publicar o comentário."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {erro && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
          {erro}
        </p>
      )}
      <textarea
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        rows={3}
        maxLength={1000}
        className="w-full rounded-xl border border-borda p-3 text-body-lg text-gray-900"
      />
      <div className="flex gap-3">
        <Botao type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? textoBotaoEnviando : textoBotao}
        </Botao>
        {onCancelar && (
          <Botao type="button" variante="secundario" onClick={onCancelar}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}
