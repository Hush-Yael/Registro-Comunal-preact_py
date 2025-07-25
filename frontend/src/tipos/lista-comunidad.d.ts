import { OPCIONES_FILTROS } from "~/constantes/lista-comunidad";
import { DatosComunidad } from ".";

export type FiltroKey =
  | Exclude<
      keyof DatosComunidad,
      "nombres" | "apellidos" | "id" | "patologia" | "direccion"
    >
  | "Nombres y apellidos";

export type FiltroId<ColumnaId extends FiltroKey> =
  ColumnaId extends keyof typeof OPCIONES_FILTROS
    ? keyof (typeof OPCIONES_FILTROS)[ColumnaId]
    : keyof (typeof OPCIONES_FILTROS)["comun"];

export type OrdenKey = keyof DatosComunidad | "editado" | "rowid";

export type OrdenColumnas = [] | [OrdenKey, "asc" | "desc"];
