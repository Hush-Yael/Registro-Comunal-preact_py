import { descarga, rutaApi } from "~/lib";
import Opcion from "~/componentes/opcion";
import Modal from "~/componentes/modal";
import useLocalStorage from "~/hooks/useLocalStorage";
import { generandoCarta, modalGenerarAbierto } from "./contantes";
import Iconos from "~/componentes/iconos";

export const idAGenerar = { current: -1 };

export default () => {
  const documento = useLocalStorage<{
    tipo: "docx" | "pdf";
    base: "plantilla" | "residencia" | "mortem";
  }>({
    key: "documento",
    default: {
      tipo: "pdf",
      base: "residencia",
    },
    validacion: (v) =>
      (v.tipo === "pdf" || v.tipo === "docx") &&
      (v.base === "residencia" ||
        v.base === "mortem" ||
        v.base === "plantilla"),
  });

  const generarReporte = async () => {
    if (generandoCarta.value) return;

    modalGenerarAbierto.value = false;
    generandoCarta.value = true;

    const tiempo_ = prompt(
      "Indique el tiempo de residencia del individuo: (ejemplo: 3 meses)"
    );

    try {
      const r = await fetch(rutaApi("generar-carta"), {
        method: "POST",
        body: JSON.stringify({
          id: idAGenerar.current,
          tipo_documento: documento.value.tipo,
          tipo_carta: documento.value.base,
          tiempo_,
          hoy: new Date().toLocaleDateString("es-VE", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (r.ok)
        descarga(
          r,
          `${
            documento.value.base === "plantilla" ? "plantilla" : "constancia"
          }.${documento.value.tipo}`
        );
      else {
        alert(await r.text());
      }
    } catch (error) {
      alert(
        "No se pudo generar el reporte debido a un error interno del servidor"
      );
      console.error(error);
    } finally {
      idAGenerar.current = undefined;
      generandoCarta.value = false;
    }
  };

  return (
    <Modal
      titulo="Generar carta"
      class="max-w-[700px]"
      abierto={modalGenerarAbierto}
      submitProps={{
        onClick: generarReporte,
        children: "Generar",
      }}
    >
      <div className="col gap-6 overflow-auto max-sm:max-h-[60vh]">
        <form class="col gap-2">
          <h2>Seleccione el tipo de documento:</h2>
          <div class="grid grid-cols-2 gap-3 *:h-full max-sm:col">
            <Opcion
              id="pdf"
              type="radio"
              checked={
                documento.value.tipo === "pdf" &&
                documento.value.base !== "plantilla"
              }
              name="tipo-documento"
              disabled={documento.value.base === "plantilla"}
              onChange={() =>
                (documento.value = { ...documento.value, tipo: "pdf" })
              }
              titulo={
                <>
                  Documento PDF <Iconos.PDF class="size-11" />
                </>
              }
            >
              Ideal para preservar el formato original de la carta
            </Opcion>

            <Opcion
              id="word"
              name="tipo-documento"
              type="radio"
              checked={
                documento.value.tipo === "docx" ||
                documento.value.base === "plantilla"
              }
              onChange={() =>
                (documento.value = { ...documento.value, tipo: "docx" })
              }
              titulo={
                <>
                  Documento de Word (.docx){" "}
                  <Iconos.Word class="size-10 min-size-max" />
                </>
              }
            >
              Idéntico al documento PDF, pero con la posibilidad de editarlo
            </Opcion>
          </div>
        </form>
        <form class="col gap-2">
          <h2>Seleccione el tipo de carta:</h2>
          <div class="grid grid-cols-2 gap-3 *:h-full max-sm:col">
            <Opcion
              type="radio"
              id="plantilla"
              name="base-documento"
              titulo={
                <>
                  Plantilla con datos <Iconos.Plantilla />
                </>
              }
              onChange={() =>
                (documento.value = { ...documento.value, base: "plantilla" })
              }
              checked={documento.value.base === "plantilla"}
            >
              Contiene las imágenes, el mensaje de apertura, los campos para las
              firmas y datos, y la fecha de expedición. Lo demás se debe
              realizar manualmente
            </Opcion>
            <Opcion
              type="radio"
              id="residencia"
              name="base-documento"
              titulo={
                <>
                  Constancia de residencia <Iconos.Casa />
                </>
              }
              onChange={() =>
                (documento.value = { ...documento.value, base: "residencia" })
              }
              checked={documento.value.base === "residencia"}
            >
              Todo lo de la plantilla, con los datos de la persona ordenados.
              Opcionalmente se indica el tiempo de residencia
            </Opcion>
            <Opcion
              type="radio"
              id="mortem"
              name="base-documento"
              titulo={
                <>
                  Constancia post-mortem <Iconos.Tumba />
                </>
              }
              onChange={() =>
                (documento.value = { ...documento.value, base: "mortem" })
              }
              checked={documento.value.base === "mortem"}
            >
              Todo lo de la plantilla, con los datos de la persona ordenados.
              Opcionalmente se indica el tiempo que vivió en la comunidad
            </Opcion>
          </div>
        </form>
      </div>
    </Modal>
  );
};
