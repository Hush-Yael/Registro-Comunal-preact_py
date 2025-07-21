import { useSignal } from "@preact/signals";
import { Descripcion, Input, MensajeError, type InputProps } from "./input";
import Iconos from "~/componentes/iconos";
import { CONTRASEÑA_MÍNIMA } from "~/utilidades";

export default (props: Omit<InputProps, "label" | "campo" | "id">) => {
  const visible = useSignal(false);

  return (
    <div class="col gap-1.5">
      <div class="relative">
        <label htmlFor="contrasena">
          <p class="text-muted">Contraseña</p>
          <Input
            {...props}
            id="contrasena"
            campo="contraseña"
            minLength={CONTRASEÑA_MÍNIMA}
            required
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
