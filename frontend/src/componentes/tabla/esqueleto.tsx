import type { Table } from "@tanstack/react-table";
import type { TablaDatos } from ".";

export default <T extends TablaDatos>(props: {
  tabla: Table<T>;
  class?: string;
  wrapperClass?: string;
  paginacion?: boolean;
}) => {
  const cabeceras = props.tabla.getHeaderGroups()[0].headers;

  return (
    <div class={`col gap-2 overflow-auto h-full ${props.wrapperClass || ""}`}>
      {props.paginacion && (
        <div
          style={{ animationDuration: "1s" }}
          class="flex justify-between gap-8 w-full h-12 p-2 rounded-box bg-dark border border-base animate-pulse [&>div]:h-full [&>div]:rounded-selector [&>div]:bg-[#0002] dark:[&>div]:bg-[#fff1]"
        >
          <div class="w-1/3" />
          <div class="w-full" />
        </div>
      )}
      <table
        class={`size-full table-fixed rounded border-separate border-spacing-0 border-tools-table-outline border border-base [&_th,&_td]:border-r [&_th,&_td]:border-base  ${
          props.class || ""
        }`}
      >
        <thead>
          <tr class="bg-dark animate-pulse" style={{ animationDuration: "1s" }}>
            {cabeceras.map((header) => (
              <th
                class="first:rounded-tl last:rounded-tr"
                style={{ width: header.getSize() }}
              >
                <div class="m-2 h-7 rounded-selector bg-[hsl(0,0%,80%)] dark:bg-[hsl(0,0%,15%)]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map(() => (
            <tr
              role="status"
              aria-label="Cargando"
              class="bg-dark animate-pulse"
              style={{ animationDuration: "1s" }}
            >
              {Array.from({
                length: cabeceras.length,
              }).map(() => (
                <td>
                  <div class="m-2 h-10 rounded-selector bg-[hsl(0,0%,90%)] dark:bg-[hsl(0,0%,15%)]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
