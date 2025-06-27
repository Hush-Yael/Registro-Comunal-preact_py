import { type Signal, useSignal } from "@preact/signals";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  type TableOptions,
  type RowData,
} from "@tanstack/react-table";
import { useEffect } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import Carga from "./carga";

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
    columns: props.columnas,
    data: datos.value,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...props.options,
    meta: {
      datosSignal: datos,
    },
  });

  return (
    <Tabla wrapperClass={props.wrapperClass} class={props.class}>
      <thead>
        {tabla.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
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
                className="flex items-center justify-center gap-2"
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
    class={`sticky top-0 p-1.5 px-2 bg-neutral-900 text-white border-b border-neutral-600 first:rounded-tl-md last:rounded-tr-md text-nowrap ${
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
