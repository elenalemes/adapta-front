import { Link } from "react-router-dom";

const VARIANTES = {
  primario: "bg-blue-600 text-white hover:bg-blue-700",
  secundario: "border border-borda bg-white text-gray-700 hover:bg-gray-50",
  contorno: "border border-blue-600 bg-white text-blue-700 hover:bg-blue-50",
  perigo: "border border-red-700 bg-white text-red-700 hover:bg-red-50",
};

const ICONE_SEM_ROTULO =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition disabled:opacity-50";

const ICONE_COM_ROTULO =
  "inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-center text-label-sm leading-tight transition disabled:opacity-50";

function classeIcone(rotulo, className) {
  return `${rotulo ? ICONE_COM_ROTULO : ICONE_SEM_ROTULO} ${className}`;
}

export function Botao({ variante = "primario", className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-label-lg transition disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  );
}

export function BotaoIcone({ rotulo, className = "", children, ...props }) {
  return (
    <button className={classeIcone(rotulo, className)} {...props}>
      {children}
      {rotulo && <span>{rotulo}</span>}
    </button>
  );
}

export function LinkIcone({ rotulo, className = "", children, ...props }) {
  return (
    <Link className={classeIcone(rotulo, className)} {...props}>
      {children}
      {rotulo && <span>{rotulo}</span>}
    </Link>
  );
}
