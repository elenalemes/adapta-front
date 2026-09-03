import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { FormularioComentario } from "./FormularioComentario";

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Autor removido: userId/username/imagemUsuario vêm nulos e o backend já
// troca o conteúdo pelo aviso — só precisamos de um estilo diferente
// (itálico, cinza), não é um erro a tratar.
//
// Editar é só do dono; excluir é do dono OU admin (moderação, mesmo padrão
// já usado em postagens) — por isso os dois botões calculam permissões
// separadamente em vez de um único "podeGerenciar".
export function ListaComentarios({ comentarios, usuarioId, isAdmin, onEditar, onExcluir }) {
  const [editandoId, setEditandoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  if (comentarios.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhum comentário ainda. Seja a primeira pessoa a comentar!
      </p>
    );
  }

  async function handleExcluir(comentario) {
    const confirmou = window.confirm(
      "Excluir este comentário? Essa ação não pode ser desfeita."
    );
    if (!confirmou) return;

    setExcluindoId(comentario.id);
    try {
      await onExcluir(comentario.id);
    } catch {
      window.alert("Não foi possível excluir este comentário.");
    } finally {
      setExcluindoId(null);
    }
  }

  async function handleSalvarEdicao(comentario, novoConteudo) {
    await onEditar(comentario.id, novoConteudo);
    setEditandoId(null);
  }

  return (
    <ul className="space-y-4">
      {comentarios.map((comentario) => {
        const autorRemovido = !comentario.userId;
        const ehDono = !!usuarioId && usuarioId === comentario.userId;
        const podeEditar = ehDono;
        const podeExcluir = ehDono || isAdmin;
        const editando = editandoId === comentario.id;

        return (
          <li key={comentario.id} className="flex gap-3">
            <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
              {comentario.imagemUsuario && (
                <img
                  src={comentario.imagemUsuario}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-sm font-medium ${
                    autorRemovido ? "italic text-gray-400" : "text-gray-900"
                  }`}
                >
                  {comentario.username ?? "Usuário excluído"}
                </p>

                {!editando && (podeEditar || podeExcluir) && (
                  <div className="flex flex-shrink-0 gap-2">
                    {podeEditar && (
                      <button
                        type="button"
                        onClick={() => setEditandoId(comentario.id)}
                        className="text-gray-400 hover:text-blue-600"
                        aria-label="Editar comentário"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {podeExcluir && (
                      <button
                        type="button"
                        onClick={() => handleExcluir(comentario)}
                        disabled={excluindoId === comentario.id}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                        aria-label="Excluir comentário"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editando ? (
                <div className="mt-2">
                  <FormularioComentario
                    valorInicial={comentario.conteudo}
                    textoBotao="Salvar"
                    textoBotaoEnviando="Salvando..."
                    onEnviar={(novoConteudo) => handleSalvarEdicao(comentario, novoConteudo)}
                    onCancelar={() => setEditandoId(null)}
                  />
                </div>
              ) : (
                <>
                  <p
                    className={`text-sm ${autorRemovido ? "italic text-gray-400" : "text-gray-700"}`}
                  >
                    {comentario.conteudo}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{formatarData(comentario.data)}</p>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
