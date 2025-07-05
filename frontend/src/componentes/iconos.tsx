import type { JSX } from "preact/jsx-runtime";

export default {
  Personas: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 96 96">
      <circle cx="24" cy="30.8" r="9" />
      <circle cx="72" cy="30.8" r="9" />
      <path d=" M 66 74.2 L 66 65.2 C 66 63.8 65.4 62.4 64.2 61.6 C 61.8 59.6 58.6 58.2 55.4 57.4 C 53.2 56.8 50.6 56.2 48 56.2 C 45.6 56.2 43 56.6 40.6 57.4 C 37.4 58.2 34.4 59.8 31.8 61.6 C 30.6 62.6 30 63.8 30 65.2 L 30 74.2 L 66 74.2 Z" />
      <circle cx="48" cy="44.8" r="9" />
      <path d=" M 88.2 47.6 C 85.8 45.6 82.6 44.2 79.4 43.4 C 77.2 42.8 74.6 42.2 72 42.2 C 69.6 42.2 67 42.6 64.6 43.4 C 63.4 43.8 62.2 44.2 61 44.8 L 61 45 C 61 48.4 59.6 51.6 57.4 53.8 C 61.2 55 64.2 56.6 66.6 58.4 C 67.2 59 67.8 59.4 68.2 60.2 L 90 60.2 L 90 51.2 C 90 49.8 89.4 48.4 88.2 47.6 Z" />
      <path d=" M 29.4 58.4 L 29.4 58.4 C 32.2 56.4 35.4 54.8 38.6 53.8 C 36.4 51.4 35 48.4 35 45 C 35 44.8 35 44.8 35 44.6 C 33.8 44.2 32.6 43.6 31.4 43.4 C 29.2 42.8 26.6 42.2 24 42.2 C 21.6 42.2 19 42.6 16.6 43.4 C 13.4 44.4 10.4 45.8 7.8 47.6 C 6.6 48.4 6 49.8 6 51.2 L 6 60.2 L 27.6 60.2 C 28.2 59.4 28.6 59 29.4 58.4 Z" />
    </svg>
  ),

  Buscar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  ),

  Eliminar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  ),

  Añadir: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z" />
    </svg>
  ),

  Ver: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  Ocultar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m15 18-.722-3.25" />
      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
      <path d="m20 15-1.726-2.05" />
      <path d="m4 15 1.726-2.05" />
      <path d="m9 18 .722-3.25" />
    </svg>
  ),

  Salir: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
      <path d="M15 12h-12l3 -3" />
      <path d="M6 15l-3 -3" />
    </svg>
  ),

  Check: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
  ),

  Registros: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 12h.01" />
      <path d="M4 6h.01" />
      <path d="M4 18h.01" />
      <path d="M8 18h2" />
      <path d="M8 12h2" />
      <path d="M8 6h2" />
      <path d="M14 6h6" />
      <path d="M14 12h6" />
      <path d="M14 18h6" />
    </svg>
  ),

  Campo: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
      <path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
      <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
      <path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" />
      <path d="M17 12h.01" />
      <path d="M13 12h.01" />
    </svg>
  ),

  Borrar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
      )
      <path d="M18 13.3l-6.3 -6.3" />
    </svg>
  ),

  Editar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  ),

  Subir: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />{" "}
      <path d="M12 11v6" />
      <path d="M9.5 13.5l2.5 -2.5l2.5 2.5" />
    </svg>
  ),

  FlechaDer: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),

  FlechaDerUltimo: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m7 18 6-6-6-6" />
      <path d="M17 6v12" />
    </svg>
  ),

  Exportar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 18v-6" />
      <path d="m9 15 3 3 3-3" />
    </svg>
  ),

  Importar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <path d="m15 15-3-3-3 3" />
    </svg>
  ),

  LimpiarFiltros: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
      <path d="m16.5 3.5 5 5" />
      <path d="m21.5 3.5-5 5" />
    </svg>
  ),

  Recargar: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
};
