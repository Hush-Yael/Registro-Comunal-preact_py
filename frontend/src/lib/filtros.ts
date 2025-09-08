import type { RowData, Row } from "@tanstack/react-table";
import {
  añosDesdeFecha,
  comparacionInsensitiva,
  normalizarString,
} from "~/lib";
import {
  COLUMNAS_NUMEROS,
  configuracionFiltros,
} from "~/constantes/lista-comunidad";
import type { FiltroId, FiltroKey } from "~/tipos/lista-comunidad";

const busquedaMayorOMenor = (
  columna: FiltroKey,
  valorActual: string,
  valorBuscado: string,
  mayor = true
) => {
  if (columna === "fecha_nacimiento") {
    const edad = añosDesdeFecha(valorActual),
      edadBusqueda = Number.parseInt(valorBuscado);

    if (!edad || isNaN(edadBusqueda) || edadBusqueda < 0) return false;

    return mayor ? edad > edadBusqueda : edad < edadBusqueda;
  }

  const numActual = Number.parseInt(
      columna === "cedula" ? valorActual.replace(/\./g, "") : valorActual
    ),
    numBusqueda = Number.parseInt(
      columna === "cedula" ? valorBuscado.replace(/\./g, "") : valorBuscado
    );

  return mayor ? numActual > numBusqueda : numActual < numBusqueda;
};

const busquedaAntesODespues = (
  valorActual: string,
  valorBuscado: string,
  antes?: boolean
) => {
  const fechaBusqueda = new Date(valorBuscado.trim()),
    fechaActual = new Date(valorActual);

  if (
    fechaBusqueda.toString() === "Invalid Date" ||
    fechaBusqueda.toString() === "Invalid Date"
  )
    return false;

  return antes ? fechaActual < fechaBusqueda : fechaActual > fechaBusqueda;
};

const busquedaContiene = (
  columna: FiltroKey,
  valorActual: string,
  valorBuscado: string
) => {
  if (columna === "cedula")
    return valorActual
      .replace(/\./g, "")
      .includes(valorBuscado.replace(/\./g, ""));
  else if (COLUMNAS_NUMEROS.includes(columna))
    return valorActual.trim().includes(valorBuscado.trim());

  return comparacionInsensitiva(valorActual, valorBuscado);
};

const busquedaEmpiezaOTerminaCon = (
  columna: FiltroKey,
  valorActual: string,
  valorBuscado: string,
  empieza: boolean
) => {
  const fn = empieza ? "startsWith" : "endsWith";

  if (columna === "cedula")
    return valorActual.replace(/\./g, "")[fn](valorBuscado.replace(/\./g, ""));
  else if (COLUMNAS_NUMEROS.includes(columna))
    return valorActual.trim()[fn](valorBuscado.trim());

  return comparacionInsensitiva(valorActual, valorBuscado, fn);
};

// es semi exacta porque se ignoran los espacios y los acentos
const busquedaSemiExacta = (
  columna: FiltroKey,
  valorActual: string,
  valorBuscado: string,
) => {
  if (columna === "cedula")
    return (
      Number.parseInt(valorActual.replace(/\./g, "")) ===
      Number.parseInt(valorBusqueda.replace(/\./g, ""))
    );
  else if (COLUMNAS_NUMEROS.includes(columna))
    return valorActual.trim() === valorBusqueda.trim();

  return normalizarString(valorActual) === normalizarString(valorBusqueda);
};

export const funcionFiltro = <T extends RowData>(
  fila: Row<T>,
  idColumna: FiltroKey,
  valorBuscado: string
) => {
  const valorFilaActual: string = fila.getValue(idColumna);
  if (!valorFilaActual) return false;

  switch (configuracionFiltros.value[idColumna]) {
    case "contiene": {
      return busquedaContiene(idColumna, valorFilaActual, valorBusqueda);
    }

    case "no-contiene": {
      return !busquedaContiene(idColumna, valorFilaActual, valorBusqueda);
    }

    case "igual-a": {
      return busquedaIgualA(idColumna, valorFilaActual, valorBusqueda);
    }

    case "diferente-de": {
      return !busquedaIgualA(idColumna, valorFilaActual, valorBusqueda);
    }

    case "mayor-a": {
      return busquedaMayorOMenor(idColumna, valorFilaActual, valorBusqueda);
    }

    case "menor-a": {
      return busquedaMayorOMenor(
        idColumna,
        valorFilaActual,
        valorBusqueda,
        false
      );
    }

    case "despues-de": {
      return busquedaAntesODespues(valorFilaActual, valorBusqueda, false);
    }

    case "antes-de": {
      return busquedaAntesODespues(valorFilaActual, valorBusqueda, true);
    }

    case "empieza-con": {
      return busquedaEmpiezaOTerminaCon(
        idColumna,
        valorFilaActual,
        valorBusqueda,
        true
      );
    }

    case "no-empieza-con": {
      return !busquedaEmpiezaOTerminaCon(
        idColumna,
        valorFilaActual,
        valorBusqueda,
        true
      );
    }

    case "termina-con": {
      return busquedaEmpiezaOTerminaCon(
        idColumna,
        valorFilaActual,
        valorBusqueda,
        false
      );
    }

    case "no-termina-con": {
      return !busquedaEmpiezaOTerminaCon(
        idColumna,
        valorFilaActual,
        valorBusqueda,
        false
      );
    }

    default:
      throw new Error("Función de filtro no implementada o no encontrada");
  }
};
