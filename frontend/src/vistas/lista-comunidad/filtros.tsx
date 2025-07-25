import { type Table } from "@tanstack/react-table";
import type { DatosComunidad } from "~/tipos";
import {
  OPCIONES_FILTROS,
  configuracionFiltros,
} from "~/constantes/lista-comunidad";
import { DropdownMenu as Menu } from "radix-ui";
import Iconos from "~/componentes/iconos";

export default (props: { tabla: Table<DatosComunidad> }) => (
  <Menu.Sub>
    <Menu.SubTrigger class="dropdown-item gap-0! list-none">
      <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)_translate(3px,1px)]" />
      Configuración de filtros
    </Menu.SubTrigger>

    <Menu.Portal>
      <Menu.SubContent
        sideOffset={10}
        class="dropdown-content text-sm max-[375px]:transform-[translateX(75%)]! max-[450px]:transform-[translateX(60%)]! max-[550px]:transform-[translateX(40%)]!"
      >
        <Menu.Label class="sr-only">
          Filtros aplicados a cada columna en la tabla
        </Menu.Label>

        <Menu.Group class="col gap-1">
          {props.tabla.getAllColumns().map((c) => {
            if (c.getCanFilter()) {
              const filtros = OPCIONES_FILTROS[c.id]
                ? Object.entries(
                    OPCIONES_FILTROS[c.id as keyof typeof OPCIONES_FILTROS]
                  )
                : Object.entries(OPCIONES_FILTROS["comun"]);

              return (
                <label
                  class="grid grid-cols-2 items-center gap-4 w-full"
                  htmlFor={c.id + "-fn"}
                >
                  <span class="text-muted">{c.columnDef.header}:</span>

                  <select
                    id={c.id + "-fn"}
                    class="py-1.25 border border-transparent rounded-field hover:border-base focus-visible:bg-darkest hover:bg-darkest transition-colors"
                    name="filtro"
                    defaultValue={configuracionFiltros.value[c.id]}
                    onChange={(e) =>
                      (configuracionFiltros.value = {
                        ...configuracionFiltros.value,
                        [c.id]: (e.target as HTMLSelectElement).value,
                      })
                    }
                  >
                    {filtros.map(([k, v]) => (
                      <option value={k}>{v}</option>
                    ))}
                  </select>
                </label>
              );
            }
          })}
        </Menu.Group>
      </Menu.SubContent>
    </Menu.Portal>
  </Menu.Sub>
);
