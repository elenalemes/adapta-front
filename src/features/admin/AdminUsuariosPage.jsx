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
import { BotaoIcone } from "../../shared/components/Botao";

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
      <h1 className="mb-6 text-headline-sm font-bold text-gray-900">Usuários</h1>

      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-body-md text-red-700" role="alert">
          {erro}
        </p>
      )}

      {isLoading && <p className="text-body-lg text-gray-500">Carregando...</p>}

      {!isLoading && usuarios.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full min-w-[36rem] text-left text-body-md">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-title-sm">Usuário</th>
                <th className="px-4 py-3 text-title-sm">E-mail</th>
                <th className="px-4 py-3 text-title-sm">Perfil</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((usuario) => {
                const admin = isAdminUser(usuario);
                const ehVoceMesma = admLogado?.id === usuario.id;
                const emAcao = idEmAcao === usuario.id;

                return (
                  <tr key={usuario.id}>
                    <td className="px-4 py-3 text-title-sm text-gray-900">
                      {usuario.username}
                      {ehVoceMesma && (
                        <span className="ml-2 text-body-md text-texto-fraco">(você)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{usuario.email}</td>
                    <td className="px-4 py-3">
                      {admin ? (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-label-md text-blue-700">
                          Administrador
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-label-md text-gray-700">
                          Usuário
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        {admin ? (
                          <BotaoIcone
                            type="button"
                            onClick={() => handleRemoverAdmin(usuario)}
                            disabled={ehVoceMesma || emAcao}
                            title={
                              ehVoceMesma
                                ? "Você não pode remover seu próprio acesso de administrador"
                                : "Remover acesso de administrador"
                            }
                            className="text-gray-600 hover:text-amber-800"
                            aria-label={`Remover admin de ${usuario.username}`}
                          >
                            <ShieldOff className="h-4 w-4" aria-hidden="true" />
                          </BotaoIcone>
                        ) : (
                          <BotaoIcone
                            type="button"
                            onClick={() => handlePromover(usuario)}
                            disabled={emAcao}
                            title="Promover a administrador"
                            className="text-gray-600 hover:text-blue-700"
                            aria-label={`Promover ${usuario.username} a admin`}
                          >
                            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          </BotaoIcone>
                        )}
                        <BotaoIcone
                          type="button"
                          onClick={() => handleExcluir(usuario)}
                          disabled={emAcao}
                          title="Excluir conta"
                          className="text-gray-600 hover:text-red-700"
                          aria-label={`Excluir ${usuario.username}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </BotaoIcone>
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
            className="inline-flex min-h-11 items-center px-2 text-label-lg text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Anterior
          </button>
          <span className="text-body-md text-gray-600" role="status">
            Página {data.pagina + 1} de {data.totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => p + 1)}
            disabled={data.ultima}
            className="inline-flex min-h-11 items-center px-2 text-label-lg text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
