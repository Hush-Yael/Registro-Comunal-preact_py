import { flexRender, type Table } from "@tanstack/react-table";
import type { TablaDatos } from ".";
import Filtro from "./filtro";

export default <T extends TablaDatos>(props: {
  tabla: Table<T>;
  filtrable?: boolean;
}) => (
  <thead class="grid z-1 sticky top-0 w-full">
    <tr class="flex w-full">
      {props.tabla.getHeaderGroups()[0].headers.map((header) => (
        <th
          class="col justify-center items-start p-1.5 px-2.5 primario first:rounded-tl-[var(--radius-box)] last:rounded-tr-[var(--radius-box)] text-nowrap"
          key={header.id}
          data-id={header.id}
          style={{ width: header.getSize() }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
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
