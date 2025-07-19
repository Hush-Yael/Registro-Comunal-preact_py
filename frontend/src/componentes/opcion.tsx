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
        class="col gap-3 p-3 size-full btn-secundario rounded-field peer-checked/input:border-primary! peer-[:checked:focus-visible]/input:outline outline-offset-2 peer-disabled/input:opacity-50 transition-colors cursor-pointer peer-disabled/input:cursor-not-allowed"
        htmlFor={props.id}
      >
        <span class="flex items-center gap-3">
          <span
            data-checked={props.checked || null}
            class={`relative p-2 align-middle ${
              props.type === "radio"
                ? "rounded-full data-checked:before:bg-primary before:inset-0.75"
                : "rounded font-bold data-checked:before:content-['✓'] before:-top-0.75 before:left-0.5 before:text-transparent"
            } border-2 border-neutral-500 dark:border-neutral-400 data-checked:border-primary before:content-[''] before:absolute before:rounded-[inherit] before:transition-colors transition-colors`}
          />
          <span class="flex justify-between items-center gap-2 w-full text-base font-bold">
            {props.titulo}
          </span>
        </span>
        <span class="text-sm text-muted empty:hidden">{props.children}</span>
      </label>
    </div>
  );
};
