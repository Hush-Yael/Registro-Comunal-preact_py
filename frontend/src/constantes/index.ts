import { DatosComunidad } from "~/tipos";
import type { FiltroKey, OrdenKey } from "~/tipos/lista-comunidad";

export const NOMBRE_MÍNIMO = 3;
export const CONTRASEÑA_MÍNIMA = 5;

export const COLUMNAS: (keyof DatosComunidad)[] = [
  "id",
  "nombres",
  "apellidos",
  "cedula",
  "fecha_nacimiento",
  "edad",
  "patologia",
  "direccion",
  "numero_casa",
];

export const COLUMNAS_FILTRABLES: FiltroKey[] = [
  "Nombres y apellidos",
  "cedula",
  "edad",
  "patologia",
  "direccion",
  "fecha_nacimiento",
  "numero_casa",
];

export const COLUMNAS_ORDENABLES: OrdenKey[] = [
  ...COLUMNAS.filter((c) => c !== "id"),
  "rowid",
  "editado",
] as const;
