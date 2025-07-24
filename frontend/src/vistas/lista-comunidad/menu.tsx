import { type Table } from "@tanstack/react-table";
import { signal } from "@preact/signals";
import { useRef } from "preact/hooks";
import Iconos from "~/componentes/iconos";
import type { DatosComunidad, OrdenKey } from "~/tipos";
import { sesion } from "~/index";
import { descarga, rutaApi } from "~/utilidades";
import type { JSX } from "preact/jsx-runtime";
import {
  cargarDatosComunidad,
  datosComunidad,
  ordenColumnas,
} from "./contantes";

const _portando = signal(false);
let subOpenTimeout: number;
let subCloseTimeout: number;

export default (props: { tabla: Table<DatosComunidad> }) => {
  const submenu = useRef<HTMLDetailsElement>();

  const closeSub = () => {
    clearTimeout(subOpenTimeout);
    clearTimeout(subCloseTimeout);

    subCloseTimeout = setTimeout(
      () => submenu.current.removeAttribute("open"),
      200
    );
  };

  return (
    <details onMouseLeave={closeSub} class="group relative">
      <summary class="list-none btn p-1! px-0! group-open:bg-primary! group-open:text-[var(--bg-base)]! group-open:border-transparent! cursor-pointer">
        <Iconos.Menu class="size-6" />
        <span className="sr-only">Opciones</span>
      </summary>

      <div class="dropdown-content right-0 origin-top-right" role="group">
        <details ref={submenu} class="relative">
          <summary
            class="dropdown-item gap-0! list-none cursor-default"
            onMouseEnter={() => {
              clearTimeout(subCloseTimeout);
              clearTimeout(subOpenTimeout);

              subOpenTimeout = setTimeout(() => {
                submenu.current.setAttribute("open", "");
              }, 300);
            }}
            onMouseLeave={closeSub}
          >
            <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)_translate(3px,1px)]" />
            Orden de los datos
          </summary>

          <div
            class="dropdown-content -top-2 origin-right max-[440px]:-left-35 min-[440px]:right-[107%]"
            onMouseEnter={() => clearTimeout(subCloseTimeout)}
            onMouseLeave={closeSub}
          >
            <h2 class="font-bold text-center py-1">Ordenar datos por:</h2>

            <div class="col gap-2.5" role="group">
              <SubItem id="nombres">Nombres</SubItem>

              <SubItem id="apellidos">Apellidos</SubItem>

              <SubItem id="cedula">Cedula</SubItem>

              <SubItem id="fecha_nacimiento">Fecha de nacimiento</SubItem>

              <SubItem id="numero_casa">Número de casa</SubItem>

              <SubItem id="rowid">Orden de añadido</SubItem>

              <SubItem id="editado">Fecha de edición</SubItem>
            </div>
          </div>
        </details>

        <button
          class="dropdown-item"
          onClick={() => {
            cargarDatosComunidad.value = true;
          }}
          disabled={cargarDatosComunidad.value === true || _portando.value}
        >
          <Iconos.Recargar />
          Recargar datos
        </button>

        <button
          class="dropdown-item"
          // @ts-expect-error: no importa
          onClick={props.tabla.resetColumnFilters}
        >
          <Iconos.LimpiarFiltros />
          Limpiar filtros
        </button>

        <button
          class="dropdown-item"
          onClick={exportar}
          disabled={_portando.value || datosComunidad.value.length < 1}
        >
          <Iconos.Exportar />
          Exportar datos...
        </button>

        <input
          class="peer/input sr-only"
          onChange={importar}
          disabled={sesion.value.rol !== "admin" || _portando.value}
          type="file"
          accept=".csv"
          id="exportar"
        />
        <label class="dropdown-item cursor-pointer" htmlFor="exportar">
          <Iconos.Importar />
          Importar datos...
        </label>
      </div>
    </details>
  );
};

const importar = async (e: Event) => {
  if (sesion.value.rol !== "admin") return;

  if (
    confirm(
      "¿Realmente desea importar los registros?\nAl hacerlo, se BORRARÁN TODOS LOS REGISTROS ACTUALES y se REEMPLAZARÁN por los nuevos."
    )
  ) {
    const contraseña = prompt(
      "Por favor, ingrese la contraseña para confirmar la operación:"
    );

    if (!contraseña || !contraseña.trim()) {
      alert("Por favor, ingrese una contraseña válida");
      return ((e.target as HTMLInputElement).value = "");
    }

    _portando.value = true;

    const file = (e.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append("usuario", sesion.value.usuario);
    formData.append("contraseña", contraseña);
    formData.append("archivo", file);

    const r = await fetch(rutaApi("importar-comunidad"), {
      method: "POST",
      body: formData,
    });

    (e.target as HTMLInputElement).value = "";
    _portando.value = false;

    alert(await r.text());

    if (r.ok) cargarDatosComunidad.value = true;
  }
};

const exportar = async () => {
  if (datosComunidad.value.length < 1) return;

  _portando.value = true;
  const r = await fetch(rutaApi("exportar-comunidad"));
  descarga(r, "Registros de la comunidad Santo Domingo De Guzmán.csv");
  _portando.value = false;
};

type SubItemProps = Omit<JSX.IntrinsicElements["input"], "type" | "id"> & {
  id: OrdenKey;
};

const SubItem = (props: SubItemProps) => (
  <div
    class="flex items-center justify-between gap-6 w-full px-1"
    role="group"
    aria-labelledby={props.id + "-l"}
  >
    <p id={props.id + "-l"}>
      <span className="sr-only">Ordenar por </span>
      {props.children}
    </p>

    <div
      class="flex items-center gap-1"
      role="group"
      aria-label="Dirección de orden"
    >
      <label>
        <input
          class="peer sr-only"
          type="checkbox"
          name={`${props.id}-orden`}
          checked={
            ordenColumnas.value[0] === props.id &&
            ordenColumnas.value[1] === "asc"
          }
          onChange={() => {
            ordenColumnas.value =
              ordenColumnas.value[0] === props.id &&
              ordenColumnas.value[1] === "asc"
                ? []
                : [props.id, "asc"];
            cargarDatosComunidad.value = true;
          }}
        />
        <span className="sr-only">ascendente</span>

        <span class="dropdown-radio-btn">
          <Iconos.Ascendente />
        </span>
      </label>

      <label>
        <input
          class="peer sr-only"
          type="checkbox"
          name={`${props.id}-orden`}
          checked={
            ordenColumnas.value[0] === props.id &&
            ordenColumnas.value[1] === "desc"
          }
          onChange={() => {
            ordenColumnas.value =
              ordenColumnas.value[0] === props.id &&
              ordenColumnas.value[1] === "desc"
                ? []
                : [props.id, "desc"];
            cargarDatosComunidad.value = true;
          }}
        />
        <span className="sr-only">descendente</span>

        <span class="dropdown-radio-btn">
          <Iconos.Descendente />
        </span>
      </label>
    </div>
  </div>
);
