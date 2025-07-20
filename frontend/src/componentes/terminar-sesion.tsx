import { sesion } from "..";
import Iconos from "../componentes/iconos";

export default () => {
  return (
    <button
      class="btn btn-secundario max-sm:mb-auto"
      onClick={() => (sesion.value = { usuario: "", rol: "" })}
    >
      <Iconos.Salir class="size-6" />
      <span class="max-sm:sr-only">Terminar sesión</span>
    </button>
  );
};
