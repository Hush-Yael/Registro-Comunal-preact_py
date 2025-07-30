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
      <table class={`size-full table-fixed ${props.class || ""}`}>
        <thead>
          <tr
            class="primario animate-pulse"
            style={{ animationDuration: "1s" }}
          >
            {cabeceras.map((header) => (
              <th
                class="p-1.5 px-2.5 first:rounded-tl-lg last:rounded-tr-lg"
                style={{ width: header.getSize() }}
              >
                <div class="m-2 h-7 rounded-selector dark:bg-[hsl(0,0%,80%)] bg-[hsl(0,0%,15%)]" />
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
