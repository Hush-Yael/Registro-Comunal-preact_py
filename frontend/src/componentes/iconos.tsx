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

  EditarUsuario: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <circle cx="10" cy="7" r="4" />
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

  Documento: (props: JSX.IntrinsicElements["svg"]) => (
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
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  ),

  PDF: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      version="1.1"
      viewBox="0 0 512 512"
      height="24px"
      width="24px"
    >
      <g>
        <polygon
          points="367.309,53.245 426.374,112.496 426.146,112.714 367.811,112.758 367.266,53.289   "
          style="fill:#F1F1F1;"
        />
        <path
          d="M208.747,146.766c0,11.242-6.28,16.552-15.919,16.476c-1.319,0-2.792,0-3.696-0.207v-30.782    c0.904-0.207,2.442-0.425,4.819-0.425C203.088,131.829,208.813,136.997,208.747,146.766z"
          style="fill:#F1F1F1;"
        />
        <path
          d="M161.131,138.6c0,4.819-3.49,7.687-9.137,7.687c-1.538,0-2.661-0.076-3.566-0.283v-13.892    c0.774-0.207,2.235-0.414,4.394-0.414C158.132,131.698,161.131,134.271,161.131,138.6z"
          style="fill:#F1F1F1;"
        />
        <path
          d="M125.65,94.625h183.182v105.766H125.65h-0.447H86.396V94.625h38.806H125.65z"
          style="fill:#F1F1F1;"
        />
        <path
          d="M281.182,254.997c0.13,10.98-6.892,32.405-6.892,32.405c-2.422-2.551-7.263-16.203-7.263-28.83    c0-12.626,4.079-16.071,7.263-16.071C277.484,242.501,281.049,244.028,281.182,254.997z"
          style="fill:#DC1D00;"
        />
        <path
          d="M357.638,350.754c0,14.502-26.278,8.591-42.438-6.794    C315.2,343.96,357.638,336.262,357.638,350.754z"
          style="fill:#DC1D00;"
        />
        <path
          d="M205.149,398.512c-13.008-7.785,27.303-31.763,34.576-32.525    C239.725,365.986,218.768,406.656,205.149,398.512z"
          style="fill:#DC1D00;"
        />
        <path
          d="M280.417,311.26c7.394,13.772,22.069,29.975,22.069,29.975s-5.616,0.633-18.666,3.827    c-13.053,3.194-19.605,6.51-19.605,6.51s0,0,5.354-11.994C274.933,327.583,280.417,311.26,280.417,311.26z"
          style="fill:#DC1D00;"
        />
        <path
          d="M426.593,112.714V458.81H125.65V200.391h183.182V94.625H125.65V53.191h241.616l0.043,0.054    l-0.043,0.043l0.545,59.469l58.335-0.044l0.229-0.218L426.593,112.714z"
          style="fill:#DC1D00;"
        />
        <path
          d="M239.725,365.986c-7.272,0.763-47.584,24.74-34.576,32.525    C218.768,406.656,239.725,365.986,239.725,365.986z M315.2,343.96c16.159,15.385,42.438,21.296,42.438,6.794    C357.638,336.262,315.2,343.96,315.2,343.96z M302.486,341.234c0,0-14.676-16.202-22.069-29.975c0,0-5.484,16.323-10.849,28.317    c-5.354,11.994-5.354,11.994-5.354,11.994s6.553-3.315,19.605-6.51C296.87,341.867,302.486,341.234,302.486,341.234z     M274.29,287.402c0,0,7.021-21.425,6.892-32.405c-0.133-10.969-3.697-12.496-6.892-12.496c-3.184,0-7.263,3.445-7.263,16.071    C267.027,271.199,271.868,284.852,274.29,287.402z M283.1,303.987c7.143,15.439,26.791,35.328,26.791,35.328    s6.368-1.657,32.646-2.289c26.288-0.633,27.434,14.152,27.553,15.428c0.131,1.287,1.157,13.02-19.768,13.782    c-20.913,0.764-42.611-21.044-42.611-21.044s-8.92,1.406-16.313,3.185c-7.393,1.787-31.13,8.297-31.13,8.297    s-7.022,12.757-22.582,33.158c-15.57,20.412-33.005,18.886-37.978,12.124c-5.779-7.85-1.319-15.688,9.65-25.896    c10.969-10.205,36.277-18.667,36.277-18.667s5.103-9.181,12.583-26.703c7.479-17.522,13.139-35.121,13.139-35.121    s-7.404-16.813-8.844-31.119c-1.613-15.952,0.175-26.67,12.42-26.801c12.246-0.131,16.072,9.061,16.454,25.001    C291.768,278.604,283.1,303.987,283.1,303.987z"
          style="fill:#FFFFFF;"
        />
        <g>
          <polygon
            points="255,133 255,124 227,124 227,171 237,171 237,152 254,152 254,144 237,144 237,133    "
            style="fill:#A51600;"
          />
          <path
            d="M212.094,128.688c-4.536-3.424-10.548-5.027-19.489-5.027c-5.375,0-10.605,0.349-14.605,0.981     v46.21c3,0.349,6.787,0.697,12.304,0.697c9.214,0,16.871-1.952,21.821-6.073c4.536-3.838,7.874-10.054,7.874-19.06     C219.999,138.12,216.99,132.319,212.094,128.688z M192.262,163.242c-1.319,0-2.262,0-4.262-0.207v-30.782     c2-0.207,3.008-0.425,5.386-0.425c9.137,0,14.861,5.168,14.795,14.938C208.181,158.008,201.9,163.318,192.262,163.242z"
            style="fill:#A51600;"
          />
          <path
            d="M166.648,127.434c-3.14-2.519-8.259-3.772-14.824-3.772c-6.488,0-11.824,0.425-14.824,0.981V171     h11v-16.765c1,0.142,2.449,0.218,3.846,0.218c6.28,0,11.762-1.538,15.394-4.961c2.791-2.649,4.381-6.564,4.381-11.165     C171.621,133.715,169.646,129.811,166.648,127.434z M151.779,146.287c-1.537,0-2.779-0.076-3.779-0.283v-13.892     c1-0.207,2.449-0.414,4.607-0.414c5.311,0,8.309,2.573,8.309,6.902C160.916,143.419,157.427,146.287,151.779,146.287z"
            style="fill:#A51600;"
          />
        </g>
      </g>
    </svg>
  ),

  Word: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect fill="#FFFFFF" height="17" width="11.5" x="12" y="3.5" />
      <path
        d="M23.5,21h-10c-0.2763672,0-0.5-0.2236328-0.5-0.5s0.2236328-0.5,0.5-0.5H23V4h-9.5   C13.2236328,4,13,3.7763672,13,3.5S13.2236328,3,13.5,3h10C23.7763672,3,24,3.2236328,24,3.5v17   C24,20.7763672,23.7763672,21,23.5,21z"
        fill="#015CAB"
      />
      <polygon fill="#015CAB" points="14,0 0,2.6086957 0,21.391304 14,24  " />
      <polygon
        fill="#FFFFFF"
        opacity="0.2"
        points="0,2.6087036 0,2.8587036 14,0.25 14,0  "
      />
      <polygon
        opacity="0.1"
        points="0,21.3912964 14,24 14,23.75 0,21.1412964  "
      />
      <rect fill="#015CAB" height="1" width="8" x="13.5" y="5.5" />
      <rect fill="#015CAB" height="1" width="8" x="13.5" y="8.5" />
      <rect fill="#015CAB" height="1" width="8" x="13.5" y="11.5" />
      <rect fill="#015CAB" height="1" width="8" x="13.5" y="14.5" />
      <rect fill="#015CAB" height="1" width="8" x="13.5" y="17.5" />
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="SVGID_1_"
        x1="9.5"
        x2="23.3536377"
        y1="7.5"
        y2="21.3536377"
      >
        <stop offset="0" style="stop-color:#000000;stop-opacity:0.1" />
        <stop offset="1" style="stop-color:#000000;stop-opacity:0" />
      </linearGradient>
      <path
        d="M23.5,21c0.2763672,0,0.5-0.2236328,0.5-0.5V13L14,3v18H23.5z"
        fill="url(#SVGID_1_)"
      />
      <path
        d="M7.9374924,16.53125l1.0628738,0.0759277l2.2133179-8.3724365L9.6310425,8.3477783l-1.1564331,4.3353271   c0,0-0.5881348-2.1396484-1.1465454-4.1708374l-1.68927,0.1206665l-1.1134033,4.0501709L3.4860229,8.7866821L1.9610596,8.8956299   l1.9423218,7.3474731l1.2166138,0.0869141L6.5,11.5C6.5,11.5,7.2924805,14.2738037,7.9374924,16.53125z"
        fill="#FFFFFF"
      />
      <linearGradient
        gradientTransform="matrix(60.9756088 0 0 60.9756088 20560.1210938 -26748.4140625)"
        gradientUnits="userSpaceOnUse"
        id="SVGID_2_"
        x1="-337.1860046"
        x2="-336.9563904"
        y1="438.8707886"
        y2="438.8707886"
      >
        <stop offset="0" style="stop-color:#FFFFFF" />
        <stop offset="1" style="stop-color:#000000" />
      </linearGradient>
      <path
        d="M14,0L0,2.6086957v18.782608L14,24V0z"
        fill="url(#SVGID_2_)"
        opacity="0.05"
      />
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="SVGID_3_"
        x1="-1.5634501"
        x2="25.0453987"
        y1="5.9615331"
        y2="18.369442"
      >
        <stop offset="0" style="stop-color:#FFFFFF;stop-opacity:0.2" />
        <stop offset="1" style="stop-color:#FFFFFF;stop-opacity:0" />
      </linearGradient>
      <path
        d="M23.5,3H14V0L0,2.6087036v18.7825928L14,24v-3h9.5c0.2763672,0,0.5-0.2236328,0.5-0.5v-17   C24,3.2236328,23.7763672,3,23.5,3z"
        fill="url(#SVGID_3_)"
      />
    </svg>
  ),

  Plantilla: (props: JSX.IntrinsicElements["svg"]) => (
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
    </svg>
  ),

  Casa: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </svg>
  ),

  Tumba: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M19,22H9.29a1,1,0,0,1,0-2H18V19a2,2,0,0,0-2-2H8a2,2,0,0,0-2,2v1.3a1,1,0,0,1,.29.7,1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4v2A1,1,0,0,1,19,22Z" />
      <path d="M10,17a1,1,0,0,1-1-1V12H6a1,1,0,0,1-1-1V7A1,1,0,0,1,6,6H9V3a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6h3a1,1,0,0,1,1,1v4a1,1,0,0,1-1,1H15v1a1,1,0,0,1-2,0V11a1,1,0,0,1,1-1h3V8H14a1,1,0,0,1-1-1V4H11V7a1,1,0,0,1-1,1H7v2h3a1,1,0,0,1,1,1v5A1,1,0,0,1,10,17Z" />
    </svg>
  ),

  Menu: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    </svg>
  ),

  Ascendente: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M11 12h4" />
      <path d="M11 16h7" />
      <path d="M11 20h10" />
    </svg>
  ),

  Descendente: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="M11 4h10" />
      <path d="M11 8h7" />
      <path d="M11 12h4" />
    </svg>
  ),

  Sol: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 19a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1m-4.95 -2.05a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m11.314 0l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m-5.049 -9.836a5 5 0 1 1 -2.532 9.674a5 5 0 0 1 2.532 -9.674m-9.315 3.886a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm18 0a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-16.364 -6.778l1.414 1.414a1 1 0 0 1 -1.414 1.414l-1.414 -1.414a1 1 0 0 1 1.414 -1.414m14.142 0a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1 -1.414 -1.414l1.414 -1.414a1 1 0 0 1 1.414 0m-7.778 -3.222a1 1 0 0 1 1 1v2a1 1 0 0 1 -2 0v-2a1 1 0 0 1 1 -1" />
    </svg>
  ),

  Luna: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
    </svg>
  ),

  Monitor: (props: JSX.IntrinsicElements["svg"]) => (
    <svg {...props} viewBox="0 0 24 24">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 22a1 1 0 0 1 0 -2h.616l.25 -2h-4.866a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-4.867l.25 2h.617a1 1 0 0 1 0 2zm5.116 -4h-2.233l-.25 2h2.733z" />
    </svg>
  ),

  Tuerca: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  Info: (props: JSX.IntrinsicElements["svg"]) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  ),
};
