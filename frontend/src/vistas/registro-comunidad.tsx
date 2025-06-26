import Cabecera from "../componentes/cabecera";
import Formulario, {
  contextoFormulario,
  MensajeCarga,
  MensajeExito,
  Reiniciar,
  Subir,
} from "../componentes/formulario";
import Input from "../componentes/formulario/input";
import TerminarSesion from "../componentes/terminar-sesion";
import Iconos from "../componentes/iconos";
import { useContext } from "preact/compat";

export default () => {
  return (
    <>
      <Cabecera titulo="Registro de la comunidad">
        <TerminarSesion />
      </Cabecera>
      <Formulario
        rutaApi="registro-comunidad"
        datos={{
          nombres: "",
          apellidos: "",
          cedula: "",
          fecha_nacimiento: "",
          patologia: "",
          direccion: "",
          numero_casa: "",
        }}
        onSuccess={({ contexto }) => {
          contexto.datos.value = contexto.datosIniciales.current;
          setTimeout(() => (contexto.estado.value = ""), 800);
        }}
      >
        <div class="col gap-13 mt-13 max-w-[700px]">
          <Campos />
          <div className="col gap-4 m-auto">
            <div>
              <MensajeCarga texto="Guardando..." />
              <MensajeExito texto="Registro guardado correctamente" />
            </div>
            <Botones />
          </div>
        </div>
      </Formulario>
    </>
  );
};

let timeout: number;

const Campos = () => {
  const { errores } = useContext(contextoFormulario);

  const cambiarCedula = (e: Event) => {
    clearTimeout(timeout);

    const cedula = (e.target as HTMLInputElement).value;
    if (!cedula) return (errores.value = { ...errores.value, cedula: "" });

    timeout = setTimeout(async () => {
      const respuesta = await fetch(
        `${location.origin.replace(
          /:\d+/,
          ":1144"
        )}/api/verificar-cedula-comunidad/${cedula}`,
        {
          method: "HEAD",
        }
      );

      if (respuesta.ok) {
        errores.value = {
          ...errores.value,
          cedula:
            respuesta.status === 404
              ? ""
              : "Ya existe un registro con esa cédula",
        };
      }
    }, 500);
  };

  return (
    <div class="grid grid-cols-2 gap-5">
      <Input
        label="Nombres"
        campo="nombres"
        id="nombres"
        type="text"
        minlength={3}
        required
      />
      <Input
        label="Apellidos"
        campo="apellidos"
        id="apellidos"
        type="text"
        minlength={3}
        required
      />
      <Input
        label="Cédula"
        campo="cedula"
        id="cedula"
        type="number"
        required
        onChange={cambiarCedula}
        min={1}
      />
      <Input
        label="Fecha de nacimiento"
        campo="fecha_nacimiento"
        id="fecha_nacimiento"
        type="date"
        max={new Date().toISOString().split("T")[0]}
      />
      <Input
        label="Patología / condición"
        campo="patologia"
        id="patologia"
        type="text"
      />
      <Input
        label="Número de casa"
        campo="numero_casa"
        id="numero_casa"
        type="text"
        min={1}
      />
      <Input
        class="col-span-2"
        label="Dirección"
        campo="direccion"
        id="direccion"
        type="text"
      />
    </div>
  );
};

const Botones = () => {
  return (
    <fieldset class="grid grid-cols-2 gap-2 m-auto">
      <Reiniciar>
        <Iconos.Borrar /> Limpiar campos
      </Reiniciar>
      <Subir>
        <Iconos.Añadir /> Registrar
      </Subir>
    </fieldset>
  );
};
