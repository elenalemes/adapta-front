function Envoltorio({ id, label, erro, ajuda, children }) {
  const idErro = erro ? `${id}-erro` : null;
  const idAjuda = ajuda ? `${id}-ajuda` : null;

  return (
    <div>
      <label className="block text-title-sm text-gray-700" htmlFor={id}>
        {label}
      </label>
      {children}
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

function descricaoDe(id, erro, ajuda) {
  return [erro ? `${id}-erro` : null, ajuda ? `${id}-ajuda` : null]
    .filter(Boolean)
    .join(" ") || undefined;
}

function estiloDe(erro, className) {
  return `mt-1 w-full rounded-lg border px-3 py-2 text-body-lg text-gray-900 ${
    erro ? "border-red-700" : "border-borda"
  } ${className}`;
}

export function Campo({
  id,
  label,
  erro,
  ajuda,
  multilinha = false,
  className = "",
  ...props
}) {
  return (
    <Envoltorio id={id} label={label} erro={erro} ajuda={ajuda}>
      {multilinha ? (
        <textarea
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoDe(id, erro, ajuda)}
          className={estiloDe(erro, className)}
          {...props}
        />
      ) : (
        <input
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricaoDe(id, erro, ajuda)}
          className={`${estiloDe(erro, className)} min-h-11`}
          {...props}
        />
      )}
    </Envoltorio>
  );
}

export function Selecao({ id, label, erro, ajuda, className = "", children, ...props }) {
  return (
    <Envoltorio id={id} label={label} erro={erro} ajuda={ajuda}>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricaoDe(id, erro, ajuda)}
        className={`${estiloDe(erro, className)} min-h-11 bg-white`}
        {...props}
      >
        {children}
      </select>
    </Envoltorio>
  );
}
