import { useContext } from "preact/hooks";
import Cabecera from "../componentes/cabecera";
import Input from "../componentes/formulario/input";
import Formulario, {
  contextoFormulario,
  Mensaje,
} from "../componentes/formulario";
import Contraseña from "../componentes/formulario/contraseña";
import { Link } from "wouter-preact";
import { sesion } from "..";
import { signal } from "@preact/signals";

export default () => {
  const datos = signal({ nombre: "", contraseña: "" });

  return (
    <>
      <Cabecera titulo="Inicio de sesión" />
      <Formulario
        rutaApi="login"
        datos={datos}
        onSuccess={({ contexto, json }) =>
          (sesion.value = {
            usuario: contexto.datos.value.nombre,
            rol: json,
          })
        }
      >
        <Datos />
      </Formulario>
    </>
  );
};

const Datos = () => {
  const { estado } = useContext(contextoFormulario);

  return (
    <div class="col mt-16 gap-6">
      <Input campo="nombre" id="nombre-de-usuario" label="Nombre de usuario" />
      <Contraseña />

      <Mensaje estado="subiendo" texto="Verificando datos..." />

      <div class="col gap-2.5">
        <button class="btn btn-primario" disabled={estado.value == "subiendo"}>
          Entrar
        </button>
        <Link href="/registro" class="text-center underline underline-offset-2">
          Ir al registro
        </Link>
      </div>
    </div>
  );
};
