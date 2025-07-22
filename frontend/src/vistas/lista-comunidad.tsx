import {
  getFilteredRowModel,
  getPaginationRowModel,
  type Table,
  type ColumnDef,
} from "@tanstack/react-table";
import { rutaApi } from "~/utilidades";
import Cabecera from "~/componentes/cabecera";
import Tabla from "~/componentes/tabla";
import { sesion } from "~/index";
import { DatosComunidad } from "../tipos";
import useLocalStorage from "~/hooks/useLocalStorage";
import Iconos from "~/componentes/iconos";
import { signal } from "@preact/signals";
import { Link } from "wouter-preact";
import Menu from "./lista-comunidad/menu";
import ModalGenerar from "./lista-comunidad/modal";
import { idAGenerar } from "./lista-comunidad/modal";

export const datosComunidad = signal<DatosComunidad[]>([]);
export const cargarDatosComunidad = signal(true);
export const generandoCarta = signal(false);
export const modalGenerarAbierto = signal(false);

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
    { header: "#", accessorKey: "id", size: 5 },
    {
      header: "Nombres y apellidos",
      accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
      size: 225,
    },
    {
      header: "Cédula",
      accessorFn: (row) =>
        row.cedula ? row.cedula.toLocaleString("es-VE") : "",
      maxSize: 125,
      meta: { filterInputValuePattern: /\d|\./ },
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
    { header: "Dirección", accessorKey: "direccion", size: 100 },
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
        class={`${
          cargarDatosComunidad.value ? "h-full" : "max-h-full"
        } w-[500px] [&_td]:nth-3:text-right [&_td]:nth-4:text-right [&_td]:nth-7:text-right`}
        wrapperClass="mt-6"
        datos={datosComunidad}
        header={(tabla: Table<DatosComunidad>) => (
          <Cabecera titulo="Lista de registros de la comunidad">
            <Menu tabla={tabla} />
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
        shouldFetch={cargarDatosComunidad}
        valuesFetcher={() =>
          fetch(rutaApi("lista-comunidad")).then((r) => r.json()) as Promise<
            DatosComunidad[]
          >
        }
      />
    </>
  );
};

const eliminarRegistro = async (id: number) => {
  if (confirm("¿Realmente desea eliminar el registro?")) {
    const r = await fetch(rutaApi(`eliminar-registro-comunidad/${id}`), {
      method: "DELETE",
    });
    if (r.ok)
      datosComunidad.value = datosComunidad.value.filter((u) => u.id !== id);
  }
};
