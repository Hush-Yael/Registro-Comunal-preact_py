import { type Signal, useSignal } from "@preact/signals";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  type TableOptions,
  type RowData,
} from "@tanstack/react-table";
import { useEffect } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import Carga from "./carga";
import Iconos from "./iconos";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    datosSignal: Signal<TData[]>;
  }
}

type TablaProps<
  T extends Record<string, unknown>,
  F extends undefined | (() => Promise<T[]>)
> = {
  wrapperClass?: string;
  options?: Omit<TableOptions<T>, "columns" | "data" | "getCoreRowModel">;
  class?: string;
  columnas: ColumnDef<T, any>[];
  fetchValues?: F;
} & (F extends undefined ? { datos: T[] } : {});

export default <
  T extends Record<string, unknown>,
  F extends undefined | (() => Promise<T[]>)
>(
  props: TablaProps<T, F>
) => {
  const datos = useSignal(
    props.fetchValues ? [] : (props as TablaProps<T, undefined>).datos
  );
  const cargado = useSignal(false);

  useEffect(() => {
    if (props.fetchValues)
      props
        .fetchValues()
        .then((r) => {
          datos.value = r;
        })
        .catch(console.error)
        .finally(() => (cargado.value = true));
  }, []);

  const tabla = useReactTable({
    ...props.options,
    columns: props.columnas,
    data: datos.value,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      datosSignal: datos,
    },
  });

  return (
    <>
      <Tabla wrapperClass={props.wrapperClass} class={props.class}>
        <thead>
          {tabla.getHeaderGroups().map((headerGroup) => (
            <tr class="sticky top-0" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Cabecera key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Cabecera>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {props.fetchValues && !cargado.value ? (
            <tr class="bg-neutral-200">
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
                  <td key={cell.id} class="p-1.5 px-2">
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
              {tabla.getRowCount().toLocaleString()} filas
            </span>
            <span class="text-neutral-500">/</span>
            <label class="flex items-center gap-2" htmlFor="page-size">
              <span className="min-w-max">Filas por página:</span>
              <select
                id="page-size"
                class="w-full p-0.5 px-1 rounded bg-neutral-200 text-neutral-700"
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
          <fieldset class="flex items-center gap-1.5">
            <button
              class="rounded bg-neutral-200"
              onClick={() => tabla.firstPage()}
              disabled={!tabla.getCanPreviousPage()}
            >
              <Iconos.DobleFlechaDer class="size-6 transform-[rotate(180deg)]" />
            </button>
            <button
              class="rounded bg-neutral-200"
              onClick={() => tabla.previousPage()}
              disabled={!tabla.getCanPreviousPage()}
            >
              <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)]" />
            </button>
            <button
              class="rounded bg-neutral-200"
              onClick={() => tabla.nextPage()}
              disabled={!tabla.getCanNextPage()}
            >
              <Iconos.FlechaDer class="size-6" />
            </button>
            <button
              class="rounded bg-neutral-200"
              onClick={() => tabla.lastPage()}
              disabled={!tabla.getCanNextPage()}
            >
              <Iconos.DobleFlechaDer class="size-6" />
            </button>
          </fieldset>
          <label htmlFor="page" class="flex items-center gap-2">
            <span className="min-w-max">Ir a la página:</span>
            <input
              class="w-full p-0.5 px-1 rounded bg-neutral-200 text-neutral-700"
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
    class={`p-1.5 px-2.5 bg-neutral-900 text-white first:rounded-tl-md last:rounded-tr-md text-nowrap ${
      props.class || ""
    }`}
  >
    {props.children}
  </th>
);

export const Fila = (props: JSX.IntrinsicElements["tr"]) => (
  <tr
    {...props}
    class={`group odd:bg-neutral-100 border-b border-neutral-200 ${
      props.class || ""
    }`}
  >
    {props.children}
  </tr>
);
