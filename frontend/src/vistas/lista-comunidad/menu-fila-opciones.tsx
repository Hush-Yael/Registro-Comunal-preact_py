import { DropdownMenu } from "radix-ui";
import { useLocation } from "wouter-preact";
import {
  datosComunidad,
  generandoCarta,
  idARegistroSeleccionado,
  modalGenerarAbierto,
} from "~/constantes/lista-comunidad";
import Iconos from "~/componentes/iconos";
import type { JSX } from "preact/jsx-runtime";
import { rutaApi } from "~/lib";

export default (props: { children: JSX.Element }) => {
  const [, setLocation] = useLocation();

  return (
    <div class="wrapper-tabla-comunidad relative">
      <DropdownMenu.Root>
        {props.children}

        <DropdownMenu.Content
          side="top"
          class="dropdown-content flex-row! text-sm shadow-none!"
        >
          <DropdownMenu.Item
            class="dropdown-item"
            aria-label="Editar registro"
            onSelect={() =>
              setLocation(`/?editar=${idARegistroSeleccionado.current}`)
            }
          >
            <Iconos.Editar />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="dropdown-item"
            disabled={generandoCarta.value}
            aria-label="Generar carta"
            onSelect={() => (modalGenerarAbierto.value = true)}
          >
            <Iconos.Documento />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => eliminarRegistro(idARegistroSeleccionado.current)}
            class="dropdown-item"
            aria-label="Eliminar registro"
          >
            <Iconos.Eliminar />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

const eliminarRegistro = async (id: number) => {
  if (confirm("¿Realmente desea eliminar el registro?")) {
    const r = await fetch(rutaApi(`eliminar-registro-comunidad/${id}`), {
      method: "DELETE",
    });
    if (r.ok)
      datosComunidad.value = datosComunidad.value.filter((u) => u.id !== id);
  }
};
