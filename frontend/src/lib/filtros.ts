import { RowData, Row } from "@tanstack/react-table";
import { añosDesdeFecha, comparacionInsensitiva } from "~/lib";
import { COLUMNAS_FILTRABLES } from "~/constantes";
import { configuracionFiltros } from "~/constantes/lista-comunidad";

const busquedaMayor = (
  columna: (typeof COLUMNAS_FILTRABLES)[number],
  valorActual: string,
  valorBusqueda: string
) => {
  if (columna === "fecha_nacimiento") {
    const edad = añosDesdeFecha(valorActual),
      edadBusqueda = Number.parseInt(valorBusqueda);

    if (!edad || isNaN(edadBusqueda) || edadBusqueda < 0) return false;

    return edad > edadBusqueda;
  }

  return (
    Number.parseInt(
      columna === "cedula" ? valorActual.replace(/\./g, "") : valorActual
    ) >
    Number.parseInt(
      columna === "cedula" ? valorBusqueda.replace(/\./g, "") : valorBusqueda
    )
  );
};

const busquedaAntesODespues = (
  valorActual: string,
  valorBusqueda: string,
  antes?: boolean
) => {
  const fechaBusqueda = new Date(valorBusqueda.trim()),
    fechaActual = new Date(valorActual);

  if (
    fechaBusqueda.toString() === "Invalid Date" ||
    fechaBusqueda.toString() === "Invalid Date"
  )
    return false;

  return antes ? fechaActual < fechaBusqueda : fechaActual > fechaBusqueda;
};

const busquedaContiene = (
  columna: (typeof COLUMNAS_FILTRABLES)[number],
  valorActual: string,
  valorBusqueda: string
) => {
  if (columna === "cedula")
    return valorActual
      .replace(/\./g, "")
      .includes(valorBusqueda.replace(/\./g, ""));
  else if (columna !== "Nombres y apellidos")
    return valorActual.includes(valorBusqueda);

  return comparacionInsensitiva(valorActual, valorBusqueda);
};

const busquedaEmpiezaOTerminaCon = (
  columna: (typeof COLUMNAS_FILTRABLES)[number],
  valorActual: string,
  valorBusqueda: string,
  empieza: boolean
) => {
  const fn = empieza ? "startsWith" : "endsWith";

  if (columna === "cedula")
    return valorActual.replace(/\./g, "")[fn](valorBusqueda.replace(/\./g, ""));
  else if (columna !== "Nombres y apellidos")
    return valorActual[fn](valorBusqueda);

  return comparacionInsensitiva(valorActual, valorBusqueda);
};

const busquedaIgualA = (
  columna: (typeof COLUMNAS_FILTRABLES)[number],
  valorActual: string,
  valorBusqueda: string
) => {
  if (columna === "cedula")
    return (
      Number.parseInt(valorActual.replace(/\./g, "")) ===
      Number.parseInt(valorBusqueda.replace(/\./g, ""))
    );

  return valorActual === valorBusqueda;
};

export const funcionFiltro = <T extends RowData>(
  fila: Row<T>,
  idColumna: (typeof COLUMNAS_FILTRABLES)[number],
  valorBusqueda: string
) => {
  const valorFilaActual: string = fila.getValue(idColumna);

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
      return busquedaMayor(idColumna, valorFilaActual, valorBusqueda);
    }

    case "menor-a": {
      return !busquedaMayor(idColumna, valorFilaActual, valorBusqueda);
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
