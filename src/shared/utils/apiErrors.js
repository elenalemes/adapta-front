
export function aplicarErrosDeValidacao(error, setError) {
  const erros = error.response?.data?.erros;
  if (!erros) return false;

  erros.forEach(({ campo, mensagem }) => {
    setError(campo, { type: "server", message: mensagem });
  });
  return true;
}

export function mensagemDeErro(error, padrao = "Algo deu errado. Tente novamente.") {
  return error.response?.data?.mensagem ?? padrao;
}
