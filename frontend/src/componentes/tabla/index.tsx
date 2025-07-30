import { type Signal, useSignalEffect } from "@preact/signals";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
  type TableOptions,
  type Table,
  Row,
} from "@tanstack/react-table";
import type { JSX } from "preact/jsx-runtime";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "preact/hooks";
import Cabeceras from "./cabeceras";
import Esqueleto from "./esqueleto";

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

  const filas = tabla.getRowModel().rows;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: filas.length,
    estimateSize: () => 40, // estimación de la altura de la fila para un arrastre de la scrollbar adecuado
    getScrollElement: () => tableContainerRef.current,
    // cálculo de la altura dinámica de la fila, excepto en Firefox, porque mide la altura del borde incorrectamente
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  if (props.obtencionDatos && props.datosDebenCargar.value)
    return (
      <Esqueleto
        class={props.class}
        paginacion={props.options?.getPaginationRowModel !== undefined}
        tabla={tabla}
      />
    );

  return (
    <>
      {props.header && props.header(tabla)}
      <div
        ref={tableContainerRef}
        class={`relative size-full max-h-full overflow-auto ${
          props.wrapperClass || ""
        }`}
      >
        <table
          class={`grid table-fixed border-collapse text-sm ${
            props.class || ""
          }`}
        >
          <Cabeceras
            tabla={tabla}
            filtrable={props.options?.getFilteredRowModel !== undefined}
          />
          <tbody
            class="grid relative"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = filas[virtualRow.index] as Row<T>;

              return (
                <tr
                  key={row.id}
                  class="flex w-full absolute group dark:not-data-odd:bg-darkest data-odd:bg-dark"
                  data-index={virtualRow.index} // se necesita para la medida de la altura dinámica
                  ref={(node) =>
                    // cálculo de la altura de la fila
                    rowVirtualizer.measureElement(node)
                  }
                  // como se generan dinámicamente, se necesita el index para saber si es par o impar
                  data-odd={virtualRow.index % 2 === 0 ? "" : null}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, // distancia en relación a la anterior fila
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      class="flex items-center p-1.5 px-2.5"
                      data-column-id={cell.column.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
