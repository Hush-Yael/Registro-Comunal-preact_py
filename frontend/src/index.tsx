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

export const sesion = signal({
  usuario: "",
  rol: "",
});

const tema = useTheme();

export function App() {
  return (
    <>
      <select
        id="tema"
        class="absolute right-4 top-4 input w-fit! shadow cursor-pointer"
        value={tema.value}
        onChange={(e) => {
          const valor = (e.target as HTMLSelectElement).value;
          tema.value = valor as Tema;
        }}
      >
        <option value="oscuro">Tema oscuro</option>
        <option value="claro">Tema claro</option>
        <option value="sistema">Tema del sistema</option>
      </select>
      <Navegacion />
      <main class="col p-4 mx-auto py-5 px-6 rounded-box border border-base bg-base shadow-lg max-h-[85%] max-w-[95%]">
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
      </main>
    </>
  );
}

render(<App />, document.getElementById("app"));
