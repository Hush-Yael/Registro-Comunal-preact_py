import "./style.css";
import { render } from "preact";
import { signal } from "@preact/signals";
import { Router, Route, Redirect, Switch } from "wouter-preact";

import Login from "./vistas/login";
import RegistroUsuarios from "./vistas/registro-usuarios";
import RegistroComunidad from "./vistas/registro-comunidad";
import ListaComunidad from "./vistas/lista-comunidad";
import ListaUsuarios from "./vistas/lista-usuarios";
import Navegacion from "./componentes/navegacion";
import useTheme, { type Tema } from "~/hooks/useTheme";
import { Select } from "radix-ui";
import Iconos from "./componentes/iconos";
import { Toaster } from "sonner";

export const sesion = signal({
  usuario: "",
  rol: "",
});

const tema = useTheme();

export function App() {
  return (
    <>
      <Navegacion />
      {!sesion.value.usuario ? (
        <Router>
          <Switch>
            <Route path="/registro" component={RegistroUsuarios as any} />
            <Route component={Login} />
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route path="/" component={RegistroComunidad} />
            <Route
              path="/login"
              component={() => <Redirect to="/" replace />}
            />
            <Route path="/registro" component={RegistroUsuarios as any} />
            <Route path="/usuarios" component={ListaUsuarios} />
            <Route path="/registros" component={ListaComunidad} />
            <Route component={() => <Redirect to="/ " replace />} />
          </Switch>
        </Router>
      )}
      <SelectTema />
      <Toaster
        theme={
          tema.value === "oscuro"
            ? "dark"
            : tema.value === "claro"
            ? "light"
            : "system"
        }
        richColors
        toastOptions={{
          classNames: {
            toast:
              "font-[Sora] p-3 gap-2.5 not-[[data-type]]:bg-primary text-[var(--bg-base)] data-[type=loading]:bg-primary",
            error: "bg-red-500 text-white",
            success: "bg-green-400 text-[var(--bg-base)] text-green-950",
          },
        }}
      />
      <span
        class="fixed bottom-1 left-3 text-muted text-xs tabular-nums -z-1"
        role="status"
      >
        {import.meta.env.VITE_APP_VERSION}{" "}
        {import.meta.env.DEV ? "<dev>" : "<prod>"}
      </span>
    </>
  );
}

const IconoTema = () => {
  switch (tema.value) {
    case "claro":
      return <Iconos.Sol />;
    case "oscuro":
      return <Iconos.Luna />;
    case "sistema":
      return <Iconos.Monitor />;
  }
};

const SelectTema = () => (
  <Select.Root
    value={tema.value}
    onValueChange={(v) => (tema.value = v as Tema)}
  >
    <Select.Trigger class="absolute right-4 top-4 flex items-center p-1.5 w-fit! bg-base border border-base rounded-field shadow cursor-pointer">
      <Select.Value class="sr-only" />
      <IconoTema />
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        class="group/content z-1"
        position="popper"
        side="bottom"
        sideOffset={5}
      >
        <Select.Viewport class="dropdown-content">
          <Select.Item class="dropdown-check" value="claro">
            <Iconos.Sol class="opacity-75 size-5" />
            <Select.ItemText>Tema claro</Select.ItemText>
          </Select.Item>

          <Select.Item class="dropdown-check" value="oscuro">
            <Iconos.Luna class="opacity-75 size-5" />
            <Select.ItemText>Tema oscuro</Select.ItemText>
          </Select.Item>

          <Select.Item class="dropdown-check" value="sistema">
            <Iconos.Monitor class="opacity-75 size-5" />
            <Select.ItemText>Tema del sistema</Select.ItemText>
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

render(<App />, document.getElementById("app"));
