import { expect, test } from "vitest";
import { filtrarFila } from "~/lib/filtros";
import { FiltroId, FiltroKey } from "~/tipos/lista-comunidad";

type Valores = { filaActual: string; buscado: string; retorna: boolean }[];

type V<Columna extends FiltroKey> = Record<
  Columna,
  Record<FiltroId<Columna>, Valores>
>;

const getInverso = (filtro: FiltroId<FiltroKey>) => {
  if (filtro === "igual-a") return "diferente-de";
  else if (filtro === "mayor-a") return "menor-a";
  else if (filtro === "despues-de") return "antes-de";
  else return "no-" + filtro;
};

const conInverso = (
  filtro: FiltroId<FiltroKey>,
  v: Valores
): {
  // eslint-disable-next-line no-unused-vars
  [k in FiltroId<FiltroKey>]: Valores;
} =>
  ({
    [filtro]: v,
    [getInverso(filtro)]: v.map((v) => ({
      ...v,
      retorna: !v.retorna,
    })) as Valores,
  } as any);

const valoresBúsqueda: V<FiltroKey> = {
  "Nombres y apellidos": {
    ...conInverso("igual-a", [
      {
        filaActual: " hóla",
        buscado: "holá  ",
        retorna: true,
      },
      {
        filaActual: " hola",
        buscado: "holaa  ",
        retorna: false,
      },
    ]),
    ...conInverso("contiene", [
      {
        filaActual: "pedro",
        buscado: "ro",
        retorna: true,
      },
      {
        filaActual: "pedro",
        buscado: "tedro",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: "maría",
        buscado: "mari",
        retorna: true,
      },
      {
        filaActual: "maría",
        buscado: "maaria",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: "maría",
        buscado: "ria",
        retorna: true,
      },
      {
        filaActual: "maría",
        buscado: "arria",
        retorna: false,
      },
    ]),
  },
  cedula: {
    ...conInverso("contiene", [
      {
        filaActual: "12.3",
        buscado: "1.2.3",
        retorna: true,
      },
      {
        filaActual: "12.3 ",
        buscado: "123.4  ",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      {
        filaActual: "12.3",
        buscado: "1.2.3",
        retorna: true,
      },
      {
        filaActual: "12.3",
        buscado: "123.4  ",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: "12.3",
        buscado: "1.2.",
        retorna: true,
      },
      {
        filaActual: "12.3",
        buscado: "14.2  ",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: "12.3",
        buscado: "23",
        retorna: true,
      },
      {
        filaActual: "12.3",
        buscado: "14  ",
        retorna: false,
      },
    ]),
    ...conInverso("mayor-a", [
      {
        filaActual: "10.001",
        buscado: "10.000",
        retorna: true,
      },
      {
        filaActual: "10.000",
        buscado: "10.001 ",
        retorna: false,
      },
    ]),
  },
  edad: {
    ...conInverso("contiene", [
      {
        filaActual: "12",
        buscado: "1",
        retorna: true,
      },
      {
        filaActual: "12",
        buscado: "3",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      { filaActual: " 123", buscado: "123  ", retorna: true },
      {
        filaActual: "23",
        buscado: "4",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: "123",
        buscado: "12",
        retorna: true,
      },
      {
        filaActual: "24",
        buscado: "1",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: "123",
        buscado: "23",
        retorna: true,
      },
      {
        filaActual: "24",
        buscado: "3",
        retorna: false,
      },
    ]),
    ...conInverso("mayor-a", [
      {
        filaActual: "12",
        buscado: "10",
        retorna: true,
      },
      {
        filaActual: "12",
        buscado: "13",
        retorna: false,
      },
    ]),
  },
  patologia: {
    ...conInverso("contiene", [
      {
        filaActual: " asperger",
        buscado: "er",
        retorna: true,
      },
      {
        filaActual: " asperger",
        buscado: "eer",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      {
        filaActual: " asperger",
        buscado: " ásperger ",
        retorna: true,
      },
      {
        filaActual: " asperger",
        buscado: " aspergeer ",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: " asperger",
        buscado: "as",
        retorna: true,
      },
      {
        filaActual: " asperger",
        buscado: "asip",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: " asperger",
        buscado: "er",
        retorna: true,
      },
      {
        filaActual: " asperger",
        buscado: "eer",
        retorna: false,
      },
    ]),
  },
  direccion: {
    ...conInverso("contiene", [
      {
        filaActual: " 123a",
        buscado: "a  ",
        retorna: true,
      },
      {
        filaActual: " 123a",
        buscado: "23b  ",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      {
        filaActual: " 123a",
        buscado: "123á  ",
        retorna: true,
      },
      {
        filaActual: " 123a",
        buscado: "123b  ",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: "1-2-3",
        buscado: "1-2",
        retorna: true,
      },
      {
        filaActual: "1-2-3",
        buscado: "1- 2",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: " 123a",
        buscado: "a",
        retorna: true,
      },
      {
        filaActual: " 123a",
        buscado: "b",
        retorna: false,
      },
    ]),
  },
  numero_casa: {
    ...conInverso("contiene", [
      {
        filaActual: " 12-3",
        buscado: "12-  ",
        retorna: true,
      },
      {
        filaActual: " 12-3",
        buscado: "12- 3  ",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      {
        filaActual: " 123",
        buscado: "123  ",
        retorna: true,
      },
      {
        filaActual: " 123",
        buscado: "124  ",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: " 123",
        buscado: "12",
        retorna: true,
      },
      {
        filaActual: " 123",
        buscado: "1-2",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: " 123",
        buscado: "3",
        retorna: true,
      },
      {
        filaActual: " 123",
        buscado: "-3",
        retorna: false,
      },
    ]),
  },
  fecha_nacimiento: {
    ...conInverso("contiene", [
      {
        filaActual: "2020-01-01",
        buscado: "2020",
        retorna: true,
      },
      {
        filaActual: "2020-01-01",
        buscado: "2021",
        retorna: false,
      },
    ]),
    ...conInverso("igual-a", [
      {
        filaActual: "2020-01-01",
        buscado: "2020-01-01",
        retorna: true,
      },
      {
        filaActual: "2020-01-01",
        buscado: "2021-01-01",
        retorna: false,
      },
    ]),
    ...conInverso("empieza-con", [
      {
        filaActual: "2020-01-01",
        buscado: "2020",
        retorna: true,
      },
      {
        filaActual: "2020-01-01",
        buscado: "2021",
        retorna: false,
      },
    ]),
    ...conInverso("termina-con", [
      {
        filaActual: "2020-01-01",
        buscado: "01",
        retorna: true,
      },
      {
        filaActual: "2020-01-01",
        buscado: "02",
        retorna: false,
      },
    ]),
    ...conInverso("despues-de", [
      { filaActual: "2021-01-01", buscado: "2020-01-02", retorna: true },
      { filaActual: "2021-01-01", buscado: "2021-01-02", retorna: false },
    ]),
  },
} as const;

Object.entries(valoresBúsqueda).forEach(
  ([columna, filtros]: [FiltroKey, Record<FiltroId<FiltroKey>, Valores>]) => {
    Object.entries(filtros).forEach(
      ([filtro, listaValores]: [FiltroId<FiltroKey>, Valores]) => {
        listaValores.forEach((valores) => {
          test(`[${columna} | ${filtro}]: Verifica que el resultado sea ${
            valores.retorna === false ? "in" : ""
          }correcto`, () => {
            const { filaActual, buscado, retorna } = valores;
            expect(filtrarFila({ buscado, filaActual }, columna, filtro)).toBe(
              retorna
            );
          });
        });
      }
    );
  }
);
