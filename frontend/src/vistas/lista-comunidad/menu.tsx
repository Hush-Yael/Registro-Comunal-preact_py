import { type Table } from "@tanstack/react-table";
import { signal } from "@preact/signals";
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
import { DropdownMenu as Menu } from "radix-ui";

const _portando = signal(false);

export default (props: { tabla: Table<DatosComunidad> }) => {
  return (
    <Menu.Root>
      <Menu.Trigger class="list-none btn p-1! px-0! data-[state=open]:bg-primary! data-[state=open]:text-[var(--bg-base)]! data-[state=open]:border-transparent! cursor-pointer">
        <Iconos.Menu class="size-6" />
        <span className="sr-only">Opciones</span>
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
            // @ts-expect-error: no importa
            onSelect={props.tabla.resetColumnFilters}
          >
            <Iconos.LimpiarFiltros />
            Limpiar filtros
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
          <Menu.Item asChild>
            <label class="dropdown-item cursor-pointer" htmlFor="exportar">
              <Iconos.Importar />
              Importar datos...
            </label>
          </Menu.Item>
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

const Orden = () => {
  return (
    <Menu.Sub defaultOpen>
      <Menu.SubTrigger class="dropdown-item gap-0! list-none cursor-default">
        <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)_translate(3px,1px)]" />
        Orden de los datos
      </Menu.SubTrigger>

      <Menu.Portal>
        <Menu.SubContent
          sideOffset={10}
          collisionPadding={10}
          class="dropdown-content max-[375px]:transform-[translateX(50%)]! max-[450px]:transform-[translateX(40%)]! text-sm"
        >
          <Menu.Label class="font-bold text-center py-1">
            Ordenar datos por:
          </Menu.Label>

          <div class="col gap-2.5" role="group">
            <OrdenItem id="nombres">Nombres</OrdenItem>

            <OrdenItem id="apellidos">Apellidos</OrdenItem>

            <OrdenItem id="cedula">Cedula</OrdenItem>

            <OrdenItem id="fecha_nacimiento">Fecha de nacimiento</OrdenItem>

            <OrdenItem id="numero_casa">Número de casa</OrdenItem>

            <OrdenItem id="rowid">Orden de añadido</OrdenItem>

            <OrdenItem id="editado">Fecha de edición</OrdenItem>
          </div>
        </Menu.SubContent>
      </Menu.Portal>
    </Menu.Sub>
  );
};

type OrdenItemProps = Omit<JSX.IntrinsicElements["input"], "type" | "id"> & {
  id: OrdenKey;
};

const OrdenItem = (props: OrdenItemProps) => {
  const idChecked = ordenColumnas.value[0] === props.id;
  const descChecked = idChecked && ordenColumnas.value[1] === "desc";
  const ascChecked = idChecked && !descChecked;

  return (
    <Menu.Group class="flex items-center justify-between gap-6 w-full px-1">
      <p id={props.id + "-l"}>
        <span className="sr-only">Ordenar por </span>
        {props.children}
      </p>

      <Menu.Group
        class="flex items-center gap-1"
        aria-label="Dirección de orden"
      >
        <Menu.CheckboxItem
          class="dropdown-check-btn"
          checked={ascChecked}
          onSelect={(e) => e.preventDefault()}
          aria-label="ascendente"
          asChild
        >
          <button
            onClick={() => {
              ordenColumnas.value = ascChecked ? [] : [props.id, "asc"];
              cargarDatosComunidad.value = true;
            }}
          >
            <Iconos.Ascendente />
          </button>
        </Menu.CheckboxItem>

        <Menu.CheckboxItem
          class="dropdown-check-btn"
          checked={descChecked}
          onSelect={(e) => e.preventDefault()}
          aria-label="descendente"
          asChild
        >
          <button
            onClick={() => {
              ordenColumnas.value = descChecked ? [] : [props.id, "desc"];
              cargarDatosComunidad.value = true;
            }}
          >
            <Iconos.Descendente />
          </button>
        </Menu.CheckboxItem>
      </Menu.Group>
    </Menu.Group>
  );
};