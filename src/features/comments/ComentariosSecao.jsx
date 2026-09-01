import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { ListaComentarios } from "./ListaComentarios";
import { FormularioComentario } from "./FormularioComentario";
import {
  listarComentariosDoJogo,
  comentarJogo,
  listarComentariosDaPostagem,
  comentarPostagem,
} from "./comentariosApi";

/**
 * Seção de comentários reutilizável entre jogo e postagem — só troca qual
 * par de funções da API usar. Recebe os 5 mais recentes já carregados (vêm
 * de dentro do detalhe do jogo/postagem) e só busca o resto sob demanda.
 */
export function ComentariosSecao({ tipo, alvoId, comentariosIniciais, totalInicial }) {
  const { estaLogado } = useAuth();
  const [comentarios, setComentarios] = useState(comentariosIniciais);
  const [total, setTotal] = useState(totalInicial);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const listar = tipo === "jogo" ? listarComentariosDoJogo : listarComentariosDaPostagem;
  const comentar = tipo === "jogo" ? comentarJogo : comentarPostagem;

  async function carregarTodos() {
    setCarregandoMais(true);
    try {
      const pagina = await listar(alvoId, { page: 0, size: Math.max(total, 20) });
      setComentarios(pagina.conteudo);
      setTotal(pagina.totalElementos);
    } finally {
      setCarregandoMais(false);
    }
  }

  async function handleNovoComentario(conteudo) {
    const novo = await comentar(alvoId, conteudo);
    setComentarios((atuais) => [novo, ...atuais]);
    setTotal((atual) => atual + 1);
  }

  const mostrandoTodos = comentarios.length >= total;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Comentários {total > 0 && `(${total})`}
      </h2>

      {estaLogado ? (
        <FormularioComentario onEnviar={handleNovoComentario} />
      ) : (
        <p className="text-sm text-gray-600">
          <Link to="/entrar" className="text-blue-600 hover:underline">
            Entre
          </Link>{" "}
          pra deixar um comentário.
        </p>
      )}

      <ListaComentarios comentarios={comentarios} />

      {!mostrandoTodos && (
        <button
          type="button"
          onClick={carregarTodos}
          disabled={carregandoMais}
          className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
        >
          {carregandoMais ? "Carregando..." : `Ver todos os ${total} comentários`}
        </button>
      )}
    </section>
  );
}
