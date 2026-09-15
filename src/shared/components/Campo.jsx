export function Campo({
  id,
  label,
  erro,
  ajuda,
  multilinha = false,
  className = "",
  ...props
}) {
  const idErro = erro ? `${id}-erro` : null;
  const idAjuda = ajuda ? `${id}-ajuda` : null;
  const descrito = [idErro, idAjuda].filter(Boolean).join(" ") || undefined;

  const estilo = `mt-1 w-full rounded-lg border px-3 py-2 text-body-lg text-gray-900 ${
    erro ? "border-red-700" : "border-borda"
  } ${className}`;

  return (
    <div>
      <label className="block text-title-sm text-gray-700" htmlFor={id}>
        {label}
      </label>

      {multilinha ? (
        <textarea
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descrito}
          className={estilo}
          {...props}
        />
      ) : (
        <input
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descrito}
          className={`${estilo} min-h-11`}
          {...props}
        />
      )}

      {erro && (
        <p id={idErro} className="mt-1 text-body-md text-red-700">
          {erro}
        </p>
      )}
      {ajuda && (
        <p id={idAjuda} className="mt-1 text-body-md text-gray-600">
          {ajuda}
        </p>
      )}
    </div>
  );
}
