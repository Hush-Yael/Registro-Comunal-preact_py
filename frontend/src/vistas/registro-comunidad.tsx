import Cabecera from "../componentes/cabecera";
import Formulario, {
  contextoFormulario,
  Mensaje,
  Reiniciar,
  Subir,
} from "../componentes/formulario";
import Input from "../componentes/formulario/input";
import TerminarSesion from "../componentes/terminar-sesion";
import Iconos from "../componentes/iconos";
import { useContext } from "preact/compat";
import { useSearchParams } from "wouter-preact";
import { rutaApi } from "../../utilidades";
import { DatosComunidad } from "../tipos";
import { signal } from "@preact/signals";

const datos = signal<DatosComunidad>({
  nombres: "",
  apellidos: "",
  cedula: "",
  fecha_nacimiento: "",
  patologia: "",
  direccion: "",
  numero_casa: "",
  id: 0,
});

export default () => {
  const [params, setParams] = useSearchParams();
  const editar = params.get("editar");

  return (
    <>
      <Cabecera titulo="Registro de la comunidad">
        <TerminarSesion />
      </Cabecera>
      <Formulario
        rutaApi="registro-comunidad"
        method={editar ? "PUT" : "POST"}
        datos={datos}
        fetchValues={
          editar
            ? () => fetch(rutaApi(`obtener-datos-comunidad/${editar}`))
            : undefined
        }
        onFetchSuccess={async (r, { datos }) => {
          if (r.ok) return (datos.value = await r.json());
          else
            setParams((p) => {
              p.delete("editar");
              return p;
            });
        }}
        onSuccess={({ contexto }) => {
          contexto.datos.value = contexto.datosIniciales.current;
          setTimeout(() => (contexto.estado.value = ""), 800);
        }}
      >
        <div class="col gap-5 mt-10 max-w-[700px]">
          <Mensaje estado="subiendo" texto="Guardando..." />
          <Mensaje estado="fetching" texto="Recuperando datos..." />
          <Mensaje
            estado="exito"
            texto={`Registro ${
              editar ? "actualizado" : "guardado"
            } correctamente`}
          />
          <div class="col gap-10">
            <Campos />
            <Botones />
          </div>
        </div>
      </Formulario>
    </>
  );
};

let timeout: number;

const Campos = () => {
  const [params] = useSearchParams();

  const { errores } = useContext(contextoFormulario);

  const cambiarCedula = (e: Event) => {
    clearTimeout(timeout);

    const cedula = (e.target as HTMLInputElement).value;
    if (!cedula || cedula == params.get("editar"))
      return (errores.value = { ...errores.value, cedula: "" });

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
  const [params, setParams] = useSearchParams();
  const editar = params.get("editar");

  return (
    <div class="col gap-4">
      {editar && (
        <small class="m-auto italic text-neutral-500" role="status">
          <Iconos.Editar /> Editando el registro: <b class="mx-1">{editar}</b>
        </small>
      )}
      <fieldset class="grid grid-cols-2 gap-2 m-auto">
        <Reiniciar
          onClick={() =>
            setParams((p) => {
              p.delete("editar");
              return p;
            })
          }
        >
          <Iconos.Borrar /> {editar ? "Descartar cambios" : "Limpiar campos"}
        </Reiniciar>
        <Subir>
          <Iconos.Añadir />
          {editar ? "Guardar cambios" : "Registrar"}
        </Subir>
      </fieldset>
    </div>
  );
};
