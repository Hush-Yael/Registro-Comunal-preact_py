import { useContext } from "preact/hooks";
import Cabecera from "~/componentes/cabecera";
import Input from "~/componentes/formulario/input";
import Formulario, { contextoFormulario } from "~/componentes/formulario";
import Contraseña from "~/componentes/formulario/contraseña";
import { Link, useLocation, useSearchParams } from "wouter-preact";
import { sesion } from "~/index";
import { useSignal } from "@preact/signals";
import { listaUsuarios } from "./lista-usuarios";
import { rutaApi } from "~/lib";
import { toast } from "sonner";
import Main from "~/componentes/main";
import Iconos from "~/componentes/iconos";
import { NOMBRE_MÍNIMO } from "~/constantes";

const mensajeId = "registro";

export default () => {
  const [, setLocation] = useLocation();
  const [params] = useSearchParams();
  const ID = params.get("id"),
    PUEDE_EDITAR = ID && sesion.value.usuario;
  const datos = useSignal({ nombre: "", contraseña: "" });

  if (!ID && sesion.value.usuario)
    return setLocation("/usuarios", { replace: true });

  return (
    <Main class="h-max m-auto">
      <Cabecera
        titulo={PUEDE_EDITAR ? "Editar usuario" : "Registrar nuevo usuario"}
      />
      <Formulario
        rutaApi="registro"
        method={PUEDE_EDITAR ? "PUT" : "POST"}
        datos={datos}
        fetchValues={
          PUEDE_EDITAR
            ? () => {
                const p = fetch(rutaApi(`obtener-datos-usuario/${ID}`));

                window.setTimeout(() => {
                  toast.promise(p, {
                    loading: "Obteniendo datos...",
                    error: (r: string) =>
                      r.endsWith("404")
                        ? "No se encontró el registro"
                        : "Error al recuperar los datos del registro",
                    id: mensajeId,
                    duration: 4500,
                  });
                });
                return p;
              }
            : undefined
        }
        onFetchSuccess={async (r, { datos }) => {
          if (r.ok) return (datos.value = await r.json());
          else if (sesion.value.usuario)
            setLocation("/usuarios", { replace: true });
        }}
        onSubmit={() =>
          toast.loading(
            PUEDE_EDITAR ? "Verificando datos..." : "Registrando...",
            { id: mensajeId }
          )
        }
        onBadRequest={({ json }) => {
          // ya se muestran los errores en el formulario
          if (json.mensaje) toast.dismiss(mensajeId);
          else
            toast.error(
              `Error al ${PUEDE_EDITAR ? "actualizar" : "guardar"} el usuario`,
              { id: mensajeId }
            );
        }}
        onSuccess={({ contexto }) => {
          if (PUEDE_EDITAR) {
            listaUsuarios.value = listaUsuarios.value.map((d) => {
              if (d.id === parseInt(ID)) return { ...d, ...datos.value };
              else return d;
            });
          } else {
            listaUsuarios.value.push({
              id: listaUsuarios.value.length
                ? listaUsuarios.value[listaUsuarios.value.length - 1].id + 1
                : 1,
              nombre: contexto.datos.value.nombre,
              rol: "supervisor",
            });
          }

          toast.success(
            `${
              PUEDE_EDITAR ? "Datos actualizados" : "Usuario registrado"
            } con éxito`,
            { id: mensajeId }
          );

          if (!PUEDE_EDITAR)
            sesion.value = { usuario: datos.value.nombre, rol: "supervisor" };

          setLocation(PUEDE_EDITAR ? "/usuarios" : "/", { replace: true });
          datos.value = { nombre: "", contraseña: "" };
        }}
        onError={() => {
          toast.error(
            `Error del servidor al ${
              PUEDE_EDITAR ? "actualizar" : "guardar"
            } el registro`,
            { id: mensajeId }
          );
        }}
      >
        <Datos />
      </Formulario>
    </Main>
  );
};

let timeout: number;

const Datos = () => {
  const [params] = useSearchParams();
  const ID = params.get("id"),
    PUEDE_EDITAR = ID && sesion.value.usuario,
    nombre = params.get("nombre");
  const { datos, estado, errores } = useContext(contextoFormulario);

  const buscarNombre = async (valor: string) => {
    if (!valor) return (errores.value = { ...errores.value, nombre: "" });

    try {
      const respuesta = await fetch(rutaApi("verificar-nombre-usuario"), {
        method: "POST",
        body: JSON.stringify({ nombre: valor, id: datos.value.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (respuesta.ok) {
        errores.value = {
          ...errores.value,
          nombre:
            respuesta.status === 404
              ? ""
              : "Ya existe un usuario con ese nombre",
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (e) {
      /* empty */
    }
  };

  return (
    <div class="col mt-16 gap-6 max-w-[350px]">
      <Input
        onChange={(e) => {
          clearTimeout(timeout);
          timeout = window.setTimeout(
            () => buscarNombre((e.target as HTMLInputElement).value.trim()),
            500
          );
        }}
        campo="nombre"
        id="nombre-de-usuario"
        required
        minLength={NOMBRE_MÍNIMO}
        label={
          <span>
            Nombre de usuario{" "}
            {PUEDE_EDITAR && <i class="ml-1 text-sm">(actual: {nombre})</i>}
          </span>
        }
      />

      <Contraseña />

      <div class="col gap-2.5">
        <button
          class="btn btn-primario"
          disabled={estado.value == "subiendo" || estado.value == "fetching"}
        >
          {PUEDE_EDITAR ? (
            <>
              <Iconos.Check class="size-5" /> Guardar cambios
            </>
          ) : (
            "Registrar"
          )}
        </button>
        {!PUEDE_EDITAR ? (
          <Link href="/" class="link">
            Ir al inicio de sesión
          </Link>
        ) : (
          <Link href="/usuarios" class="btn btn-secundario" replace>
            <Iconos.X class="size-5" /> Descartar edición
          </Link>
        )}
      </div>
    </div>
  );
};
