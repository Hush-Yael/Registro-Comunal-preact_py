import type { OrdenKey } from "~/tipos/lista-comunidad";
import {
  cargarDatosComunidad,
  ordenColumnas,
} from "~/constantes/lista-comunidad";
import { DropdownMenu as Menu, Select as RSelect } from "radix-ui";
import SubTrigger from "~/componentes/menu/subtrigger";
import { JSX } from "preact/jsx-runtime";
import Iconos from "~/componentes/iconos";

type Opciones<K extends string> = {
  // eslint-disable-next-line no-unused-vars
  [key in K]: {
    label?: string;
    // eslint-disable-next-line no-unused-vars
    icono: (p: JSX.IntrinsicElements["svg"]) => JSX.Element;
  };
};

const COLUMNAS: Opciones<OrdenKey> = {
  nombres: { icono: Iconos.Etiqueta },
  apellidos: { icono: Iconos.Etiqueta },
  edad: { icono: Iconos.Edad },
  cedula: { label: "cédula", icono: Iconos.Cedula },
  direccion: { label: "dirección", icono: Iconos.Direccion },
  numero_casa: { label: "número de casa", icono: Iconos.Casa },
  fecha_nacimiento: {
    label: "fecha de nacimiento",
    icono: Iconos.Calendario,
  },
  rowid: { label: "índice de añadido", icono: Iconos.Id },
  patologia: { label: "patología o condición", icono: Iconos.Patologia },
  editado: { label: "fecha de edición", icono: Iconos.Editar },
};

const DIRECCIONES: Opciones<"asc" | "desc"> = {
  asc: { label: "ascendente", icono: Iconos.Ascendente },
  desc: { label: "descendente", icono: Iconos.Descendente },
};

export default () => (
  <Menu.Sub>
    <SubTrigger>Orden de los datos</SubTrigger>

    <Menu.Portal>
      <Menu.SubContent
        onSelect={(e) => e.preventDefault()}
        sideOffset={10}
        collisionPadding={10}
        class="dropdown-content max-[450px]:transform-[translateX(70%)]! max-[550px]:transform-[translateX(50%)]! text-sm"
      >
        <Select
          label="Ordenar por"
          triggerValue={
            COLUMNAS[ordenColumnas.value[0]].label || ordenColumnas.value[0]
          }
          value={ordenColumnas.value[0]}
          onValueChange={(v) => {
            ordenColumnas.value = [
              v as OrdenKey,
              ordenColumnas.value[1] || "asc",
            ];
            cargarDatosComunidad.value = true;
            console.log(v);
          }}
          opciones={COLUMNAS}
        />

        <Select
          label="Dirección de orden"
          disabled={!ordenColumnas.value[0]}
          value={ordenColumnas.value[1]}
          triggerValue={DIRECCIONES[ordenColumnas.value[1]].label}
          onValueChange={(v) => {
            ordenColumnas.value = [ordenColumnas.value[0], v as "asc" | "desc"];
            cargarDatosComunidad.value = true;
          }}
          opciones={DIRECCIONES}
        />
      </Menu.SubContent>
    </Menu.Portal>
  </Menu.Sub>
);

const Select = <K extends string>(props: {
  label: string;
  value: string;
  triggerValue?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (v: string) => void;
  opciones: Opciones<K>;
}) => (
  <RSelect.Root
    disabled={props.disabled}
    value={props.value}
    onValueChange={props.onValueChange}
  >
    <RSelect.Trigger class="flex items-center justify-between gap-4">
      {props.label || "Seleccionar"}:
      <span class="flex items-center gap-2 dropdown-select pl-2! pr-1!">
        {props.triggerValue || props.value}
        <Iconos.FlechaDer class="size-4 transform-[rotate(90deg)] text-muted" />
      </span>
    </RSelect.Trigger>

    <RSelect.Content
      align="end"
      sideOffset={3}
      position="popper"
      class="group/content z-1 text-sm"
    >
      <RSelect.Viewport class="dropdown-content">
        {Object.entries<Opciones<K>[keyof Opciones<K>]>(props.opciones).map(
          ([id, { label, icono }]) => (
            <RSelect.Item
              onSelect={(e) => console.log(e)}
              class="group dropdown-check"
              value={id}
            >
              {icono({
                class:
                  "size-4.5 opacity-60 group-[[data-state=checked]]:opacity-90",
              })}
              <RSelect.ItemText>{label || id}</RSelect.ItemText>
            </RSelect.Item>
          )
        )}
      </RSelect.Viewport>
    </RSelect.Content>
  </RSelect.Root>
);
