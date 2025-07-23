import type { DatosComunidad, OrdenKey } from "~/tipos";

export const NOMBRE_MÍNIMO = 3;
export const CONTRASEÑA_MÍNIMA = 5;

export const COLUMNAS: (keyof DatosComunidad)[] = [
  "id",
  "nombres",
  "apellidos",
  "cedula",
  "fecha_nacimiento",
  "patologia",
  "direccion",
  "numero_casa",
];

export const COLUMNAS_ORDENABLES: OrdenKey[] = [
  "rowid",
  "nombres",
  "apellidos",
  "cedula",
  "fecha_nacimiento",
  "numero_casa",
  "editado",
];
