import type { Column, RowData } from "@tanstack/react-table";
import type { TablaDatos } from ".";
import { Popover } from "radix-ui";
import {
  configuracionFiltros,
  OPCIONES_FILTROS,
} from "~/constantes/lista-comunidad";
import Iconos from "../iconos";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterInputValuePattern?: RegExp;
    filterVariant?: "number" | "date" | "time" | "datetime" | "range";
  }
}

export default <T extends TablaDatos>({
  column,
}: {
  column: Column<T, unknown>;
}) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterInputValuePattern } =
    column.columnDef.meta ?? {};
  let timeout: number;

  const change = (value: string) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      column.setFilterValue(value);
    }, 500);
  };

  const beforeInput = (e: InputEvent) => {
    if (e.data && !filterInputValuePattern.test(e.data)) e.preventDefault();
  };

  return (
    <>
      <input
        class="peer w-full p-1.5 outline-0 focus:inset-shadow-[0_0_0_1px] focus:inset-shadow-primary hover:not-focus:shadow-[0_1px_0_#0003] dark:hover:not-focus:shadow-[0_1px_0_#fff3] [[type=date]]:not-focus:text-muted [[type=date]]:not-focus:hover:text-[inherit] font-[400] placeholder:font-thin placeholder:text-muted hover:placeholder:text-[inherit] focus:placeholder:text-[inherit] placeholder:transition-colors"
        placeholder="buscar..."
        type={filterVariant}
        name="filtro"
        // @ts-expect-error: el tipo del valor es correcto
        value={columnFilterValue || ""}
        onKeyUp={(e) =>
          e.key === "ArrowUp" &&
          (
            (e.target as HTMLInputElement)
              .nextElementSibling as HTMLButtonElement
          ).focus()
        }
        onBeforeInput={filterInputValuePattern ? beforeInput : undefined}
        onChange={(e) => change((e.target as HTMLInputElement).value)}
      />

      <Popover.Root>
        <Popover.Trigger
          tabIndex={-1}
          onKeyUp={(e) =>
            (e.key === "ArrowDown" || e.key === "Escape") &&
            (
              (e.target as HTMLElement)
                .previousElementSibling as HTMLInputElement
            ).focus()
          }
          class="filtro-popover-btn peer-not-focus:opacity-0 peer-focus:pointer-events-auto not-focus:pointer-events-none data-[state=open]:opacity-100 focus:opacity-100 absolute right-0 -top-full h-full btn-primario p-1 transition-opacity"
        >
          <Iconos.ConfigurarFiltro class="size-5.5" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={5}
            class="dropdown-content py-0! text-sm"
          >
            <label class="dropdown-item">
              <span class="text-muted">Filtro aplicado:</span>

              <select
                id={column.id + "-fn"}
                class="dropdown-select"
                name="filtro"
                defaultValue={configuracionFiltros.value[column.id]}
                onChange={(e) =>
                  (configuracionFiltros.value = {
                    ...configuracionFiltros.value,
                    [column.id]: (e.target as HTMLSelectElement).value,
                  })
                }
              >
                {(OPCIONES_FILTROS[column.id]
                  ? Object.entries(
                      OPCIONES_FILTROS[
                        column.id as keyof typeof OPCIONES_FILTROS
                      ]
                    )
                  : Object.entries(OPCIONES_FILTROS["comun"])
                ).map(([k, v]) => (
                  <option value={k}>{v}</option>
                ))}
              </select>
            </label>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};
