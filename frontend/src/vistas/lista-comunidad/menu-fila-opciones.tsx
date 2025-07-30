import { DropdownMenu as Menu } from "radix-ui";
import { useLocation } from "wouter-preact";
import {
  datosComunidad,
  generandoCarta,
  idARegistroSeleccionado,
  modalGenerarAbierto,
} from "~/constantes/lista-comunidad";
import Iconos from "~/componentes/iconos";
import { rutaApi } from "~/lib";

export default (props: { id: number }) => {
  const [, setLocation] = useLocation();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Opciones del registro"
        class="relative z-0 h-6 w-5 btn p-0! bg-dark group-odd:bg-base border border-base hover:border-highlight hover:bg-darkest group-odd:hover:bg-dark"
      >
        <Iconos.Menu class="absolute m-auto h-full" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Content
          side="left"
          sideOffset={10}
          class="dropdown-content flex-row! text-sm"
        >
          <Menu.Item
            class="dropdown-item"
            aria-label="Editar registro"
            onSelect={() => setLocation(`/?editar=${props.id}`)}
          >
            <Iconos.Editar />
          </Menu.Item>
          <Menu.Item
            class="dropdown-item"
            disabled={generandoCarta.value}
            aria-label="Generar carta"
            onSelect={() => {
              idARegistroSeleccionado.current = props.id;
              modalGenerarAbierto.value = true;
            }}
          >
            <Iconos.Documento />
          </Menu.Item>
          <Menu.Item
            onSelect={() => eliminarRegistro(props.id)}
            class="dropdown-item"
            aria-label="Eliminar registro"
          >
            <Iconos.Eliminar />
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
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
