import { JSX } from "preact/jsx-runtime";

export default (
  props: JSX.IntrinsicElements["input"] & {
    titulo: JSX.Element | string;
    type: "checkbox" | "radio";
  }
) => {
  return (
    <div>
      <input
        class="peer/input sr-only"
        {...props}
        // @ts-expect-error: no se debe pasar el titulo
        titulo={null}
      />
      <label
        class="col gap-3 p-3 size-full rounded border-1 border-transparent peer-checked/input:border-neutral-900! dark:peer-checked/input:border-neutral-100! peer-checked/input:bg-neutral-100 peer-checked/input:dark:bg-neutral-500 hover:bg-[#efefef] dark:hover:bg-[#555] peer-focus/input:border-neutral-300 peer-not-checked/input:hover:border-neutral-300 dark:peer-not-checked/input:hover:border-neutral-500 peer-disabled/input:opacity-50 bg-neutral-100 dark:bg-neutral-700 transition-colors cursor-pointer peer-disabled/input:cursor-not-allowed"
        htmlFor={props.id}
      >
        <span class="flex items-center gap-3">
          <span
            data-checked={props.checked || null}
            class={`relative p-2 align-middle ${
              props.type === "radio"
                ? "rounded-full data-checked:before:bg-neutral-900 dark:data-checked:before:bg-neutral-100 before:inset-0.75"
                : "rounded font-bold data-checked:before:content-['✓'] before:-top-0.75 before:left-0.5 before:text-transparent data-checked:before:text-neutral-900"
            } border-2 border-neutral-500 dark:border-neutral-400 data-checked:border-neutral-900 dark:data-checked:border-neutral-100 before:content-[''] before:absolute before:rounded-[inherit] before:transition-colors transition-colors`}
          />
          <span class="flex justify-between items-center gap-2 w-full font-bold">
            {props.titulo}
          </span>
        </span>
        <span class="text-sm text-neutral-600 dark:text-neutral-300 empty:hidden">
          {props.children}
        </span>
      </label>
    </div>
  );
};
