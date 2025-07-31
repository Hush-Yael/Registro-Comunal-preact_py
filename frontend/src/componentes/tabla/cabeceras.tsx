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
          class="col justify-center items-start p-1.5 px-2.5 first:rounded-tl last:rounded-tr bg-dark text-nowrap"
          key={header.id}
          data-id={header.id}
          style={{ width: header.getSize() }}
        >
          <span className="overflow-hidden text-ellipsis max-w-full">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {props.filtrable && header.column.getCanFilter() && (
            <div class="w-full mt-1.5">
              <Filtro column={header.column} />
            </div>
          )}
        </th>
      ))}
    </tr>
  </thead>
);
