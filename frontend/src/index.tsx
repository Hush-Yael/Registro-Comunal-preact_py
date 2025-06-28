import "./style.css";
import { render } from "preact";
import { signal } from "@preact/signals";
import { Router, Route, Redirect, Switch } from "wouter-preact";

import Login_Registro from "./vistas/login-registro";
import RegistroComunidad from "./vistas/registro-comunidad";
import ListaComunidad from "./vistas/lista-comunidad";
import ListaUsuarios from "./vistas/lista-usuarios";
import Navegacion from "./componentes/navegacion";

export const sesion = signal({
  usuario: "",
  rol: "",
});

export function App() {
	return (
    <>
        <Navegacion />
        <main class="col p-4 mx-auto py-5 px-6 rounded-xl border border-neutral-200 bg-white shadow-lg">
          {!sesion.value.usuario ? (
							<Router>
            <Route component={Login_Registro} />
							</Router>
        ) : (
							<Router>
            <Switch>
								<Route path="/" component={RegistroComunidad} />
              <Route
                path="/login"
                component={() => <Redirect to="/" replace />}
              />
              <Route
                path="/registro"
                component={() => <Redirect to="/" replace />}
              />
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
