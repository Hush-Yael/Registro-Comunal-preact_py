import { sesion } from "~/index";
import Iconos from "~/componentes/iconos";
import { cargarDatosComunidad, datosComunidad } from "../lista-comunidad";
import { signal } from "@preact/signals";
import { descarga, rutaApi } from "~/utilidades";
import type { DatosComunidad } from "~/tipos";
import type { Table } from "@tanstack/react-table";

const _portando = signal(false);

export default (props: { tabla: Table<DatosComunidad> }) => (
  <div
    role="group"
    class="flex items-center gap-3 pr-1 *:p-1! [&_svg]:size-4.5! [&_svg]:min-w-max [&_button]:min-w-max max-sm:grid grid-cols-2"
  >
    <button
      class="btn btn-secundario m-auto"
      // @ts-expect-error: no importa
      onClick={props.tabla.resetColumnFilters}
      title="Limpiar filtros"
    >
      <Iconos.LimpiarFiltros />
    </button>
    <button
      onClick={() => {
        cargarDatosComunidad.value = true;
      }}
      disabled={cargarDatosComunidad.value === true || _portando.value}
      class="btn btn-secundario"
      title="Recargar datos"
    >
      <Iconos.Recargar />
    </button>
    <button
      onClick={exportar}
      disabled={_portando.value || datosComunidad.value.length < 1}
      class="btn btn-primario"
      title="Exportar datos"
    >
      <Iconos.Exportar />
    </button>
    <input
      class="peer/input sr-only"
      onChange={importar}
      disabled={sesion.value.rol !== "admin" || _portando.value}
      type="file"
      accept=".csv"
      id="exportar"
    />
    <label class="btn btn-primario" htmlFor="exportar" title="Importar datos">
      <Iconos.Importar />
    </label>
  </div>
);

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
