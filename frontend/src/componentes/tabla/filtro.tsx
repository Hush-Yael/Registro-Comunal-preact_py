import type { Column, RowData } from "@tanstack/react-table";
import type { TablaDatos } from ".";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterInputValuePattern?: RegExp;
    filterVariant?: "number" | "date" | "time" | "datetime" | "range";
  }
}

export default <T extends TablaDatos>({
  column,
}: {
  column: Column<T, unknown>;
}) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, filterInputValuePattern } =
    column.columnDef.meta ?? {};
  let timeout: number;

  const change = (value: string) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      column.setFilterValue(value);
    }, 500);
  };

  const beforeInput = (e: InputEvent) => {
    if (e.data && !filterInputValuePattern.test(e.data)) e.preventDefault();
  };

  return (
    <input
      class="w-full p-1.5 outline-0 focus:inset-shadow-[0_0_0_1px] focus:inset-shadow-primary hover:not-focus:shadow-[0_1px_0_#0003] dark:hover:not-focus:shadow-[0_1px_0_#fff3] [[type=date]]:not-focus:text-muted [[type=date]]:not-focus:hover:text-[inherit] font-[400] placeholder:font-thin placeholder:text-muted hover:placeholder:text-[inherit] focus:placeholder:text-[inherit] placeholder:transition-colors"
      placeholder="buscar..."
      type={filterVariant}
      name="filtro"
      // @ts-expect-error: el tipo del valor es correcto
      value={columnFilterValue || ""}
      onBeforeInput={filterInputValuePattern ? beforeInput : undefined}
      onChange={(e) => change((e.target as HTMLInputElement).value)}
    />
  );
};
