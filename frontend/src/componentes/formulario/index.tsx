import type { JSX } from "preact/jsx-runtime";
import { createContext } from "preact";
import { useRef, MutableRef } from "preact/hooks";
import { signal, Signal, useSignalEffect } from "@preact/signals";
import Alerta from "../alerta";
import { useContext } from "preact/hooks";
import { rutaApi } from "../../../utilidades";

export type ContextoFormulario<T extends Record<string, unknown>> = {
  datos: Signal<T>;
  datosIniciales: MutableRef<T>;
  errores: Signal<Record<string, string>>;
  estado: Signal<string>;
};

type HandlerEvent<T extends Record<string, unknown>> = {
  contexto: ContextoFormulario<T>;
  respuesta: Response;
  json: any;
};

type FormularioProps<T extends Record<string, unknown>> = Omit<
  JSX.IntrinsicElements["form"],
  "onSubmit" | "onError"
> & {
  onSuccess?: (props: HandlerEvent<T>) => any | Promise<any>;
  onError?: (props: HandlerEvent<T>) => any | Promise<any>;
  datos: T;
  rutaApi: string;
};

export const contextoFormulario =
  createContext<ContextoFormulario<Record<string, unknown>>>(undefined);

export default <T extends Record<string, unknown>>(
  props: FormularioProps<T>
) => {
  const estado = signal(""),
    datos = signal(props.datos),
    datosIniciales = useRef(props.datos),
    errores = signal(
      Object.fromEntries(Object.keys(props.datos).map((k) => [k, ""]))
    );

  const contexto = {
    datos,
    datosIniciales,
    errores,
    estado,
  };

  useSignalEffect(() => {
    console.log(datos.value);
  });

  return (
    <contextoFormulario.Provider value={contexto}>
      <form
        {...props}
        onError={undefined}
        onSubmit={async (e) => {
          e.preventDefault();
          estado.value = "subiendo";

          try {
            const respuesta = await fetch(
              // se adapta la url dependiendo de si se usa el servidor local o el de área local
              rutaApi(props.rutaApi),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datos.value),
              }
            );

            const json = await respuesta.json();

            if (respuesta.ok) {
              estado.value = "exito";

              if (props.onSuccess) {
                const _name = Object.prototype.toString.call(props.onSuccess);

                if (
                  "[object Promise]" === _name ||
                  "[object AsyncFunction]" === _name
                )
                  await props.onSuccess({ contexto, json, respuesta });
                else props.onSuccess({ contexto, json, respuesta });
              }
            } else {
              estado.value = "error";
              errores.value = {
                ...contexto.errores.value,
                [json.campo]: json.mensaje,
              };

              if (props.onError) {
                const _name = Object.prototype.toString.call(props.onError);

                if (
                  "[object Promise]" === _name ||
                  "[object AsyncFunction]" === _name
                )
                  await props.onError({ contexto, json, respuesta });
                else props.onError({ contexto, json, respuesta });
              }
            }
          } catch (e) {
            estado.value = "error";
            console.error(e);
          }
        }}
      >
        {props.children}
      </form>
    </contextoFormulario.Provider>
  );
};

export const Subir = (props: JSX.IntrinsicElements["button"]) => {
  const { estado } = useContext(contextoFormulario);

  return (
    <button
      {...props}
      class={`btn btn-primario ${props.class || ""}`}
      disabled={estado.value === "subiendo"}
      type="submit"
    >
      {props.children}
    </button>
  );
};

export const Reiniciar = (props: JSX.IntrinsicElements["button"]) => {
  const { estado, datos, datosIniciales } = useContext(contextoFormulario);

  return (
    <button
      {...props}
      class={`btn btn-secundario ${props.class || ""}`}
      disabled={estado.value === "subiendo"}
      type="reset"
      onClick={() => (datos.value = datosIniciales.current)}
    >
      {props.children}
    </button>
  );
};

export const MensajeExito = (props: { texto: string }) => {
  const { estado } = useContext(contextoFormulario);
  return (
    <Alerta
      variante="éxito"
      texto={props.texto}
      visible={estado.value === "exito"}
    />
  );
};

export const MensajeCarga = (props: { texto: string }) => {
  const { estado } = useContext(contextoFormulario);
  return (
    <Alerta
      variante="carga"
      texto={props.texto}
      visible={estado.value === "subiendo"}
    />
  );
};
