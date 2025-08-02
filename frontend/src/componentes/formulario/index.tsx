import type { JSX } from "preact/jsx-runtime";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { rutaApi } from "~/lib";

export type ContextoFormulario<T extends Record<string, unknown>> = {
  datos: Signal<T>;
  datosIniciales: T;
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
  onSubmit?: () => any;
  // eslint-disable-next-line no-unused-vars
  finally?: (contexto: HandlerEvent<T>["contexto"]) => any;
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (props: HandlerEvent<T>) => any;
  // eslint-disable-next-line no-unused-vars
  onError?: (contexto: HandlerEvent<T>["contexto"]) => any;
  // eslint-disable-next-line no-unused-vars
  onBadRequest?: (props: HandlerEvent<T>) => any;
  // eslint-disable-next-line no-unused-vars
  modificarValoresEnviados?: (values: T) => T;
  method?: string;
  datos: Signal<T>;
  datosIniciales?: T;
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
    datos = props.datos,
    errores = useSignal(
      Object.fromEntries(Object.keys(props.datos).map((k) => [k, ""]))
    );

  const contexto: ContextoFormulario<T> = {
    datos,
    datosIniciales: props.datosIniciales || { ...props.datos.value },
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
          if (props.onSubmit) props.onSubmit();

          try {
            const respuesta = await fetch(
              // se adapta la url dependiendo de si se usa el servidor local o el de área local
              rutaApi(props.rutaApi),
              {
                method: props.method || "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(
                  props.modificarValoresEnviados
                    ? props.modificarValoresEnviados(datos.value)
                    : datos.value
                ),
              }
            );

            const json = await respuesta.json();

            if (respuesta.ok) {
              estado.value = "exito";

              props.onSuccess && props.onSuccess({ contexto, json, respuesta });
            } else {
              estado.value = "error";
              errores.value = {
                ...contexto.errores.value,
                [json.campo]: json.mensaje,
              };

              props.onBadRequest &&
                props.onBadRequest({ contexto, json, respuesta });
            }
          } catch (e) {
            estado.value = "error";
            console.error(e);
            props.onError && props.onError(contexto);
          } finally {
            props.finally && props.finally(contexto);
          }
        }}
        // @ts-expect-error: no se debe pasar
        datos={null}
        rutaApi={null}
        datosIniciales={null}
        finally={null}
        onBadRequest={null}
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
        datos.value = datosIniciales;
        estado.value = "";
        props.onClick && props.onClick(e);
      }}
    >
      {props.children}
    </button>
  );
};
