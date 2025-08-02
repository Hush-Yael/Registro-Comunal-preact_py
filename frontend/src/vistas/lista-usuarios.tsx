import Tabla from "~/componentes/tabla";
import { signal } from "@preact/signals";
import Cabecera from "~/componentes/cabecera";
import TerminarSesion from "~/componentes/terminar-sesion";
import { sesion } from "~/index";
import Iconos from "~/componentes/iconos";
import type { Usuario } from "~/tipos";
import { rutaApi } from "~/lib";
import { Link } from "wouter-preact";
import { toast } from "sonner";

export const listaUsuarios = signal<Usuario[]>([]);
const carga = signal(true);

const cambiarRol = async (datos: Usuario) => {
  const mensajeId = toast.loading("Actualizando rol...");

  try {
    const respuesta = await fetch(rutaApi("actualizar-rol"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: datos.nombre,
        rol: datos.rol === "admin" ? "supervisor" : "admin",
      }),
    });

    if (respuesta.ok)
      return toast.success("Rol actualizado con éxito", { id: mensajeId });

    toast.error("No se pudo cambiar el rol", { id: mensajeId });
  } catch (error) {
    console.error(error);
    toast.error("Error interno en el servidor al cambiar el rol", {
      id: mensajeId,
    });
  }
};

const eliminarUsuario = async (nombre: string) => {
  if (confirm("¿Realmente desea eliminar el usuario?")) {
    const mensajeId = toast.loading("Importando datos...");

    try {
      const respuesta = await fetch(rutaApi(`eliminar-usuario/${nombre}`), {
        method: "DELETE",
      });

      if (respuesta.ok) {
        listaUsuarios.value = listaUsuarios.value.filter(
          (u) => u.nombre !== nombre
        );

        return toast.success("Usuario eliminado con éxito", { id: mensajeId });
      }

      toast.error("Error al eliminar el usuario", { id: mensajeId });
    } catch (error) {
      console.error(error);
      toast.error("Error interno en el servidor al eliminar el usuario", {
        id: mensajeId,
      });
    }
  }
};

export default () => {
  return (
    <div class="col gap-6 h-full">
      <Cabecera titulo="Lista de usuarios">
        <TerminarSesion />
      </Cabecera>
      <Tabla
        wrapperClass="h-full"
        class="[&_th]:first:text-right [&_td]:first:justify-end [&_th]:last:text-right [&_td]:last:justify-end [&_thead>tr]:z-5 w-max m-auto"
        columnas={[
          {
            header: "#",
            size: 40,
            cell: (info) => info.row.index + 1,
          },
          {
            header: "Nombre",
            accessorKey: "nombre",
            maxSize: 200,
          },
          {
            header: "Rol",
            accessorKey: "rol",
            size: 110,
            cell: (info) =>
              sesion.value.rol !== "admin" ||
              info.row.original.nombre === sesion.value.usuario ? (
                info.getValue()
              ) : (
                <select
                  class="py-1.25 -mx-2 border border-transparent rounded-field hover:border-base focus-visible:bg-darkest hover:bg-darkest group-[[data-odd]]:hover:bg-base transition-colors"
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
            size: 90,
            cell: (info) => (
              <div className="flex justify-end gap-3 ml-auto">
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
        options={{
          enableColumnResizing: true,
        }}
        obtencionDatos={() => fetch(rutaApi("usuarios")).then((r) => r.json())}
      />
    </div>
  );
};
