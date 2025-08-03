import type { DatosComunidad } from "~/tipos";
import type {
  FiltroId,
  FiltroKey,
  OrdenColumnas,
} from "~/tipos/lista-comunidad";
import useLocalStorage from "~/hooks/useLocalStorage";
import { signal } from "@preact/signals";
import { COLUMNAS_FILTRABLES, COLUMNAS_ORDENABLES } from "~/constantes";

export const datosComunidad = signal<DatosComunidad[]>([]);
export const cargarDatosComunidad = signal(true);
export const generandoCarta = signal(false);
export const modalGenerarAbierto = signal(false);
export const idARegistroSeleccionado = { current: -1 };
export const eliminandoMultiples = signal(false);

export const ordenColumnas = useLocalStorage<OrdenColumnas>({
  key: "orden-comunidad",
  default: ["rowid", "asc"],
  validacion: (v) =>
    Array.isArray(v) &&
    v.length === 2 &&
    COLUMNAS_ORDENABLES.includes(v[0]) &&
    (v[1] === "asc" || v[1] === "desc"),
});

export const configuracionFiltros = useLocalStorage({
  key: "filtros-comunidad",
  default: COLUMNAS_FILTRABLES.map((c) => [c, "contiene"]).reduce(
    (acc, c) => ({ ...acc, [c[0]]: c[1] }),
    // eslint-disable-next-line no-unused-vars
    {} as { [key in FiltroKey]: FiltroId<FiltroKey> }
  ),
  validacion: (v) => typeof v === "object" && Object.keys(v).length > 0,
});

export const OPCIONES_FILTROS = {
  comun: {
    contiene: "Contiene",
    "no-contiene": "No contiene",
    "igual-a": "Igual a",
    "diferente-de": "Diferente de",
    "empieza-con": "Comienza con",
    "no-empieza-con": "No comienza con",
    "termina-con": "Termina con",
    "no-termina-con": "No termina con",
  },
  get cedula() {
    return {
      ...(this.comun as (typeof OPCIONES_FILTROS)["comun"]),
      "mayor-a": "Mayor a",
      "menor-a": "Menor a",
    } as const;
  },
  get fecha_nacimiento() {
    return {
      ...(this.comun as (typeof OPCIONES_FILTROS)["comun"]),
      "antes-de": "Antes de",
      "despues-de": "Después de",
    } as const;
  },
  get edad() {
    return this.cedula as (typeof OPCIONES_FILTROS)["cedula"];
  },
} as const;
