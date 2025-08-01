import { type Table } from "@tanstack/react-table";
import { signal } from "@preact/signals";
import Iconos from "~/componentes/iconos";
import type { DatosComunidad } from "~/tipos";
import { sesion } from "~/index";
import { descarga, rutaApi } from "~/lib";
import {
  cargarDatosComunidad,
  datosComunidad,
  eliminandoMultiples,
} from "~/constantes/lista-comunidad";
import { DropdownMenu as Menu } from "radix-ui";
import Orden from "./orden";
import ConfiguracionFiltros from "./filtros";
import Visibilidad from "./visibilidad";

const _portando = signal(false);

export default (props: { tabla: Table<DatosComunidad> }) => {
  return (
    <Menu.Root>
      <Menu.Trigger
        class="trigger-primario absolute top-0 right-0 p-1!"
        aria-label="Opciones"
      >
        <Iconos.Tuerca />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          onInteractOutside={(e) =>
            (e.target as HTMLElement).closest("[data-radix-menu-content]") &&
            e.preventDefault()
          }
          align="start"
          side="right"
          sideOffset={5}
          alignOffset={-2}
          class="dropdown-content text-sm"
        >
          <Orden />

          <ConfiguracionFiltros tabla={props.tabla} />

          <Visibilidad tabla={props.tabla} />

          <Menu.Item
            class="dropdown-item"
            // @ts-expect-error: no importa
            onSelect={props.tabla.resetColumnFilters}
          >
            <Iconos.LimpiarFiltros />
            Limpiar filtros
          </Menu.Item>

          <Menu.Item
            class="dropdown-item"
            onSelect={() => {
              cargarDatosComunidad.value = true;
            }}
            disabled={cargarDatosComunidad.value === true || _portando.value}
          >
            <Iconos.Recargar />
            Recargar datos
          </Menu.Item>

          <Menu.Item
            class="dropdown-item"
            onSelect={exportar}
            disabled={_portando.value || datosComunidad.value.length < 1}
          >
            <Iconos.Exportar />
            Exportar datos...
          </Menu.Item>

          <input
            class="peer/input sr-only"
            onChange={importar}
            disabled={sesion.value.rol !== "admin" || _portando.value}
            type="file"
            accept=".csv"
            id="exportar"
          />
          <Menu.Item onSelect={(e) => e.preventDefault()} asChild>
            <label class="dropdown-item cursor-pointer" htmlFor="exportar">
              <Iconos.Importar />
              Importar datos...
            </label>
          </Menu.Item>

          <Menu.CheckboxItem
            onCheckedChange={() =>
              (eliminandoMultiples.value = !eliminandoMultiples.value)
            }
            checked={eliminandoMultiples.value}
            disabled={
              sesion.value.rol !== "admin" ||
              _portando.value ||
              datosComunidad.value.length < 1
            }
            class="group dropdown-item justify-between"
          >
            Eliminación múltiple
            <span className="switch" />
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
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
