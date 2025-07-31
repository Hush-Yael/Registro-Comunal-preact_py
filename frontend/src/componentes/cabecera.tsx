import { ComponentChildren } from "preact";

export default (props: { titulo: string; children?: ComponentChildren }) => (
  <header class="flex justify-between items-center gap-15 w-full max-sm:gap-7">
    <div class="col gap-1">
      <h1 class="font-bold text-xl max-sm:text-lg">{props.titulo}</h1>
      <h2 class="text-muted max-sm:text-sm">
        Comunidad Santo Domingo de Guzmán
      </h2>
    </div>
    {props.children}
  </header>
);
