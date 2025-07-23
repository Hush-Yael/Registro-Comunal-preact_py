import Tabla from "~/componentes/tabla";
import { signal } from "@preact/signals";
import Cabecera from "~/componentes/cabecera";
import TerminarSesion from "~/componentes/terminar-sesion";
import { sesion } from "~/index";
import Iconos from "~/componentes/iconos";
import type { Usuario } from "../tipos";
import { rutaApi } from "~/utilidades";
import { Link } from "wouter-preact";

export const listaUsuarios = signal<Usuario[]>([]);
const carga = signal(true);

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

    if (r.ok)
      listaUsuarios.value = listaUsuarios.value.filter(
        (u) => u.nombre !== nombre
      );
  }
};

export default () => {
  return (
    <>
      <Cabecera titulo="Lista de usuarios">
        <TerminarSesion />
      </Cabecera>
      <Tabla
        wrapperClass="max-h-[60vh] w-[600px] mt-8"
        class="[&_th]:text-left [&_th]:nth-[1]:text-center [&_td]:nth-[1]:text-center [&_th]:nth-[4]:text-right [&_thead>tr]:z-5"
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
                  class="py-1.25 border border-transparent rounded-field hover:border-base focus-visible:bg-darkest hover:bg-darkest group-odd:hover:bg-base transition-colors"
                  name="rol"
                  defaultValue={info.getValue()}
                  onChange={() => cambiarRol(info.row.original)}
                >
                  <option value="admin">admin</option>
                  <option value="supervisor">supervisor</option>
                </select>
              ),
          },
          {
            header: "Acciones",
            size: 30,
            cell: (info) => (
              <div className="flex justify-end gap-3">
                {info.row.original.nombre !== sesion.value.usuario ? (
                  <button
                    class="btn btn-peligro ml-auto"
                    disabled={sesion.value.rol !== "admin"}
                    onClick={() => eliminarUsuario(info.row.original.nombre)}
                  >
                    <Iconos.Eliminar class="size-4" />
                  </button>
                ) : (
                  <>
                    <Link
                      class="btn btn-primario px-1.5!"
                      href={`/registro?id=${info.row.original.id}&nombre=${info.row.original.nombre}`}
                    >
                      <Iconos.EditarUsuario class="size-5" />
                    </Link>
                  </>
                )}
              </div>
            ),
          },
        ]}
        datos={listaUsuarios}
        datosDebenCargar={carga}
        obtencionDatos={() => fetch(rutaApi("usuarios")).then((r) => r.json())}
      />
    </>
  );
};
