import type { Table } from "@tanstack/react-table";
import Iconos from "~/componentes/iconos";
import useMedia from "~/hooks/useMedia";
import { TablaDatos } from ".";
import { DropdownMenu, Popover } from "radix-ui";
import type { Virtualizer } from "@tanstack/react-virtual";

type PaginasProps<T extends TablaDatos> = {
  tabla: Table<T>;
  virtualizador: Virtualizer<Element, Element>;
  apodoFilas: string;
};

export default <T extends TablaDatos>(props: PaginasProps<T>) => (
  <div class="flex items-center justify-between gap-5 w-full -mb-2 p-2 px-3 rounded-box bg-dark border border-base text-muted text-sm">
    <div className="flex items-center gap-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="trigger-primario relative size-6 p-0! not-data-[state=open]:bg-darkest!">
          <Iconos.Menu class="trigger-puntos max-[450px]:transform-[scale(.8)]" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="dropdown-content text-sm"
            align="start"
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenu.Item
              class="dropdown-item after:content-['...'] after:-ml-1.75"
              onSelect={() => cambiarLimite(props)}
            >
              Establecer límite de {props.apodoFilas || "filas"}{" "}
              <span class="sr-only">por página:</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              class="dropdown-item"
              onSelect={() => irAlRegistro(props)}
            >
              Ir al registro número...
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Cantidad
        {...props}
        pageSize={props.tabla.getState().pagination.pageSize}
      />
    </div>
    <div
      role="group"
      class="flex items-center gap-1.5 [&_svg]:size-5! [&_button]:rounded-field [&_button]:not-disabled:hover:bg-base [&_button]:not-disabled:focus-visible:bg-base"
      aria-label="Navegación de las páginas"
    >
      <button
        onClick={props.tabla.firstPage}
        aria-label="Ir a la primera página"
        disabled={!props.tabla.getCanPreviousPage()}
      >
        <Iconos.FlechaDerUltimo class="transform-[rotate(180deg)]" />
      </button>
      <button
        onClick={props.tabla.previousPage}
        aria-label="Ir a la página anterior"
        disabled={!props.tabla.getCanPreviousPage()}
      >
        <Iconos.FlechaDer class="transform-[rotate(180deg)]" />
      </button>

      <input
        class="bg-base border border-base rounded-field px-2 max-w-[6ch]"
        aria-label="Ir a la página número:"
        type="number"
        min="1"
        id="page"
        max={props.tabla.getPageCount()}
        required
        value={props.tabla.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).valueAsNumber;
          const page = v ? v - 1 : 0;

          props.tabla.setPageIndex(page);
        }}
      />

      <button
        onClick={props.tabla.nextPage}
        aria-label="Ir a la siguiente página"
        disabled={!props.tabla.getCanNextPage()}
      >
        <Iconos.FlechaDer />
      </button>
      <button
        onClick={props.tabla.lastPage}
        aria-label="Ir a la última página"
        disabled={!props.tabla.getCanNextPage()}
      >
        <Iconos.FlechaDerUltimo />
      </button>

      <hr
        aria-orientation="vertical"
        class="w-[1px] mx-1.5 h-3 border-0 bg-[hsl(0_0%_85%)] dark:bg-[hsl(0_0%_30%)]"
      />

      <div
        class="max-[400px]:text-xs"
        style={{ wordSpacing: ".125em" }}
        role="status"
      >
        <span className="sr-only">Página</span>
        {props.tabla.getState().pagination.pageIndex + 1} de{" "}
        {props.tabla.getPageCount()}
      </div>
    </div>
  </div>
);

const cambiarLimite = <T extends TablaDatos>(props: PaginasProps<T>) => {
  const nuevoLimite = Number(
    prompt(
      `Límite de ${props.apodoFilas || "filas"} por página:`,
      props.tabla.getState().pagination.pageSize.toString()
    )
  );

  props.tabla.setPageSize(
    Number.isInteger(nuevoLimite) && nuevoLimite > 0
      ? nuevoLimite
      : props.tabla.getState().pagination.pageSize
  );
};

const media = useMedia("(max-width: 600px)");

const Cantidad = <T extends TablaDatos>(
  props: PaginasProps<T> & { pageSize: number }
) => {
  const l = `${props.tabla.getRowCount()} ${props.apodoFilas || "filas"} - ${
    props.pageSize
  } por página`;

  return media.value ? (
    <Popover.Root>
      <Popover.Trigger>
        <Iconos.Info class="size-5 max-[450px]:size-4!" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="dropdown-content text-sm"
          side="bottom"
          sideOffset={5}
        >
          {l}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <span role="status">{l}</span>
  );
};

const irAlRegistro = <T extends TablaDatos>(
  props: Omit<PaginasProps<T>, "apodoFilas">
) => {
  let n = parseInt(prompt("Indique el índice del registro a buscar:")) - 1;

  if (isNaN(n) || n < 0) return;
  else if (n > props.tabla.getRowCount()) n = props.tabla.getRowCount() - 1;

  const limiteFilas = props.tabla.getState().pagination.pageSize,
    paginaActual = props.tabla.getState().pagination.pageIndex;

  const paginasAdelante = Math.floor(n / limiteFilas),
    paginasAtras = paginasAdelante - paginaActual;

  // Si se busca una fila en una página adelante o atrás de la actual, se cambia a esa página
  if (paginasAdelante > 0 || paginasAtras < 0) {
    props.tabla.setPagination((p) => ({
      ...p,
      pageIndex:
        paginasAdelante > 0 ? paginasAdelante : paginaActual + paginasAtras,
    }));

    // el índice se reinicia al cambiar de página, se debe calcular en relación al nuevo orden
    n = n - paginasAdelante * limiteFilas;
  }

  props.virtualizador.scrollToIndex(n);

  setTimeout(() => {
    const fila = document.querySelector(`[data-index="${n}"]`);

    if (fila) {
      fila?.scrollIntoView({
        block: "center",
        inline: "start",
      });

      // esperar el scroll
      setTimeout(() => {
        fila.animate(
          [
            {
              background: "var(--primary)",
              color: "var(--bg-base)",
            },
            {
              background: "var(--bg-base)",
              color: "var(--text-base)",
            },
          ],
          {
            duration: 600,
            easing: "ease",
            iterations: 2,
          }
        );
      }, 100);
    }
  }, 200);
};
