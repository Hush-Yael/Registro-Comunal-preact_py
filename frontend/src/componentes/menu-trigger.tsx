import { DropdownMenu as Menu } from "radix-ui";
import Iconos from "./iconos";
import type { JSX } from "preact/jsx-runtime";

export default (props: JSX.IntrinsicElements["button"]) => (
  <Menu.Trigger
    {...props}
    class={`relative list-none btn p-0! cursor-pointer ${props.class || ""}`}
  >
    <Iconos.Menu class="absolute m-auto h-full" />
  </Menu.Trigger>
);
