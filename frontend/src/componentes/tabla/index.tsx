import { type Signal, useSignalEffect } from "@preact/signals";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  type TableOptions,
  type Table,
} from "@tanstack/react-table";
import type { JSX } from "preact/jsx-runtime";
import Carga from "~/componentes/carga";
import Filtro from "./filtro";
import Paginacion from "./paginacion";

export type TablaDatos = Record<string, unknown>;

export type TablaProps<T extends TablaDatos> = {
  wrapperClass?: string;
  options?: Omit<TableOptions<T>, "columns" | "data" | "getCoreRowModel">;
  class?: string;
  columnas: ColumnDef<T, any>[];
  datos: Signal<T[]>;
  apodoFilas?: string;
  datosDebenCargar?: Signal<boolean>;
  obtencionDatos?: () => Promise<T[]>;
  // eslint-disable-next-line no-unused-vars
  header?: (tabla: Table<T>) => JSX.Element;
};

export default <T extends TablaDatos>(props: TablaProps<T>) => {
  useSignalEffect(() => {
    if (props.datosDebenCargar && props.datosDebenCargar.value)
      props
        .obtencionDatos()
        .then((r) => {
          props.datos.value = r;
        })
        .catch(console.error)
        .finally(() => (props.datosDebenCargar.value = false));
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
          {props.obtencionDatos && props.datosDebenCargar.value ? (
            <MensajeCarga columnas={props.columnas} />
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
      {props.options?.getPaginationRowModel && <Paginacion tabla={tabla} />}
    </>
  );
};

const MensajeCarga = <T extends TablaDatos>(
  props: Pick<TablaProps<T>, "columnas">
) => (
  <tr class="bg-darkest">
    <td class="p-4" colSpan={props.columnas.length}>
      <span role="status" class="flex items-center justify-center gap-2">
        <Carga class="size-5 mx-1" />
        Cargando...
      </span>
    </td>
  </tr>
);

const Tabla = (
  props: JSX.IntrinsicElements["table"] & { wrapperClass?: string }
) => (
  <div class={`${props.wrapperClass || ""} overflow-y-auto max-w-full`}>
    <table
      {...props}
      class={`w-full max-w-full table-auto text-sm ${props.class || ""}`}
      // @ts-expect-error: no se debe pasar wrapperClass
      wrapperClass={null}
    >
      {props.children}
    </table>
  </div>
);

const Cabecera = (props: JSX.IntrinsicElements["th"]) => (
  <th
    {...props}
    class={`p-1.5 px-2.5 primario first:rounded-tl-lg last:rounded-tr-lg text-nowrap ${
      props.class || ""
    }`}
  >
    {props.children}
  </th>
);

const Fila = (props: JSX.IntrinsicElements["tr"]) => (
  <tr
    {...props}
    class={`group odd:bg-darkest border-b border-base ${props.class || ""}`}
  >
    {props.children}
  </tr>
);
