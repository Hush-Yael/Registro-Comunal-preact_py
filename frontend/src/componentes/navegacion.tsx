import { sesion } from "..";
import Iconos from "./iconos";
import { Link, type LinkProps, useLocation } from "wouter-preact";

export default () =>
  sesion.value.usuario && (
    <nav class="flex items-center gap-3 bg-white dark:bg-neutral-700 p-1.5 px-2 rounded-md border border-neutral-200 dark:border-neutral-500 shadow-lg">
      <A href="/">
        <Iconos.Campo />
        Formulario
      </A>
      <A href="/usuarios">
        <Iconos.Personas class="size-6" />
        Usuarios
      </A>
      <A href="/registros">
        <Iconos.Registros />
        Registros
      </A>
    </nav>
  );

const A = (props: LinkProps) => {
  const [pathname] = useLocation();

  return (
    <Link
      {...props}
      // @ts-expect-error: sí existe
      class="flex items-center gap-2 aria-[current=page]:font-bold aria-[current=page]:bg-neutral-900 dark:aria-[current=page]:bg-neutral-100 aria-[current=page]:text-white aria-[current=page]:dark:text-neutral-900 rounded-lg p-1 px-2.5"
      aria-current={props.href === pathname ? "page" : null}
    >
      {props.children}
    </Link>
  );
};
