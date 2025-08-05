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
          class="inline-flex relative text-left p-1.5 px-2.5 first:rounded-tl last:rounded-tr bg-dark select-none"
          key={header.id}
          data-id={header.id}
          style={{ width: header.getSize() }}
        >
          <span class="w-full overflow-hidden text-nowrap text-ellipsis">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>

          {props.tabla.options.enableColumnResizing && (
            <div
              class="z-1 absolute top-0 right-0 bottom-0 w-1 hover:bg-[#0003] dark:hover:bg-[#fff3] cursor-ew-resize active:cursor-grabbing active:bg-primary! transition-colors"
              style={{
                transform: header.column.getIsResizing()
                  ? `translateX(${
                      props.tabla.getState().columnSizingInfo.deltaOffset
                    }px)`
                  : "",
              }}
              onDblClick={() => header.column.resetSize()}
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
            />
          )}
        </th>
      ))}
    </tr>
    {props.filtrable && (
      <tr class="flex w-full border-t border-base">
        {props.tabla.getHeaderGroups()[0].headers.map((header) => (
          <th
            class="relative block bg-base"
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
