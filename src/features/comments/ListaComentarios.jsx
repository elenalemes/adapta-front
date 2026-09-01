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
export function ListaComentarios({ comentarios }) {
  if (comentarios.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhum comentário ainda. Seja a primeira pessoa a comentar!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {comentarios.map((comentario) => {
        const autorRemovido = !comentario.userId;
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
            <div>
              <p
                className={`text-sm font-medium ${
                  autorRemovido ? "italic text-gray-400" : "text-gray-900"
                }`}
              >
                {comentario.username ?? "Usuário excluído"}
              </p>
              <p className={`text-sm ${autorRemovido ? "italic text-gray-400" : "text-gray-700"}`}>
                {comentario.conteudo}
              </p>
              <p className="mt-1 text-xs text-gray-400">{formatarData(comentario.data)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
