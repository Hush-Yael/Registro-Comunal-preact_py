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
      class="w-full [[type=date]]:max-w-[12ch] p-0.25 px-1 mb-1 rounded-field outline outline-offset-1 outline-neutral-600 dark:outline-neutral-400 hover:outline-neutral-500 focus:outline-white focus:dark:outline-neutral-900 bg-neutral-800 dark:bg-[#bababa] focus:bg-neutral-700 focus:dark:bg-neutral-400 transition-colors scheme-dark dark:scheme-light"
      type={filterVariant}
      name="filtro"
      // @ts-expect-error: el tipo del valor es correcto
      value={columnFilterValue || ""}
      onBeforeInput={filterInputValuePattern ? beforeInput : undefined}
      onChange={(e) => change((e.target as HTMLInputElement).value)}
    />
  );
};
