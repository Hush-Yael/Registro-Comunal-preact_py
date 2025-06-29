import {
  getFilteredRowModel,
  getPaginationRowModel,
  type Table,
  type ColumnDef,
} from "@tanstack/react-table";
import { rutaApi } from "../../utilidades";
import Cabecera from "../componentes/cabecera";
import Tabla from "../componentes/tabla";
import { sesion } from "..";
import { DatosComunidad } from "../tipos";
import useLocalStorage from "../hooks/useLocalStorage";
import Iconos from "../componentes/iconos";
import type { Signal } from "@preact/signals";
import { Link } from "wouter-preact";

const datos = signal<DatosComunidad[]>([]);

export default () => {
  const [paginacion, setPaginacion] = useLocalStorage({
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
    { header: "#", cell: (info) => info.row.index + 1, size: 5 },
    {
      header: "Nombres y apellidos",
      accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
      size: 225,
    },
    {
      header: "Cédula",
      accessorKey: "cedula",
      maxSize: 125,
      meta: { filterVariant: "number" },
    },
    {
      header: "F. nacimiento",
      accessorKey: "fecha_nacimiento",
      size: 50,
      minSize: 0,
      meta: { filterInputValuePattern: /\d|\// },
    },
    {
      header: "Patología / condición",
      accessorKey: "patologia",
      size: 15,
    },
    { header: "Dirección", accessorKey: "direccion", size: 25 },
    {
      header: "N° casa",
      accessorKey: "numero_casa",
      size: 30,
      minSize: 0,
      meta: { filterInputValuePattern: /\d|-/ },
    },
    ...(sesion.value.rol === "admin"
      ? [
          {
            header: "Acciones",
            size: 10,
            cell: (info) => (
              <fieldset class="flex gap-1">
                <Link
                  href={`/?editar=${info.row.original.id}`}
                  class="btn btn-primario"
                >
                  <Iconos.Editar />
                </Link>
                <button
                  onClick={() => eliminarRegistro(info.row.original.id)}
                  class="btn btn-peligro"
                >
                  <Iconos.Eliminar />
                </button>
              </fieldset>
            ),
          } as ColumnDef<DatosComunidad>,
        ]
      : []),
  ];

  return (
    <Tabla
      class="h-full w-[500px] [&_td]:nth-3:text-right [&_td]:nth-4:text-right [&_td]:nth-7:text-right"
      wrapperClass="h-[60vh] mt-6"
      datos={datos}
      header={(tabla: Table<DatosComunidad>) => (
        <Cabecera titulo="Lista de registros de la comunidad">
          <button
            class="btn btn-secundario"
            // @ts-expect-error: no importa
            onClick={tabla.resetColumnFilters}
          >
            <Iconos.Borrar class="size-6" />
            Limpiar filtros
          </button>
        </Cabecera>
      )}
      filasNombre="registros"
      options={{
        getPaginationRowModel: getPaginationRowModel(),
        state: {
          pagination: paginacion,
        },
        globalFilterFn: "includesString",
        onPaginationChange: setPaginacion,
        getFilteredRowModel: getFilteredRowModel(),
      }}
      columnas={columnas}
      fetchValues={() =>
        fetch(rutaApi("lista-comunidad")).then((r) => r.json()) as Promise<
          DatosComunidad[]
        >
      }
    />
  );
};

const eliminarRegistro = async (id: number) => {
  if (confirm("¿Realmente desea eliminar el registro?")) {
    const r = await fetch(rutaApi(`eliminar-registro-comunidad/${id}`), {
      method: "DELETE",
    });
    if (r.ok) datos.value = datos.value.filter((u) => u.id !== id);
  }
};
