import {
  getFilteredRowModel,
  getPaginationRowModel,
  type Table,
  type ColumnDef,
} from "@tanstack/react-table";
import { descarga, rutaApi } from "../../utilidades";
import Cabecera from "../componentes/cabecera";
import Tabla from "../componentes/tabla";
import { sesion } from "..";
import { DatosComunidad } from "../tipos";
import useLocalStorage from "../hooks/useLocalStorage";
import Iconos from "../componentes/iconos";
import { signal } from "@preact/signals";
import { Link } from "wouter-preact";
import Opcion from "../componentes/opcion";
import Modal from "../componentes/modal";

export const datosComunidad = signal<DatosComunidad[]>([]);
const cargar = signal(true);
const abierto = signal(false);
let idAGenerar: number;

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
                  disabled={generando.value}
                  onClick={() => {
                    idAGenerar = info.row.original.id;
                    abierto.value = true;
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
          cargar.value ? "h-full" : "max-h-full"
        } w-[500px] [&_td]:nth-3:text-right [&_td]:nth-4:text-right [&_td]:nth-7:text-right`}
        wrapperClass="h-[60vh] mt-6"
        datos={datosComunidad}
        header={(tabla: Table<DatosComunidad>) => (
          <Cabecera titulo="Lista de registros de la comunidad">
            <div
              role="group"
              class="flex items-center gap-3 pr-1 *:p-1! [&_svg]:size-4.5!"
            >
              <button
                class="btn btn-secundario col-span-2 m-auto"
                // @ts-expect-error: no importa
                onClick={tabla.resetColumnFilters}
                title="Limpiar filtros"
              >
                <Iconos.LimpiarFiltros />
              </button>
              <button
                onClick={() => {
                  cargar.value = true;
                }}
                disabled={cargar.value === true || _portando.value}
                class="btn btn-secundario"
                title="Recargar datos"
              >
                <Iconos.Recargar />
              </button>
              <button
                onClick={exportar}
                disabled={_portando.value || datosComunidad.value.length < 1}
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
            </div>
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
    </>
  );
};

const ModalGenerar = () => {
  const [documento, setDocumento] = useLocalStorage<{
    tipo: "docx" | "pdf";
    base: "plantilla" | "residencia" | "mortem";
  }>({
    key: "documento",
    default: {
      tipo: "pdf",
      base: "residencia",
    },
    validacion: (v) =>
      (v.tipo === "pdf" || v.tipo === "docx") &&
      (v.base === "residencia" ||
        v.base === "mortem" ||
        v.base === "plantilla"),
  });

  const generarReporte = async () => {
    if (generando.value) return;

    abierto.value = false;
    generando.value = true;

    const tiempo_ = prompt(
      "Indique el tiempo de residencia del individuo: (ejemplo: 3 meses)"
    );

    try {
      const r = await fetch(rutaApi("generar-carta"), {
        method: "POST",
        body: JSON.stringify({
          id: idAGenerar,
          tipo_documento: documento.tipo,
          tipo_carta: documento.base,
          tiempo_,
          hoy: new Date().toLocaleDateString("es-VE", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (r.ok)
        descarga(
          r,
          `${documento.base === "plantilla" ? "plantilla" : "constancia"}.${
            documento.tipo
          }`
        );
      else {
        alert(await r.text());
      }
    } catch (error) {
      alert(
        "No se pudo generar el reporte debido a un error interno del servidor"
      );
      console.error(error);
    } finally {
      idAGenerar = undefined;
      generando.value = false;
    }
  };

  return (
    <Modal
      titulo="Generar carta"
      class="max-w-[700px]"
      abierto={abierto}
      submitProps={{
        onClick: generarReporte,
        children: "Generar",
      }}
    >
      <div className="col gap-6">
        <form class="col gap-2">
          <h2>Seleccione el tipo de documento:</h2>
          <div class="grid grid-cols-2 gap-3 *:h-full">
            <Opcion
              id="pdf"
              type="radio"
              checked={
                documento.tipo === "pdf" && documento.base !== "plantilla"
              }
              name="tipo-documento"
              disabled={documento.base === "plantilla"}
              onChange={() => setDocumento((p) => ({ ...p, tipo: "pdf" }))}
              titulo={
                <>
                  Documento PDF <Iconos.PDF class="size-11" />
                </>
              }
            >
              Ideal para preservar el formato original de la carta
            </Opcion>

            <Opcion
              id="word"
              name="tipo-documento"
              type="radio"
              checked={
                documento.tipo === "docx" || documento.base === "plantilla"
              }
              onChange={() => setDocumento((p) => ({ ...p, tipo: "docx" }))}
              titulo={
                <>
                  Documento de Word (.docx){" "}
                  <Iconos.Word class="size-10 min-size-max" />
                </>
              }
            >
              Idéntico al documento PDF, pero con la posibilidad de editarlo
            </Opcion>
          </div>
        </form>
        <form class="col gap-2">
          <h2>Seleccione el tipo de carta:</h2>
          <div class="grid grid-cols-2 gap-3 *:h-full">
            <Opcion
              type="radio"
              id="plantilla"
              name="base-documento"
              titulo={
                <>
                  Plantilla con datos <Iconos.Plantilla />
                </>
              }
              onChange={() =>
                setDocumento((p) => ({ ...p, base: "plantilla" }))
              }
              checked={documento.base === "plantilla"}
            >
              Contiene las imágenes, el mensaje de apertura, los campos para las
              firmas y datos, y la fecha de expedición. Lo demás se debe
              realizar manualmente
            </Opcion>
            <Opcion
              type="radio"
              id="residencia"
              name="base-documento"
              titulo={
                <>
                  Constancia de residencia <Iconos.Casa />
                </>
              }
              onChange={() =>
                setDocumento((p) => ({ ...p, base: "residencia" }))
              }
              checked={documento.base === "residencia"}
            >
              Todo lo de la plantilla, con los datos de la persona ordenados.
              Opcionalmente se indica el tiempo de residencia
            </Opcion>
            <Opcion
              type="radio"
              id="mortem"
              name="base-documento"
              titulo={
                <>
                  Constancia post-mortem <Iconos.Tumba />
                </>
              }
              onChange={() => setDocumento((p) => ({ ...p, base: "mortem" }))}
              checked={documento.base === "mortem"}
            >
              Todo lo de la plantilla, con los datos de la persona ordenados.
              Opcionalmente se indica el tiempo que vivió en la comunidad
            </Opcion>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const generando = signal(false);

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
  if (datosComunidad.value.length < 1) return;

  _portando.value = true;
  const r = await fetch(rutaApi("exportar-comunidad"));
  descarga(r, "Registros de la comunidad Santo Domingo De Guzmán.csv");
  _portando.value = false;
};
