import type { JSX } from "preact/jsx-runtime";
import { DropdownMenu as Menu } from "radix-ui";
import Iconos from "~/componentes/iconos";

export default (props: { children: JSX.Element | string }) => (
  <Menu.SubTrigger class="dropdown-item gap-0!">
    <Iconos.FlechaDer class="size-6 transform-[rotate(180deg)_translate(3px,1px)]" />
    {props.children}
  </Menu.SubTrigger>
);
