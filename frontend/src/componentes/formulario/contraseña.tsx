import { signal } from "@preact/signals";
import { Descripcion, Input, MensajeError, type InputProps } from "./input";
import Iconos from "../../componentes/iconos";

export default (props: Omit<InputProps, "label" | "campo" | "id">) => {
  const visible = signal(false);

  return (
    <div class="col gap-1.5">
      <div class="relative">
        <label htmlFor="contraseña">
          <p class="text-neutral-700">Contraseña</p>
          <Input
            {...props}
            id="contraseña"
            campo="contraseña"
            type={visible.value ? "text" : "password"}
          />
        </label>
        <button
          class="absolute right-1 top-[2px]"
          type="button"
          aria-label={`${visible ? "ocultar" : "mostrar"} contraseña`}
          onClick={() => (visible.value = !visible.value)}
        >
          {visible.value ? (
            <Iconos.Ocultar class="size-[1em]" />
          ) : (
            <Iconos.Ver class="size-[1.125em]" />
          )}
        </button>
      </div>
      <Descripcion texto={props.descripcion} id="contraseña" />
      <MensajeError campo="contraseña" id="contraseña" />
    </div>
  );
};
