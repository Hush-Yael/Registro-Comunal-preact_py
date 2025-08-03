import Cabecera from "~/componentes/cabecera";
import Formulario, {
  contextoFormulario,
  Reiniciar,
  Subir,
} from "~/componentes/formulario";
import Input from "~/componentes/formulario/input";
import TerminarSesion from "~/componentes/terminar-sesion";
import Iconos from "~/componentes/iconos";
import { useContext, useEffect } from "preact/compat";
import { useSearchParams } from "wouter-preact";
import { añosDesdeFecha, rutaApi } from "~/lib";
import { DatosComunidad } from "~/tipos";
import { signal } from "@preact/signals";
import { NOMBRE_MÍNIMO } from "~/constantes";
import { datosComunidad } from "~/constantes/lista-comunidad";
import { toast } from "sonner";
import Main from "~/componentes/main";
import useMedia from "~/hooks/useMedia";
import { Popover } from "radix-ui";

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
const mensajeId = "registro-comunidad";

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
    <Main class="grid grid-rows-[auto_1fr] gap-10 max-w-[700px] overflow-hidden">
      <Cabecera titulo="Registro de la comunidad">
        <div class="col gap-2">
          <Editando id={editar} />
          <TerminarSesion />
        </div>
      </Cabecera>
      <Formulario
        class="h-full col overflow-hidden"
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
          cedula: (d.cedula as string).trim()
            ? parseInt((d.cedula as string).replace(/\D/g, "")) || null
            : null,
        })}
        fetchValues={
          editar
            ? () => {
                const p = fetch(rutaApi(`obtener-datos-comunidad/${editar}`));

                setTimeout(() => {
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
          if (r.ok) {
            const _datos = await r.json();

            return (datos.value = {
              ..._datos,
              cedula: _datos.cedula
                ? parseInt(_datos.cedula).toLocaleString("es-VE")
                : "",
            });
          } else
            setParams((p) => {
              p.delete("editar");
              return p;
            });
        }}
        onSubmit={() => toast.loading("Guardando...", { id: mensajeId })}
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
              id: datosComunidad.value.length
                ? datosComunidad.value[datosComunidad.value.length - 1].id + 1
                : 1,
            });

          toast.success(
            `Registro ${editar ? "actualizado" : "guardado"} correctamente`,
            { id: mensajeId }
          );
          contexto.datos.value = contexto.datosIniciales;
        }}
        onBadRequest={({ json }) => {
          if (json.mensaje) toast.error(json.mensaje, { id: mensajeId });
          else
            toast.error(
              `Error al ${editar ? "actualizar" : "guardar"} el registro`,
              { id: mensajeId }
            );
        }}
        onError={() => {
          toast.error(
            `Error del servidor al ${
              editar ? "actualizar" : "guardar"
            } el registro`,
            { id: mensajeId }
          );
        }}
      >
        <div class="grid grid-rows-[1fr_auto] gap-10 h-full max-h-full">
          <Campos />
          <Botones />
        </div>
      </Formulario>
    </Main>
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
    <div class="grid grid-cols-2 gap-5 h-full overflow-auto max-sm:col">
      <Input
        label="Nombres"
        campo="nombres"
        id="nombres"
        type="text"
        minlength={NOMBRE_MÍNIMO}
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
        descripcion={
          datos.value.fecha_nacimiento && (
            <i>{añosDesdeFecha(datos.value.fecha_nacimiento)} años</i>
          )
        }
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
    <div
      role="group"
      class={`${
        editar ? "max-[440px]:col max-[440px]:*:py-2!" : ""
      } grid grid-cols-2 gap-2 min-[440px]:m-auto max-[440px]:flex max-[440px]:justify-end max-[440px]:text-sm`}
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
  );
};

const cl =
  "bg-sky-100 dark:bg-sky-900 p-2 rounded-selector text-sky-900 dark:text-sky-100";

const Editando = (props: { id?: string }) => {
  if (!props.id) return null;

  const media = props.id && useMedia("(max-width: 550px)");

  const l = (
    <span>
      Editando el registro:{" "}
      <span class="ml-0.5">
        #<b>{props.id}</b>
      </span>
    </span>
  );

  return media.value ? (
    <Popover.Root>
      <Popover.Trigger
        class={`${cl} border border-sky-200 dark:border-sky-800 hover:bg-sky-200 dark:hover:bg-sky-700 transition-colors`}
      >
        <Iconos.Info />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="dropdown-content text-sm bg-sky-100! dark:bg-sky-800! text-sky-900 dark:text-sky-100 border-sky-200! dark:border-sky-800!"
          side="bottom"
          sideOffset={3}
          align="end"
          collisionPadding={10}
        >
          {l}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <small role="status" class={`flex gap-2 items-center mr-auto italic ${cl}`}>
      <Iconos.Info />
      {l}
    </small>
  );
};
