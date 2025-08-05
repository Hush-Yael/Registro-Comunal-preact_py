import { useContext } from "preact/hooks";
import Cabecera from "~/componentes/cabecera";
import Input from "~/componentes/formulario/input";
import Formulario, { contextoFormulario } from "~/componentes/formulario";
import Contraseña from "~/componentes/formulario/contraseña";
import { Link } from "wouter-preact";
import { sesion } from "~/index";
import { signal } from "@preact/signals";
import { NOMBRE_MÍNIMO } from "~/constantes";
import { toast } from "sonner";
import Main from "~/componentes/main";

const mensajeId = "login";

export default () => {
  const datos = signal({ nombre: "", contraseña: "" });

  return (
    <Main>
      <Cabecera titulo="Inicio de sesión" />
      <Formulario
        rutaApi="login"
        datos={datos}
        onSubmit={() =>
          toast.loading("Verificando datos...", { id: mensajeId })
        }
        onSuccess={({ contexto, json }) => {
          sesion.value = {
            usuario: contexto.datos.value.nombre,
            rol: json,
          };

          toast.success("Inicio de sesión exitoso", { id: mensajeId });
        }}
        onBadRequest={({ json }) => {
          // ya se muestran los errores en el formulario
          if (json.mensaje) toast.dismiss(mensajeId);
          else toast.error("Error al iniciar sesión", { id: mensajeId });
        }}
      >
        <Datos />
      </Formulario>
    </Main>
  );
};

const Datos = () => {
  const { estado } = useContext(contextoFormulario);

  return (
    <div class="col mt-16 gap-6">
      <Input
        campo="nombre"
        id="nombre-de-usuario"
        label="Nombre de usuario"
        required
        minlength={NOMBRE_MÍNIMO}
      />
      <Contraseña />

      <div class="col gap-2.5">
        <button class="btn btn-primario" disabled={estado.value == "subiendo"}>
          Entrar
        </button>
        <Link href="/registro" class="link">
          Ir al registro
        </Link>
      </div>
    </div>
  );
};
