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
import { signal } from "@preact/signals";
import { Link } from "wouter-preact";

export const datosComunidad = signal<DatosComunidad[]>([]);
const cargar = signal(true);

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
      accessorFn: (row) => row.cedula.toLocaleString("es-VE"),
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
      class={`${
        cargar.value ? "h-full" : "max-h-full"
      } w-[500px] [&_td]:nth-3:text-right [&_td]:nth-4:text-right [&_td]:nth-7:text-right`}
      wrapperClass="h-[60vh] mt-6"
      datos={datosComunidad}
      header={(tabla: Table<DatosComunidad>) => (
        <Cabecera titulo="Lista de registros de la comunidad">
          <fieldset class="flex items-center gap-3 pr-1 *:p-1! [&_svg]:size-4.5!">
            <button
              class="btn btn-secundario col-span-2 m-auto"
              // @ts-expect-error: no importa
              onClick={tabla.resetColumnFilters}
              title="Limpiar filtros"
            >
              <Iconos.LimpiarFiltros />
            </button>
            <button
              onClick={exportar}
              disabled={_portando.value}
              class="btn btn-primario"
              title="Exportar datos"
            >
              <Iconos.Exportar />
            </button>
            <input
              class="peer/input sr-only"
              onChange={importar}
              disabled={sesion.value.rol !== "admin" || _portando.value}
              type="file"
              accept=".csv"
              id="exportar"
            />
            <label
              class="btn btn-primario"
              htmlFor="exportar"
              title="Importar datos"
            >
              <Iconos.Importar />
            </label>
          </fieldset>
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
      shouldFetch={cargar}
      valuesFetcher={() =>
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
    if (r.ok)
      datosComunidad.value = datosComunidad.value.filter((u) => u.id !== id);
  }
};

const _portando = signal(false);

const importar = async (e: Event) => {
  if (sesion.value.rol !== "admin") return;

  if (
    confirm(
      "¿Realmente desea importar los registros?\nAl hacerlo, se BORRARÁN TODOS LOS REGISTROS ACTUALES y se REEMPLAZARÁN por los nuevos."
    )
  ) {
    const contraseña = prompt(
      "Por favor, ingrese la contraseña para confirmar la operación:"
    );

    if (!contraseña || !contraseña.trim()) {
      alert("Por favor, ingrese una contraseña válida");
      return ((e.target as HTMLInputElement).value = "");
    }

    _portando.value = true;

    const file = (e.target as HTMLInputElement).files[0];

    const formData = new FormData();
    formData.append("usuario", sesion.value.usuario);
    formData.append("contraseña", contraseña);
    formData.append("archivo", file);

    const r = await fetch(rutaApi("importar-comunidad"), {
      method: "POST",
      body: formData,
    });

    (e.target as HTMLInputElement).value = "";
    _portando.value = false;

    alert(await r.text());

    if (r.ok) cargar.value = true;
  }
};

const exportar = async () => {
  _portando.value = true;
  const r = await fetch(rutaApi("exportar-comunidad"));
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Registros de la comunidad Santo Domingo De Guzmán.csv";
  link.click();
  URL.revokeObjectURL(url);
  _portando.value = false;
};
