import type { Table } from "@tanstack/react-table";
import Iconos from "~/componentes/iconos";
import { TablaDatos, TablaProps } from ".";

type PaginacionProps<T extends TablaDatos> = {
  tabla: Table<T>;
} & Pick<TablaProps<T>, "apodoFilas">;

export default <T extends TablaDatos>(props: PaginacionProps<T>) => (
  <div class="flex items-center justify-between gap-x-5 gap-y-3 w-full mt-4 text-sm *:flex *:items-center max-[900px]:flex-col max-[900px]:items-start  sm:max-lg:items-center">
    <div class="gap-3 max-sm:justify-between max-sm:w-full">
      <div class="flex items-center gap-2">
        <span class="s-auto" role="status">
          {props.tabla.getRowCount().toLocaleString()}{" "}
          {props.apodoFilas || "filas"}
        </span>

        <span class="text-neutral-500">/</span>

        <span className="min-w-max" role="status">
          {props.apodoFilas || "filas"} por página:
        </span>
      </div>

      <label class="flex items-center gap-2 sr-only" htmlFor="page-size">
        Seleccionar cantidad de filas por página
      </label>
      <select
        id="page-size"
        class="input max-w-fit"
        value={props.tabla.getState().pagination.pageSize}
        onChange={(e) => {
          props.tabla.setPageSize(Number((e.target as HTMLInputElement).value));
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (i + 1) * 10)
          .concat([200, 500, 1000])
          .map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
      </select>
    </div>

    <div class="gap-x-5 gap-y-3 max-sm:flex-wrap max-sm:justify-between max-sm:w-full">
      <span role="status" class="flex items-center gap-1">
        <div>Página</div>
        <strong>
          {props.tabla.getState().pagination.pageIndex + 1} de{" "}
          {props.tabla.getPageCount().toLocaleString()}
        </strong>
      </span>

      <div role="group" class="flex items-center gap-1.5">
        <button
          class="btn btn-secundario p-0!"
          onClick={() => props.tabla.firstPage()}
          disabled={!props.tabla.getCanPreviousPage()}
        >
          <Iconos.FlechaDerUltimo class="size-6 transform-[rotate(180deg)]" />
        </button>
        <button
          class="btn btn-secundario p-0!"
          onClick={() => props.tabla.previousPage()}
          disabled={!props.tabla.getCanPreviousPage()}
        >
          <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)]" />
        </button>
        <button
          class="btn btn-secundario p-0!"
          onClick={() => props.tabla.nextPage()}
          disabled={!props.tabla.getCanNextPage()}
        >
          <Iconos.FlechaDer class="size-6" />
        </button>
        <button
          class="btn btn-secundario p-0!"
          onClick={() => props.tabla.lastPage()}
          disabled={!props.tabla.getCanNextPage()}
        >
          <Iconos.FlechaDerUltimo class="size-6" />
        </button>
      </div>

      <label
        htmlFor="page"
        class="flex items-center gap-2 max-sm:justify-between max-sm:w-full"
      >
        <span className="min-w-max">Ir a la página:</span>
        <input
          class="input max-sm:max-w-fit"
          type="number"
          min="1"
          id="page"
          max={props.tabla.getPageCount()}
          value={props.tabla.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = (e.target as HTMLInputElement).value
              ? Number((e.target as HTMLInputElement).value) - 1
              : 0;
            props.tabla.setPageIndex(page);
          }}
        />
      </label>
    </div>
  </div>
);
