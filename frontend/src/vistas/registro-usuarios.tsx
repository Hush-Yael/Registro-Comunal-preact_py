import { useContext } from "preact/hooks";
import Cabecera from "~/componentes/cabecera";
import Input from "~/componentes/formulario/input";
import Formulario, {
  contextoFormulario,
  Mensaje,
} from "~/componentes/formulario";
import Contraseña from "~/componentes/formulario/contraseña";
import { Link, useLocation, useSearchParams } from "wouter-preact";
import { sesion } from "~/index";
import { useSignal } from "@preact/signals";
import { listaUsuarios } from "./lista-usuarios";
import { rutaApi } from "~/lib";

export default () => {
  const [, setLocation] = useLocation();
  const [params] = useSearchParams();
  const ID = params.get("id"),
    PUEDE_EDITAR = ID && sesion.value.usuario;
  const datos = useSignal({ nombre: "", contraseña: "" });

  if (!ID && sesion.value.usuario)
    return setLocation("/usuarios", { replace: true });

  return (
    <>
      <Cabecera
        titulo={PUEDE_EDITAR ? "Editar usuario" : "Registrar nuevo usuario"}
      />
      <Formulario
        rutaApi="registro"
        method={PUEDE_EDITAR ? "PUT" : "POST"}
        datos={datos}
        fetchValues={
          PUEDE_EDITAR
            ? () => fetch(rutaApi(`obtener-datos-usuario/${ID}`))
            : undefined
        }
        onFetchSuccess={async (r, { datos }) => {
          if (r.ok) return (datos.value = await r.json());
          else if (sesion.value.usuario)
            setLocation("/usuarios", { replace: true });
        }}
        onSuccess={({ contexto }) => {
          if (PUEDE_EDITAR) {
            listaUsuarios.value = listaUsuarios.value.map((d) => {
              if (d.id === parseInt(ID)) return { ...d, ...datos.value };
              else return d;
            });

            return setTimeout(() => {
              setLocation("/usuarios", { replace: true });
            }, 800);
          }

          listaUsuarios.value.push({
            id: listaUsuarios.value.length
              ? listaUsuarios.value[listaUsuarios.value.length - 1].id + 1
              : 1,
            nombre: contexto.datos.value.nombre,
            rol: "supervisor",
          });
        }}
      >
        <Datos />
      </Formulario>
    </>
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
      const respuesta = await fetch(rutaApi(`verificar-nombre-usuario`), {
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
    <div class="col mt-16 gap-6">
      <Input
        onChange={(e) => {
          clearTimeout(timeout);
          timeout = setTimeout(
            () => buscarNombre((e.target as HTMLInputElement).value.trim()),
            500
          );
        }}
        campo="nombre"
        id="nombre-de-usuario"
        label={`Nombre de usuario ${PUEDE_EDITAR ? `(actual: ${nombre})` : ""}`}
      />
      <Contraseña />

      <Mensaje
        estado="subiendo"
        texto={PUEDE_EDITAR ? "Verificando datos..." : "Registrando..."}
      />

      <Mensaje
        estado="exito"
        texto={`${
          PUEDE_EDITAR ? "Datos actualizados" : "Usuario registrado"
        } con éxito`}
      />

      <div class="col gap-2.5">
        <button
          class="btn btn-primario"
          disabled={estado.value == "subiendo" || estado.value == "fetching"}
        >
          {PUEDE_EDITAR ? "Guardar cambios" : "Registrar"}
        </button>
        {!PUEDE_EDITAR && (
          <Link href="/" class="text-center underline underline-offset-2">
            Ir al inicio de sesión
          </Link>
        )}
      </div>
    </div>
  );
};
