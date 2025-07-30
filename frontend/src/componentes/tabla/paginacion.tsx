import type { Table } from "@tanstack/react-table";
import Iconos from "~/componentes/iconos";
import useMedia from "~/hooks/useMedia";
import { TablaDatos } from ".";
import { Popover } from "radix-ui";

type PaginasProps<T extends TablaDatos> = {
  tabla: Table<T>;
  apodoFilas: string;
};

export default <T extends TablaDatos>(props: PaginasProps<T>) => (
  <div class="flex items-center justify-between gap-5 w-full -mb-2 p-2 px-3 rounded-box bg-dark border border-base text-muted text-sm">
    <div className="flex items-center gap-3  max-[450px]:[&_svg]:size-4!">
      <button
        class="flex items-center gap-2"
        onClick={() => cambiarLimite(props)}
      >
        <Iconos.Tuerca class="size-5" />
        <span class="after:content-['...'] after:-ml-0.5 sr-only">
          Establecer límite de {props.apodoFilas || "filas"} por página:
        </span>
      </button>
      <Cantidad {...props} />
    </div>

    <div
      role="group"
      class="flex items-center gap-1.5 [&_svg]:size-5! [&_button]:rounded-field [&_button]:not-disabled:hover:bg-base [&_button]:not-disabled:focus-visible:bg-base"
      aria-label="Navegación de las páginas"
    >
      <button
        onClick={props.tabla.firstPage}
        aria-label="Ir a la primera página"
        disabled={!props.tabla.getCanPreviousPage()}
      >
        <Iconos.FlechaDerUltimo class="transform-[rotate(180deg)]" />
      </button>
      <button
        onClick={props.tabla.previousPage}
        aria-label="Ir a la página anterior"
        disabled={!props.tabla.getCanPreviousPage()}
      >
        <Iconos.FlechaDer class="transform-[rotate(180deg)]" />
      </button>

      <input
        class="bg-base border border-base rounded-field px-2 max-w-[6ch]"
        aria-label="Ir a la página número:"
        type="number"
        min="1"
        id="page"
        max={props.tabla.getPageCount()}
        required
        value={props.tabla.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).valueAsNumber;
          const page = v ? v - 1 : 0;

          props.tabla.setPageIndex(page);
        }}
      />

      <button
        onClick={props.tabla.nextPage}
        aria-label="Ir a la siguiente página"
        disabled={!props.tabla.getCanNextPage()}
      >
        <Iconos.FlechaDer />
      </button>
      <button
        onClick={props.tabla.lastPage}
        aria-label="Ir a la última página"
        disabled={!props.tabla.getCanNextPage()}
      >
        <Iconos.FlechaDerUltimo />
      </button>

      <hr
        aria-orientation="vertical"
        class="w-[1px] mx-1.5 h-3 border-0 bg-[hsl(0_0%_85%)] dark:bg-[hsl(0_0%_30%)]"
      />

      <div
        class="max-[400px]:text-xs"
        style={{ wordSpacing: ".125em" }}
        role="status"
      >
        <span className="sr-only">Página</span>
        {props.tabla.getState().pagination.pageIndex + 1} de{" "}
        {props.tabla.getPageCount()}
      </div>
    </div>
  </div>
);

const cambiarLimite = <T extends TablaDatos>(props: PaginasProps<T>) => {
  const nuevoLimite = Number(
    prompt(
      `Límite de ${props.apodoFilas || "filas"} por página:`,
      props.tabla.getState().pagination.pageSize.toString()
    )
  );

  props.tabla.setPageSize(
    Number.isInteger(nuevoLimite) && nuevoLimite > 0
      ? nuevoLimite
      : props.tabla.getState().pagination.pageSize
  );
};

const media = useMedia("(max-width: 500px)");

const Cantidad = <T extends TablaDatos>(props: PaginasProps<T>) => {
  const l = `${props.tabla.getRowCount()} ${props.apodoFilas || "filas"}`;

  return media.value ? (
    <Popover.Root>
      <Popover.Trigger>
        <Iconos.Info />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="dropdown-content text-sm"
          side="bottom"
          sideOffset={5}
        >
          {l}
          <Popover.Arrow className="fill-[var(--border-base)]!" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <span role="status">{l}</span>
  );
};
