import Tabla from "../componentes/tabla";
import { signal } from "@preact/signals";
import Cabecera from "../componentes/cabecera";
import TerminarSesion from "../componentes/terminar-sesion";
import { sesion } from "..";
import Iconos from "../componentes/iconos";
import type { Usuario } from "../tipos";
import { rutaApi } from "../../utilidades";
import { ColumnDef } from "@tanstack/react-table";

const datos = signal<Usuario[]>([]),
  carga = signal(true);

const cambiarRol = async (datos: Usuario) => {
  const r = await fetch(rutaApi("actualizar-rol"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: datos.nombre,
      rol: datos.rol === "admin" ? "supervisor" : "admin",
    }),
  });

  if (!r.ok) console.error("No se pudo cambiar el rol");
};

const eliminarUsuario = async (nombre: string) => {
  if (confirm("¿Realmente desea eliminar el usuario?")) {
    const r = await fetch(rutaApi(`eliminar-usuario/${nombre}`), {
      method: "DELETE",
    });

    if (r.ok) datos.value = datos.value.filter((u) => u.nombre !== nombre);
  }
};

export default () => {
  return (
    <>
      <Cabecera titulo="Lista de usuarios">
        <TerminarSesion />
      </Cabecera>
      <Tabla
        wrapperClass="mt-8"
        class="[&_th]:text-left [&_th]:nth-[1]:text-center [&_td]:nth-[1]:text-center [&_th]:nth-[4]:text-right"
        columnas={[
          {
            header: "#",
            size: 30,
            cell: (info) => info.row.index + 1,
          },
          {
            header: "Nombre",
            accessorKey: "nombre",
            size: 100,
          },
          {
            header: "Rol",
            accessorKey: "rol",
            size: 100,
            cell: (info) =>
              sesion.value.rol !== "admin" ||
              info.row.original.nombre === sesion.value.usuario ? (
                <span class="px-1.25">{info.getValue()}</span>
              ) : (
                <select
                  class="rounded py-1.25 group-odd:hover:bg-neutral-200 hover:bg-neutral-100 transition-colors"
                  name="rol"
                  defaultValue={info.getValue()}
                  onChange={() => cambiarRol(info.row.original)}
                >
                  <option value="admin">admin</option>
                  <option value="supervisor">supervisor</option>
                </select>
              ),
          },
          ...(sesion.value.rol === "admin"
            ? [
                {
                  header: "Acciones",
                  size: 30,
                  cell: (info) =>
                    info.row.original.nombre === sesion.value.usuario ? (
                      <i class="inline-block w-full text-right text-neutral-600">
                        Usuario actual
                      </i>
                    ) : (
                      <button
                        class="btn btn-peligro ml-auto"
                        onClick={() =>
                          eliminarUsuario(info.row.original.nombre)
                        }
                      >
                        <Iconos.Eliminar class="size-4" />
                      </button>
                    ),
                } as ColumnDef<Usuario, any>,
              ]
            : []),
        ]}
        datos={datos}
        shouldFetch={carga}
        valuesFetcher={() => fetch(rutaApi("usuarios")).then((r) => r.json())}
      />
    </>
  );
};
