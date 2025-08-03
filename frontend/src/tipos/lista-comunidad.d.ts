import { OPCIONES_FILTROS } from "~/constantes/lista-comunidad";
import { DatosComunidad } from ".";

export type FiltroKey =
  | Exclude<keyof DatosComunidad, "nombres" | "apellidos" | "id" | "patologia">
  | "Nombres y apellidos";

export type FiltroId<ColumnaId extends FiltroKey> =
  ColumnaId extends keyof typeof OPCIONES_FILTROS
    ? keyof (typeof OPCIONES_FILTROS)[ColumnaId]
    : keyof (typeof OPCIONES_FILTROS)["comun"];

export type OrdenKey =
  | Exclude<keyof DatosComunidad, "id">
  | "editado"
  | "rowid";

export type OrdenColumnas = [] | [OrdenKey, "asc" | "desc"];
