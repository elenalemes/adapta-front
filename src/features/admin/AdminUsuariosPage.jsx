import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useAuth } from "../../shared/hooks/useAuth";
import {
  listarUsuarios,
  promoverAdmin,
  removerAdmin,
  excluirConta,
} from "../../shared/services/usersApi";
import { mensagemDeErro } from "../../shared/utils/apiErrors";

const TAMANHO_PAGINA = 20;

function isAdminUser(usuario) {
  return !!usuario.perfis?.some((p) => p.nome === "ROLE_ADMIN");
}

export function AdminUsuariosPage() {
  const { usuario: admLogado } = useAuth();
  const [pagina, setPagina] = useState(0);
  const [idEmAcao, setIdEmAcao] = useState(null);
  const [erro, setErro] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "usuarios", pagina],
    queryFn: () => listarUsuarios({ page: pagina, size: TAMANHO_PAGINA }),
  });

  function invalidar() {
    queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
  }

  async function handlePromover(usuario) {
    setErro(null);
    setIdEmAcao(usuario.id);
    try {
      await promoverAdmin(usuario.id);
      invalidar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível promover este usuário."));
    } finally {
      setIdEmAcao(null);
    }
  }

  async function handleRemoverAdmin(usuario) {
    setErro(null);
    setIdEmAcao(usuario.id);
    try {
      await removerAdmin(usuario.id);
      invalidar();
    } catch (error) {
      // Cobre o caso "não é possível remover o próprio acesso de admin",
      // que o backend recusa mesmo que o botão já venha desabilitado aqui.
      setErro(mensagemDeErro(error, "Não foi possível remover o acesso de administrador."));
    } finally {
      setIdEmAcao(null);
    }
  }

  async function handleExcluir(usuario) {
    const confirmou = window.confirm(
      `Excluir a conta de "${usuario.username}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setErro(null);
    setIdEmAcao(usuario.id);
    try {
      await excluirConta(usuario.id);
      invalidar();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível excluir esta conta."));
    } finally {
      setIdEmAcao(null);
    }
  }

  const usuarios = data?.conteudo ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Usuários</h1>

      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {erro}
        </p>
      )}

      {isLoading && <p className="text-gray-500">Carregando...</p>}

      {!isLoading && usuarios.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Usuário</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((usuario) => {
                const admin = isAdminUser(usuario);
                const ehVoceMesma = admLogado?.id === usuario.id;
                const emAcao = idEmAcao === usuario.id;

                return (
                  <tr key={usuario.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {usuario.username}
                      {ehVoceMesma && <span className="ml-2 text-xs text-gray-400">(você)</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{usuario.email}</td>
                    <td className="px-4 py-3">
                      {admin ? (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          Administrador
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        {admin ? (
                          <button
                            type="button"
                            onClick={() => handleRemoverAdmin(usuario)}
                            disabled={ehVoceMesma || emAcao}
                            title={
                              ehVoceMesma
                                ? "Você não pode remover seu próprio acesso de administrador"
                                : "Remover acesso de administrador"
                            }
                            className="text-gray-500 hover:text-amber-600 disabled:opacity-30"
                            aria-label={`Remover admin de ${usuario.username}`}
                          >
                            <ShieldOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePromover(usuario)}
                            disabled={emAcao}
                            title="Promover a administrador"
                            className="text-gray-500 hover:text-blue-600 disabled:opacity-30"
                            aria-label={`Promover ${usuario.username} a admin`}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleExcluir(usuario)}
                          disabled={emAcao}
                          title="Excluir conta"
                          className="text-gray-500 hover:text-red-600 disabled:opacity-30"
                          aria-label={`Excluir ${usuario.username}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(0, p - 1))}
            disabled={data.primeira}
            className="text-sm font-medium text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {data.pagina + 1} de {data.totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => p + 1)}
            disabled={data.ultima}
            className="text-sm font-medium text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
