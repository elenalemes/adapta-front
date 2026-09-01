// Toda resposta de erro da API do Adapta segue o mesmo envelope:
// { status, erro, mensagem, erros? }. Estas duas funções concentram como o
// front interpreta isso, pra não reescrever a lógica em cada formulário.

/**
 * Se o erro veio com `erros` (validação campo a campo), aplica cada
 * mensagem no campo correspondente do react-hook-form via setError, e
 * devolve true. Se não for erro de validação, devolve false — quem chamou
 * decide o que fazer (normalmente mostrar `mensagem` como erro geral).
 */
export function aplicarErrosDeValidacao(error, setError) {
  const erros = error.response?.data?.erros;
  if (!erros) return false;

  erros.forEach(({ campo, mensagem }) => {
    setError(campo, { type: "server", message: mensagem });
  });
  return true;
}

/**
 * O campo `mensagem` do backend é sempre seguro pra mostrar direto ao
 * usuário — foi escrito pra isso. Usa um texto padrão só quando a resposta
 * não seguiu o formato esperado (ex.: a API caiu, erro de rede).
 */
export function mensagemDeErro(error, padrao = "Algo deu errado. Tente novamente.") {
  return error.response?.data?.mensagem ?? padrao;
}
