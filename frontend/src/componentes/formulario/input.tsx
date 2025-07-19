import type { JSX } from "preact/jsx-runtime";
import { contextoFormulario } from ".";
import { useContext, useRef } from "preact/hooks";
import { TargetedEvent } from "preact/compat";

export type InputProps = JSX.IntrinsicElements["input"] & {
  label: string;
  campo: string;
  inputClass?: string;
  id?: string;
  descripcion?: string;
  error?: string;
};

export default (props: InputProps) => (
  <div class={`col gap-1.5 ${props.class || ""}`}>
    <label htmlFor={props.id}>
      <p class="text-muted">{props.label}</p>
      <Input {...props} />
    </label>
    <Descripcion texto={props.descripcion} id={props.id} />
    <MensajeError campo={props.campo} id={props.id} />
  </div>
);

export const Input = (
  props: Omit<JSX.IntrinsicElements["input"], "value"> & {
    descripcion?: string;
    inputClass?: string;
    campo: string;
  }
) => {
  const { datos, errores, estado } = useContext(contextoFormulario);
  const error = errores.value[props.campo];
  const valorAnterior = useRef(datos.value[props.campo]);

  // se guarda el último valor ingresado para compararlo al cambiarlo
  const focus = (evento) => {
    valorAnterior.current = datos.value[props.campo];
    props.onFocus && props.onFocus(evento);
  };
  // se guarda el último valor ingresado para compararlo al cambiarlo
  const blur = (evento) => {
    valorAnterior.current = datos.value[props.campo];
    props.onBlur && props.onBlur(evento);
  };

  const change = (evento: TargetedEvent<HTMLInputElement>) => {
    const valor = (evento.target as HTMLInputElement).value;

    // se eliminan los errores cuando se cambia el valor que provoca el error
    if (errores.value[props.campo] && valor != valorAnterior.current)
      errores.value = { ...errores.value, [props.campo]: "" };

    datos.value = { ...datos.value, [props.campo]: valor };
    props.onChange && props.onChange(evento);
  };

  return (
    <input
      {...props}
      value={datos.value[props.campo] as string}
      disabled={
        props.disabled ||
        estado.value === "subiendo" ||
        estado.value === "fetching"
      }
      class={`w-full input ${props.inputClass || ""}`}
      aria-invalid={Boolean(error)}
      aria-describedby={
        props.id && props.descripcion ? props.id + "-desc" : null
      }
      aria-errormessage={props.id && error ? props.id + "-error" : null}
      onFocus={focus}
      onBlur={blur}
      onChange={change}
    />
  );
};

export const Descripcion = (props: { texto: string; id?: string }) =>
  props.texto && (
    <p
      class="ml-0.5 text-xs text-muted"
      id={props.id ? props.id + "-desc" : null}
    >
      {props.texto}
    </p>
  );

export const MensajeError = (props: { campo: string; id?: string }) => {
  const { errores } = useContext(contextoFormulario);
  const error = errores.value[props.campo];

  if (error)
    return (
      <p
        class="text-xs text-red-500"
        id={props.id ? props.id + "-error" : null}
      >
        {error}
      </p>
    );
};
