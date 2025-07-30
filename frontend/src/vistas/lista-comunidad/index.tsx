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
import Menu from "./menu";
import ModalGenerar from "./modal";
import FilaOpciones from "./menu-fila-opciones";
import {
  cargarDatosComunidad,
  datosComunidad,
  ordenColumnas,
  configuracionFiltros,
  idARegistroSeleccionado,
} from "~/constantes/lista-comunidad";
import { funcionFiltro } from "~/lib/filtros";
import { FiltroId } from "~/tipos/lista-comunidad";
import Paginacion from "~/componentes/tabla/paginacion";

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
      val.pageSize > 0,
  });

  const [visibilidad, setVisibilidad] = useLocalStorageState({
    key: "visibilidad-comunidad",
    default: {
      nombres: true,
      apellidos: true,
      cedula: true,
      fecha_nacimiento: true,
      edad: true,
      patologia: true,
      direccion: true,
      numero_casa: true,
    },
  });

  const columnas: ColumnDef<DatosComunidad>[] = [
    { header: "#", accessorKey: "id", maxSize: 45, enableColumnFilter: false },
    {
      header: "Nombres y apellidos",
      accessorFn: (row) => `${row.nombres} ${row.apellidos}`,
      size: 200,
      filterFn: funcionFiltro,
    },
    {
      header: "Cédula",
      id: "cedula",
      accessorFn: (row) =>
        row.cedula ? row.cedula.toLocaleString("es-VE") : "",
      maxSize: 100,
      meta: { filterInputValuePattern: /\d|\./ },
      filterFn: funcionFiltro,
    },
    {
      header: "F. nacimiento",
      accessorKey: "fecha_nacimiento",
      size: 150,
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
      size: 60,
      minSize: 0,
      meta: { filterInputValuePattern: /\d/, filterVariant: "number" },
      filterFn: funcionFiltro,
    },
    {
      header: "Patología / condición",
      accessorKey: "patologia",
      size: 145,
    },
    {
      header: "Dirección",
      accessorKey: "direccion",
      size: 150,
      filterFn: funcionFiltro,
    },
    {
      header: "N° casa",
      accessorKey: "numero_casa",
      size: 80,
      meta: { filterInputValuePattern: /[\d-_\s/]/ },
      filterFn: funcionFiltro,
    },
    ...(sesion.value.rol === "admin"
      ? [
          {
            header: "Acciones",
            size: 50,
            enableColumnFilter: false,
            enableSorting: false,
            cell: (info) => (
              <MenuTrigger
                aria-label="Opciones del registro"
                class="z-0 h-6 w-5 bg-dark group-odd:bg-base border border-base hover:border-highlight hover:bg-darkest group-odd:hover:bg-dark"
                onPointerDown={() =>
                  (idARegistroSeleccionado.current = info.row.original.id)
                }
                onKeyDown={(e) => {
                  (e.key === "Enter" ||
                    e.key === "Space" ||
                    e.key === "ArrowDown") &&
                    (idARegistroSeleccionado.current = info.row.original.id);
                }}
              />
            ),
          } as ColumnDef<DatosComunidad>,
        ]
      : []),
  ];

  return (
    <div class="wrapper-tabla-comunidad col gap-4 relative h-full max-h-full">
      <Cabecera titulo="Lista de registros de la comunidad" />

      <ModalGenerar />

      <FilaOpciones>
        <Tabla
          class="
            [&_th[data-id=id]]:items-end [&_td[data-column-id=id]]:justify-end
            [&_th[data-id=cedula]]:items-end [&_td[data-column-id=cedula]]:justify-end
            [&_th[data-id=fecha\\_nacimiento]]:items-end [&_td[data-column-id=fecha\\_nacimiento]]:justify-end
            [&_th[data-id=edad]]:items-end [&_td[data-column-id=edad]]:justify-end
            [&_th[data-id=numero\\_casa]]:items-end [&_td[data-column-id=numero\\_casa]]:justify-end
            [&_th[data-id=Acciones]]:text-[0px]
          "
          datos={datosComunidad}
          header={(tabla: Table<DatosComunidad>) => (
            <div>
              {paginacion.pageSize !== null && (
                <Paginacion apodoFilas="registros" tabla={tabla} />
              )}
              <Menu tabla={tabla} />
            </div>
          )}
          options={{
            getPaginationRowModel: getPaginationRowModel(),
            state: {
              pagination: paginacion,
              columnVisibility: visibilidad,
            },
            onColumnVisibilityChange: setVisibilidad,
            onPaginationChange: setPaginacion,
            autoResetPageIndex: false,
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
      </FilaOpciones>
    </div>
  );
};
