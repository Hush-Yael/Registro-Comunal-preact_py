import { flexRender, type Table } from "@tanstack/react-table";
import type { TablaDatos } from ".";
import Filtro from "./filtro";

export default <T extends TablaDatos>(props: {
  tabla: Table<T>;
  filtrable?: boolean;
}) => (
  <thead class="grid z-1 sticky top-0 w-full border border-base rounded-t">
    <tr class="flex w-full">
      {props.tabla.getHeaderGroups()[0].headers.map((header) => (
        <th
          class="text-left p-1.5 px-2.5 first:rounded-tl last:rounded-tr bg-dark overflow-hidden text-nowrap text-ellipsis"
          key={header.id}
          data-id={header.id}
          style={{ width: header.getSize() }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </th>
      ))}
    </tr>
    {props.filtrable && (
      <tr class="flex w-full border-t border-base">
        {props.tabla.getHeaderGroups()[0].headers.map((header) => (
          <th
            class="block bg-base"
            key={header.id + "-filtro"}
            data-id={header.id + "-filtro"}
            style={{ width: header.getSize() }}
          >
            {header.column.getCanFilter() ? (
              <Filtro column={header.column} />
            ) : null}
          </th>
        ))}
      </tr>
    )}
  </thead>
);
