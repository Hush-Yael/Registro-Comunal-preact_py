import { ComponentChildren } from "preact";

export default (props: { titulo: string; children?: ComponentChildren }) => (
  <header class="flex justify-between items-center gap-15 w-full">
    <div class="col gap-2">
      <h1 class="font-bold text-xl">{props.titulo}</h1>
      <h2 class="text-neutral-500">Comunidad Santo Domingo de Guzmán</h2>
    </div>
    {props.children}
  </header>
);
