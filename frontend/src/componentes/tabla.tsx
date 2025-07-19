import { type Signal, useSignalEffect } from "@preact/signals";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  type TableOptions,
  type RowData,
  type Column,
  type Table,
} from "@tanstack/react-table";
import type { JSX } from "preact/jsx-runtime";
import Carga from "./carga";
import Iconos from "./iconos";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterInputValuePattern?: RegExp;
    filterVariant?: "number" | "date" | "time" | "datetime" | "range";
  }
}

type TablaProps<T extends Record<string, unknown>> = {
  wrapperClass?: string;
  options?: Omit<TableOptions<T>, "columns" | "data" | "getCoreRowModel">;
  class?: string;
  columnas: ColumnDef<T, any>[];
  datos: Signal<T[]>;
  filasNombre?: string;
  shouldFetch?: Signal<boolean>;
  valuesFetcher?: () => Promise<T[]>;
  // eslint-disable-next-line no-unused-vars
  header?: (tabla: Table<T>) => JSX.Element;
};

export default <T extends Record<string, unknown>>(props: TablaProps<T>) => {
  useSignalEffect(() => {
    if (props.shouldFetch && props.shouldFetch.value)
      props
        .valuesFetcher()
        .then((r) => {
          props.datos.value = r;
        })
        .catch(console.error)
        .finally(() => (props.shouldFetch.value = false));
  });

  const tabla = useReactTable({
    ...props.options,
    columns: props.columnas,
    data: props.datos.value,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {props.header && props.header(tabla)}
      <Tabla wrapperClass={props.wrapperClass} class={props.class}>
        <thead>
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr class="sticky top-0" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Cabecera
                  key={header.id}
                  data-id={header.id}
                  style={{ width: header.getSize() }}
                >
                  <div class="col gap-1.5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {props.options?.getFilteredRowModel &&
                      header.column.getCanFilter() && (
                        <div class="w-full">
                          <Filtro column={header.column} />
                        </div>
                      )}
                  </div>
                </Cabecera>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {props.valuesFetcher && props.shouldFetch.value ? (
            <tr class="bg-neutral-200 dark:bg-neutral-700">
              <td class="p-4" colSpan={props.columnas.length}>
                <span
                  role="status"
                  class="flex items-center justify-center gap-2"
                >
                  <Carga class="size-5 mx-1" />
                  Cargando...
                </span>
              </td>
            </tr>
          ) : (
            tabla.getRowModel().rows.map((row) => (
              <Fila key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} class="p-1.5 px-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </Fila>
            ))
          )}
        </tbody>
      </Tabla>
      {props.options?.getPaginationRowModel && (
        <div class="flex items-center justify-between gap-5 w-full mt-4 *:flex *:items-center">
          <div class="gap-3">
            <span class="s-auto" role="status">
              {tabla.getRowCount().toLocaleString()}{" "}
              {props.filasNombre || "filas"}
            </span>
            <span class="text-neutral-500">/</span>
            <label class="flex items-center gap-2" htmlFor="page-size">
              <span className="min-w-max">
                {props.filasNombre || "filas"} por página:
              </span>
              <select
                id="page-size"
                class="input"
                value={tabla.getState().pagination.pageSize}
                onChange={(e) => {
                  tabla.setPageSize(
                    Number((e.target as HTMLInputElement).value)
                  );
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
            </label>
          </div>
          <div class="gap-5">
            <span role="status" class="flex items-center gap-1">
              <div>Página</div>
              <strong>
                {tabla.getState().pagination.pageIndex + 1} de{" "}
                {tabla.getPageCount().toLocaleString()}
              </strong>
            </span>
            <div role="group" class="flex items-center gap-1.5">
              <button
                class="rounded btn btn-secundario p-0!"
                onClick={() => tabla.firstPage()}
                disabled={!tabla.getCanPreviousPage()}
              >
                <Iconos.FlechaDerUltimo class="size-6 transform-[rotate(180deg)]" />
              </button>
              <button
                class="rounded btn btn-secundario p-0!"
                onClick={() => tabla.previousPage()}
                disabled={!tabla.getCanPreviousPage()}
              >
                <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)]" />
              </button>
              <button
                class="rounded btn btn-secundario p-0!"
                onClick={() => tabla.nextPage()}
                disabled={!tabla.getCanNextPage()}
              >
                <Iconos.FlechaDer class="size-6" />
              </button>
              <button
                class="rounded btn btn-secundario p-0!"
                onClick={() => tabla.lastPage()}
                disabled={!tabla.getCanNextPage()}
              >
                <Iconos.FlechaDerUltimo class="size-6" />
              </button>
            </div>
            <label htmlFor="page" class="flex items-center gap-2">
              <span className="min-w-max">Ir a la página:</span>
              <input
                class="input"
                type="number"
                min="1"
                id="page"
                max={tabla.getPageCount()}
                value={tabla.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = (e.target as HTMLInputElement).value
                    ? Number((e.target as HTMLInputElement).value) - 1
                    : 0;
                  tabla.setPageIndex(page);
                }}
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
};

const Filtro = <T extends Record<string, unknown>>({
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
    <input
      class="w-full p-0.25 px-1 mb-1 rounded outline outline-offset-2 outline-neutral-600 dark:outline-neutral-400 hover:outline-neutral-500 focus:outline-white focus:dark:outline-neutral-900 bg-neutral-800 dark:bg-[#bababa] focus:bg-neutral-700 focus:dark:bg-neutral-400 transition-colors"
      type={filterVariant}
      name="filtro"
      // @ts-expect-error: el tipo del valor es correcto
      value={columnFilterValue || ""}
      onBeforeInput={filterInputValuePattern ? beforeInput : undefined}
      onChange={(e) => change((e.target as HTMLInputElement).value)}
    />
  );
};

export const Tabla = (
  props: JSX.IntrinsicElements["table"] & { wrapperClass?: string }
) => (
  <div class={`${props.wrapperClass || ""} overflow-y-auto`}>
    <table
      {...props}
      class={`w-full table-auto border-tools-table-outline rounded-md border-neutral-500 text-sm ${
        props.class || ""
      }`}
      // @ts-expect-error: no se debe pasar wrapperClass
      wrapperClass={null}
    >
      {props.children}
    </table>
  </div>
);

export const Cabecera = (props: JSX.IntrinsicElements["th"]) => (
  <th
    {...props}
    class={`p-1.5 px-2.5 bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-700 first:rounded-tl-md last:rounded-tr-md text-nowrap ${
      props.class || ""
    }`}
  >
    {props.children}
  </th>
);

export const Fila = (props: JSX.IntrinsicElements["tr"]) => (
  <tr
    {...props}
    class={`group odd:bg-neutral-100 odd:dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 ${
      props.class || ""
    }`}
  >
    {props.children}
  </tr>
);
