import type { DatosComunidad } from "~/tipos";
import type { OrdenColumnas } from "~/tipos/lista-comunidad";
import useLocalStorage from "~/hooks/useLocalStorage";
import { signal } from "@preact/signals";
import { COLUMNAS_ORDENABLES } from "~/constantes";

export const datosComunidad = signal<DatosComunidad[]>([]);
export const cargarDatosComunidad = signal(true);
export const generandoCarta = signal(false);
export const modalGenerarAbierto = signal(false);

export const ordenColumnas = useLocalStorage<OrdenColumnas>({
  key: "orden-comunidad",
  default: [],
  validacion: (v) =>
    Array.isArray(v) &&
    v.length === 2 &&
    COLUMNAS_ORDENABLES.includes(v[0]) &&
    (v[1] === "asc" || v[1] === "desc"),
});
