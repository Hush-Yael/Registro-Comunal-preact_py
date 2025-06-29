import type { JSX } from "preact/jsx-runtime";
import { createContext } from "preact";
import { useRef, MutableRef, useEffect } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
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

type WithFetch<T extends Record<string, unknown>> = FormularioProps<
  T,
  () => Promise<Response>
>;

type FormEstado = "subiendo" | "exito" | "error" | "fetching" | "";

type FormularioProps<
  T extends Record<string, unknown>,
  F extends (() => Promise<Response>) | undefined = undefined
> = Omit<JSX.IntrinsicElements["form"], "onSubmit" | "onError"> & {
  /*eslint-disable-next-line no-unused-vars*/
  onSuccess?: (props: HandlerEvent<T>) => any | Promise<any>;
  /*eslint-disable-next-line no-unused-vars*/
  onError?: (props: HandlerEvent<T>) => any | Promise<any>;
  method?: string;
  datos: T;
  rutaApi: string;
  fetchValues?: F;
} & (F extends undefined
    ? {}
    : {
        /*eslint-disable-next-line no-unused-vars*/
        onFetchSuccess: (json: any, contexto: ContextoFormulario<T>) => any;
        onFetchError?: (
          /*eslint-disable-next-line no-unused-vars*/
          error: Error,
          /*eslint-disable-next-line no-unused-vars*/
          contexto: ContextoFormulario<T>
        ) => any | Promise<any>;
      });

export const contextoFormulario =
  createContext<ContextoFormulario<Record<string, unknown>>>(undefined);

export default <
  T extends Record<string, unknown>,
  F extends (() => Promise<Response>) | undefined = undefined
>(
  props: FormularioProps<T, F>
) => {
  const estado = useSignal<FormEstado>(props.fetchValues ? "fetching" : ""),
    datos = useSignal(props.datos),
    datosIniciales = useRef(props.datos),
    errores = useSignal(
      Object.fromEntries(Object.keys(props.datos).map((k) => [k, ""]))
    );

  const contexto = {
    datos,
    datosIniciales,
    errores,
    estado,
  };

  useEffect(() => {
    if (props.fetchValues)
      props
        .fetchValues()
        .then((r) => (props as WithFetch<T>).onFetchSuccess(r, contexto))
        .catch(
          (props as WithFetch<T>).onFetchError
            ? (e) => (props as WithFetch<T>).onFetchError(e, contexto)
            : console.error
        )
        .finally(() => (estado.value = ""));
  }, []);

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
                method: props.method || "POST",
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
      disabled={estado.value === "subiendo" || estado.value === "fetching"}
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
      disabled={estado.value === "subiendo" || estado.value === "fetching"}
      type="reset"
      onClick={(e) => {
        datos.value = datosIniciales.current;
        estado.value = "";
        props.onClick && props.onClick(e);
      }}
    >
      {props.children}
    </button>
  );
};

export const Mensaje = (props: { estado: FormEstado; texto: string }) => {
  const { estado } = useContext(contextoFormulario);
  const variante =
    props.estado === "subiendo" || props.estado === "fetching"
      ? "carga"
      : props.estado === "exito"
      ? "éxito"
      : "";

  return (
    <Alerta
      variante={variante}
      texto={props.texto}
      visible={estado.value === props.estado}
    />
  );
};
