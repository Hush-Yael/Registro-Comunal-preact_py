import type { OrdenKey } from "~/tipos";
import { cargarDatosComunidad, ordenColumnas } from "./contantes";
import type { JSX } from "preact/jsx-runtime";
import { DropdownMenu as Menu } from "radix-ui";
import Iconos from "~/componentes/iconos";

export default () => {
  return (
    <Menu.Sub>
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
