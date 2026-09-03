// Dois selects em cascata: a Área da BNCC decide quais Componentes
// curriculares aparecem no segundo select. GET /areas já traz os
// componentes aninhados, então não precisa de chamada extra pra montar isso.
export function FiltroBNCC({
  areas,
  areaId,
  componenteId,
  onAreaChange,
  onComponenteChange,
  centralizado = true,
}) {
  const areaSelecionada = areas?.find((area) => String(area.id) === String(areaId));
  const componentesDisponiveis = areaSelecionada?.componentes ?? [];

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row ${
        centralizado ? "items-center sm:justify-center" : "items-stretch sm:justify-start"
      }`}
    >
      <select
        aria-label="Selecione a categoria"
        value={areaId ?? ""}
        onChange={(evento) => onAreaChange(evento.target.value || null)}
        className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none sm:w-auto"
      >
        <option value="">Selecione a categoria</option>
        {areas?.map((area) => (
          <option key={area.id} value={area.id}>
            {area.nome}
          </option>
        ))}
      </select>

      <select
        aria-label="Selecione o componente curricular"
        value={componenteId ?? ""}
        onChange={(evento) => onComponenteChange(evento.target.value || null)}
        disabled={!areaId}
        className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 sm:w-auto"
      >
        <option value="">Selecione o componente curricular</option>
        {componentesDisponiveis.map((componente) => (
          <option key={componente.id} value={componente.id}>
            {componente.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
