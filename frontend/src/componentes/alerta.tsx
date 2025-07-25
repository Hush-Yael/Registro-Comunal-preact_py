import Iconos from "~/componentes/iconos";
import Carga from "~/componentes/carga";

const FONDOS = {
  éxito: "bg-emerald-100 dark:bg-emerald-700",
  carga: "bg-darkest",
};

const BORDES = { éxito: "bg-emerald-500", carga: "bg-neutral-500" };

const ICONOS = {
  éxito: () => (
    <Iconos.Check class="size-6 text-emerald-600 dark:text-emerald-200" />
  ),
  carga: () => <Carga class="size-5 mx-1" />,
};

export default (props: { texto: string; variante: string; visible: boolean }) =>
  props.visible && (
    <p
      class={`flex items-center gap-2.5 p-2 px-3 rounded-selector text-center animate-[aparecer_0.2s_ease-in-out] ${
        FONDOS[props.variante]
      }`}
      role="alert"
    >
      <span
        class={`rounded-selector h-full min-h-[30px] w-1 ${
          BORDES[props.variante]
        }`}
      ></span>
      <span class="flex items-center gap-2 font-medium">
        {ICONOS[props.variante]()}
        {props.texto}
      </span>
    </p>
  );
