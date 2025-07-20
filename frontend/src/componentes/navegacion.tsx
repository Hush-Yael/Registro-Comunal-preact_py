import { sesion } from "..";
import Iconos from "./iconos";
import { Link, type LinkProps, useLocation } from "wouter-preact";

export default () =>
  sesion.value.usuario && (
    <nav class="flex items-center gap-3 bg-base p-2 px-3 rounded-box border border-base shadow-lg">
      <A href="/">
        <Iconos.Campo />
        <span class="max-sm:sr-only max-sm:text-sm">Formulario</span>
      </A>
      <A href="/usuarios">
        <Iconos.Personas class="size-6" />
        <span class="max-sm:sr-only max-sm:text-sm">Usuarios</span>
      </A>
      <A href="/registros">
        <Iconos.Registros />
        <span class="max-sm:sr-only max-sm:text-sm">Registros</span>
      </A>
    </nav>
  );

const A = (props: LinkProps) => {
  const [pathname] = useLocation();

  return (
    <Link
      {...props}
      // @ts-expect-error: sí existe
      class="group btn aria-[current=page]:font-bold hover:bg-darkest"
      aria-current={props.href === pathname ? "page" : null}
    >
      {props.children}
    </Link>
  );
};
