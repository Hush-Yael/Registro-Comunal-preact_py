import type {
  PaginationState,
  RowSelectionState,
  Table,
} from "@tanstack/react-table";
import type { Virtualizer } from "@tanstack/react-virtual";
import Paginacion from "~/componentes/tabla/paginacion";
import type { DatosComunidad } from "~/tipos";
import Menu from "./menu";
import Iconos from "~/componentes/iconos";
import {
  datosComunidad,
  eliminandoMultiples,
} from "~/constantes/lista-comunidad";
import { sesion } from "~/index";
import { rutaApi } from "~/lib";

export default (props: {
  paginacion: PaginationState;
  seleccion: RowSelectionState;
  tabla: Table<DatosComunidad>;
  virtualizador: Virtualizer<Element, Element>;
}) => {
  const seleccionados = Object.keys(props.seleccion).length;

  return (
    <div>
      {props.paginacion.pageSize !== null && (
        <Paginacion
          virtualizador={props.virtualizador}
          apodoFilas="registros"
          tabla={props.tabla}
        />
      )}
      <Menu tabla={props.tabla} />

      {eliminandoMultiples.value && sesion.value.rol === "admin" && (
        <div class="sel-wrapper fixed top-0 right-0 left-0 pb-2 dark:pb-2 bg-gradient-to-b from-[#0005] to-[#0000] to-90% dark:from-[#fff3] animate-[slideUpAndFade_0.350s] backdrop-blur-[2px]">
          <div class="col gap-3 w-max m-auto p-3 bg-base border border-base rounded-box rounded-t-none text-sm shadow-2xl dark:shadow-[0_2px_20px_#fff1]">
            <div class="flex items-center justify-between pl-1">
              <span role="status" class="text-muted">
                {props.tabla.getIsAllRowsSelected()
                  ? "Todos"
                  : `${seleccionados} de ${props.tabla.getRowCount()}`}{" "}
                seleccionados
              </span>

              <button
                aria-label="Seleccionar todos los registros"
                onClick={() => props.tabla.toggleAllRowsSelected()}
              >
                <Iconos.SeleccionarTodo class="size-5" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="btn btn-secundario py-1!"
                onClick={(e) => {
                  const a = (e.target as HTMLButtonElement)
                    .closest(".sel-wrapper")
                    .animate(
                      { opacity: 0 },
                      { duration: 200, fill: "forwards" }
                    );

                  a.onfinish = () => {
                    props.tabla.resetRowSelection();
                    eliminandoMultiples.value = false;
                  };
                }}
              >
                <Iconos.X class="size-4" /> Descartar
              </button>
              <button
                class="btn btn-peligro py-1!"
                disabled={seleccionados === 0}
                onClick={() => eliminarMultiples(props.seleccion, props.tabla)}
              >
                <Iconos.Eliminar class="size-4" /> Eliminar
                <span class="sr-only">seleccionados</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const eliminarMultiples = async (
  seleccion: RowSelectionState,
  tabla: Table<DatosComunidad>
) => {
  if (confirm("¿Realmente desea eliminar los registros seleccionados?")) {
    const ids = Object.keys(seleccion);

    const r = await fetch(rutaApi("eliminar-registros-comunidad"), {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (r.ok) {
      eliminandoMultiples.value = false;
      tabla.resetRowSelection();
      datosComunidad.value = datosComunidad.value.filter(
        (u) => !ids.includes(u.id.toString())
      );
    } else alert("No se pudieron eliminar los registros");
  }
};
