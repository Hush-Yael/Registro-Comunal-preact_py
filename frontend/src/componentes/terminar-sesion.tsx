import { sesion } from "..";
import Iconos from "../componentes/iconos";

export default () => {
  return (
    <button
      class="btn btn-secundario"
      onClick={() => (sesion.value = { usuario: "", rol: "" })}
    >
      <Iconos.Salir class="size-6" />
      <span>Terminar sesión</span>
    </button>
  );
};
