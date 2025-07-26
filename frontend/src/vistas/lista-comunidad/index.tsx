import {
  getFilteredRowModel,
  getPaginationRowModel,
  type Table,
  type ColumnDef,
} from "@tanstack/react-table";
import { rutaApi } from "~/lib";
import Cabecera from "~/componentes/cabecera";
import Tabla from "~/componentes/tabla";
import { sesion } from "~/index";
import type { DatosComunidad } from "~/tipos";
import { useLocalStorageState } from "~/hooks/useLocalStorage";
import Iconos from "~/componentes/iconos";
import { Link } from "wouter-preact";
import Menu from "./menu";
import ModalGenerar from "./modal";
import { idAGenerar } from "./modal";
import {
  cargarDatosComunidad,
  datosComunidad,
  generandoCarta,
  modalGenerarAbierto,
  ordenColumnas,
  configuracionFiltros,
} from "~/constantes/lista-comunidad";
import { funcionFiltro } from "~/lib/filtros";
import { FiltroId } from "~/tipos/lista-comunidad";

export default () => {
  const [paginacion, setPaginacion] = useLocalStorageState({
    key: "paginacion-comunidad",
    default: {
      pageIndex: 0,
      pageSize: 10,
    },
    validacion: (val) =>
      typeof val === "object" &&
      Number.isInteger(val.pageIndex) &&
      val.pageIndex >= 0 &&
      Number.isInteger(val.pageSize) &&
      val.pageSize >= 10,
  });

  const columnas: ColumnDef<DatosComunidad>[] = [
    { header: "#", accessorKey: "id", size: 5, enableColumnFilter: false },
    {
      header: "Nombres y apellidos",
      accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
      size: 225,
      filterFn: funcionFiltro,
    },
    {
      header: "Cédula",
      id: "cedula",
      accessorFn: (row) =>
        row.cedula ? row.cedula.toLocaleString("es-VE") : "",
      maxSize: 125,
      meta: { filterInputValuePattern: /\d|\./ },
      filterFn: funcionFiltro,
    },
    {
      header: "F. nacimiento",
      accessorKey: "fecha_nacimiento",
      size: 50,
      minSize: 0,
      meta: {
        filterInputValuePattern: /\d|-/,
        filterVariant: (
          [
            "igual-a",
            "diferente-de",
            "antes-de",
            "despues-de",
          ] as FiltroId<"fecha_nacimiento">[]
        )
          // @ts-expect-error: el tipo del valor es correcto
          .includes(configuracionFiltros.value["fecha_nacimiento"])
          ? "date"
          : undefined,
      },
      filterFn: funcionFiltro,
    },
    {
      header: "Edad",
      accessorKey: "edad",
      size: 25,
      minSize: 0,
      meta: { filterInputValuePattern: /\d/, filterVariant: "number" },
      filterFn: funcionFiltro,
    },
    {
      header: "Patología / condición",
      accessorKey: "patologia",
      size: 15,
    },
    {
      header: "Dirección",
      accessorKey: "direccion",
      size: 100,
      filterFn: funcionFiltro,
    },
    {
      header: "N° casa",
      accessorKey: "numero_casa",
      size: 30,
      minSize: 0,
      meta: { filterInputValuePattern: /[\d-_\s/]/ },
      filterFn: funcionFiltro,
    },
    ...(sesion.value.rol === "admin"
      ? [
          {
            header: "Acciones",
            size: 20,
            cell: (info) => (
              <div role="group" class="flex gap-1 *:p-1! [&_svg]:size-4!">
                <Link
                  href={`/?editar=${info.row.original.id}`}
                  class="btn btn-primario"
                >
                  <Iconos.Editar />
                </Link>
                <button
                  class="btn btn-borde"
                  disabled={generandoCarta.value}
                  onClick={() => {
                    idAGenerar.current = info.row.original.id;
                    modalGenerarAbierto.value = true;
                  }}
                >
                  <Iconos.Documento />
                </button>
                <button
                  onClick={() => eliminarRegistro(info.row.original.id)}
                  class="btn btn-peligro"
                >
                  <Iconos.Eliminar />
                </button>
              </div>
            ),
          } as ColumnDef<DatosComunidad>,
        ]
      : []),
  ];

  return (
    <>
      <ModalGenerar />
      <Tabla
        class="h-[60vh] w-[500px] [&_td]:first:text-right [&_th]:first:text-right [&_td]:nth-3:text-right [&_th]:nth-3:text-right [&_td]:nth-4:text-right [&_th]:nth-4:text-right [&_td]:nth-5:text-right [&_th]:nth-5:text-right [&_td]:nth-8:text-right [&_th]:nth-8:text-right"
        wrapperClass="mt-6"
        datos={datosComunidad}
        header={(tabla: Table<DatosComunidad>) => (
          <Cabecera titulo="Lista de registros de la comunidad">
            <Menu tabla={tabla} />
          </Cabecera>
        )}
        options={{
          getPaginationRowModel: getPaginationRowModel(),
          state: {
            pagination: paginacion,
          },
          onPaginationChange: setPaginacion,
          getFilteredRowModel: getFilteredRowModel(),
        }}
        columnas={columnas}
        apodoFilas="registros"
        datosDebenCargar={cargarDatosComunidad}
        obtencionDatos={() =>
          fetch(rutaApi("lista-comunidad"), {
            method: "POST",
            body: JSON.stringify(ordenColumnas.value),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((r) => r.json()) as Promise<DatosComunidad[]>
        }
      />
    </>
  );
};

export const eliminarRegistro = async (id: number) => {
  if (confirm("¿Realmente desea eliminar el registro?")) {
    const r = await fetch(rutaApi(`eliminar-registro-comunidad/${id}`), {
      method: "DELETE",
    });
    if (r.ok)
      datosComunidad.value = datosComunidad.value.filter((u) => u.id !== id);
  }
};
