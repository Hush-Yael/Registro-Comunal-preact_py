import type { DatosComunidad, OrdenColumnas } from "~/tipos";
import useLocalStorage from "~/hooks/useLocalStorage";
import { signal } from "@preact/signals";
import { COLUMNAS_ORDENABLES } from "~/utilidades/contantes";
import { rutaApi } from "~/utilidades";

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

export const eliminarRegistro = async (id: number) => {
  if (confirm("¿Realmente desea eliminar el registro?")) {
    const r = await fetch(rutaApi(`eliminar-registro-comunidad/${id}`), {
      method: "DELETE",
    });
    if (r.ok)
      datosComunidad.value = datosComunidad.value.filter((u) => u.id !== id);
  }
};
