import { useContext } from "preact/hooks";
import Cabecera from "../componentes/cabecera";
import Input from "../componentes/formulario/input";
import Formulario, {
  contextoFormulario,
  Mensaje,
} from "../componentes/formulario";
import Contraseña from "../componentes/formulario/contraseña";
import { Link, useLocation } from "wouter-preact";
import { sesion } from "..";
import { signal } from "@preact/signals";
import { listaUsuarios } from "./lista-usuarios";

const datos = signal({ nombre: "", contraseña: "" });

export default () => {
  const [path] = useLocation();
  const LOGIN = path == "/login";

  return (
    <>
      <Cabecera
        titulo={LOGIN ? "Inicio de sesión" : "Registrar nuevo usuario"}
      />
      <Formulario
        rutaApi={LOGIN ? "login" : "registro"}
        datos={datos}
        onSuccess={({ contexto, json }) => {
          if (LOGIN)
            return (sesion.value = {
              usuario: contexto.datos.value.nombre,
              rol: json,
            });

          listaUsuarios.value.push({
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

const Datos = () => {
  const [path] = useLocation();
  const LOGIN = path == "/login";
  const { estado } = useContext(contextoFormulario);

  return (
    <div class="col mt-16 gap-6">
      <Input campo="nombre" id="nombre-de-usuario" label="Nombre de usuario" />
      <Contraseña />

      <Mensaje
        estado="subiendo"
        texto={LOGIN ? "Verificando datos..." : "Registrando..."}
      />
      {!LOGIN && (
        <Mensaje estado="exito" texto="Usuario registrado con éxito" />
      )}

      <div class="col gap-1.5">
        <button class="btn btn-primario" disabled={estado.value == "subiendo"}>
          {LOGIN ? "Entrar" : "Registrar"}
        </button>
        <Link href={LOGIN ? "/registro" : "/login"} class="btn btn-secundario">
          Ir al {LOGIN ? "registro" : "inicio de sesión"}
        </Link>
      </div>
    </div>
  );
};
