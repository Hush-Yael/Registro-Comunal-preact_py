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
import { useContext, useEffect } from "preact/compat";
import { useSearchParams } from "wouter-preact";
import { rutaApi } from "../../utilidades";
import { DatosComunidad } from "../tipos";
import { signal } from "@preact/signals";
import { datosComunidad } from "./lista-comunidad";

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

let ultimoId: string | null;

export default () => {
  const [params, setParams] = useSearchParams();
  const editar = params.get("editar");

  useEffect(() => {
    if (ultimoId)
      setParams((p) => {
        p.set("editar", ultimoId);
        return p;
      });
  }, []);

  useEffect(() => {
    ultimoId = editar;
  }, [params]);

  return (
    <>
      <Cabecera titulo="Registro de la comunidad">
        <TerminarSesion />
      </Cabecera>
      <Formulario
        class="h-full"
        rutaApi="registro-comunidad"
        method={editar ? "PUT" : "POST"}
        datos={datos}
        datosIniciales={{
          nombres: "",
          apellidos: "",
          cedula: "",
          fecha_nacimiento: "",
          patologia: "",
          direccion: "",
          numero_casa: "",
          id: 0,
        }}
        modificarValoresEnviados={(d) => ({
          ...d,
          cedula: (d.cedula as string).replace(/\D/g, ""),
        })}
        fetchValues={
          editar
            ? () => fetch(rutaApi(`obtener-datos-comunidad/${editar}`))
            : undefined
        }
        onFetchSuccess={async (r, { datos }) => {
          if (r.ok) {
            const _datos = await r.json();

            return (datos.value = {
              ..._datos,
              cedula: parseInt(_datos.cedula).toLocaleString("es-VE"),
            });
          } else
            setParams((p) => {
              p.delete("editar");
              return p;
            });
        }}
        onSuccess={({ contexto }) => {
          if (editar) {
            setParams((p) => {
              p.delete("editar");
              return p;
            });

            datosComunidad.value = datosComunidad.value.map((d) => {
              if (d.id === Number(editar))
                return {
                  ...datos.value,
                  cedula: parseInt(datos.value.cedula as string),
                };
              else return d;
            });
          } else
            datosComunidad.value.push({
              ...datos.value,
              id: datosComunidad.value[datosComunidad.value.length - 1].id + 1,
            });

          contexto.datos.value = contexto.datosIniciales;
          setTimeout(() => (contexto.estado.value = ""), 800);
        }}
      >
        <div class="col gap-5 mt-10 max-w-[700px] h-full overflow-hidden">
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
  const { errores } = useContext(contextoFormulario);

  const buscarCedula = async (valor: number) => {
    if (!valor) return (errores.value = { ...errores.value, cedula: "" });

    const respuesta = await fetch(rutaApi(`verificar-cedula-comunidad`), {
      method: "POST",
      body: JSON.stringify({ cedula: valor, id: datos.value.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (respuesta.ok) {
      errores.value = {
        ...errores.value,
        cedula:
          respuesta.status === 404
            ? ""
            : "Ya existe un registro con esa cédula",
      };
    }
  };

  const localizar = (e: Event) => {
    const v = Number.parseInt(
      (e.target as HTMLInputElement).value.replace(/\D/g, "")
    );

    if (v) (e.target as HTMLInputElement).value = v.toLocaleString("es-VE");
  };

  return (
    <div class="grid grid-cols-2 gap-5 h-full overflow-y-auto max-sm:col max-sm:max-h-[40vh]">
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
        minlength={NOMBRE_MÍNIMO}
        required
      />
      <Input
        label="Cédula"
        campo="cedula"
        id="cedula"
        required
        minlength={1}
        onChange={(e) => {
          clearTimeout(timeout);
          timeout = setTimeout(
            () =>
              buscarCedula(
                parseInt(
                  (e.target as HTMLInputElement).value.replace(/\D/g, "")
                )
              ),
            500
          );
        }}
        onPaste={(e) => {
          e.preventDefault();
          const numero = parseInt(
            e.clipboardData.getData("text/plain").replace(/\D/g, "")
          );
          const texto = (numero || "").toLocaleString("es-VE");

          datos.value = {
            ...datos.value,
            cedula: texto,
          };

          numero && buscarCedula(numero);
        }}
        onBeforeInput={(e) => {
          if (e.data && !/^\d+$/.test(e.data)) e.preventDefault();
        }}
        onInput={localizar}
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
        <small class="m-auto italic text-muted" role="status">
          <Iconos.Editar /> Editando el registro: <b class="mx-1">{editar}</b>
        </small>
      )}
      <div
        role="group"
        class="grid grid-cols-2 gap-2 min-[440px]:m-auto max-[440px]:flex max-[440px]:justify-end max-[440px]:text-sm"
      >
        <Reiniciar
          onClick={() =>
            setParams((p) => {
              p.delete("editar");
              return p;
            })
          }
        >
          <Iconos.Borrar />
          <span>{editar ? "Descartar cambios" : "Limpiar campos"}</span>
        </Reiniciar>
        <Subir>
          <Iconos.Añadir />
          <span>{editar ? "Guardar cambios" : "Registrar"}</span>
        </Subir>
      </div>
    </div>
  );
};
