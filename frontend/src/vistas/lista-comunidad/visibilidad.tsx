import type { Table } from "@tanstack/react-table";
import { DropdownMenu as Menu } from "radix-ui";
import type { DatosComunidad } from "~/tipos";
import SubTrigger from "~/componentes/menu/subtrigger";
import Iconos from "~/componentes/iconos";

export default (props: { tabla: Table<DatosComunidad> }) => {
  return (
    <Menu.Sub>
      <SubTrigger>Columnas mostradas</SubTrigger>

      <Menu.Portal>
        <Menu.SubContent
          sideOffset={10}
          collisionPadding={10}
          class="dropdown-content max-[450px]:transform-[translateX(60%)]! max-[500px]:transform-[translateX(40%)]! text-sm"
          onSelect={(e) => e.preventDefault()}
        >
          <Menu.Group aria-label="Columnas">
            {props.tabla.getAllColumns().map(
              (c) =>
                c.getCanHide() && (
                  <Menu.CheckboxItem
                    class="dropdown-item group justify-between gap-7!"
                    checked={c.getIsVisible()}
                    onCheckedChange={() => c.toggleVisibility()}
                  >
                    {c.columnDef.header}
                    <Iconos.Ver class="text-muted size-4.5 group-[[data-state=unchecked]]:hidden!" />
                    <Iconos.Ocultar class="text-muted size-4.5 group-[[data-state=checked]]:hidden!" />
                  </Menu.CheckboxItem>
                )
            )}
          </Menu.Group>

          <hr class="border-t border-[hsl(0_0%_85)] dark:border-[hsl(0_0%_20%)]" />

          <Menu.Item
            class="dropdown-item justify-between gap-7!"
            onSelect={() => props.tabla.resetColumnVisibility()}
          >
            Mostrar todas
            <Iconos.Recargar class="text-muted size-4.5" />
          </Menu.Item>
        </Menu.SubContent>
      </Menu.Portal>
    </Menu.Sub>
  );
};
