import "./style.css";
import { render } from "preact";
import { signal } from "@preact/signals";
import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  useLocation,
} from "preact-iso";

import Login_Registro from "./vistas/login-registro";
import RegistroComunidad from "./vistas/registro-comunidad";
import RegistroUsuarios from "./vistas/registro-usuarios";
import RegistrosComunidad from "./vistas/registros-comunidad";
import ListaUsuarios from "./vistas/lista-usuarios";
import Navegacion from "./componentes/navegacion";

export const sesion = signal({
  usuario: "",
  rol: "",
});

export function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
        <Navegacion />
        <main class="col p-4 mx-auto py-5 px-6 rounded-xl border border-neutral-200 bg-white shadow-lg">
          {!sesion.value.usuario ? (
            // @ts-expect-error
							<Router>
              <Route default component={Login_Registro} />
							</Router>
							:
							<Router>
								<Route path="/" component={RegistroComunidad} />
								{/* @ts-ignore */}
								<Route path="/login" component={() => useLocation().route('/', true)} />
								{/* @ts-ignore */}
								<Route path="/registro" component={() => useLocation().route('/', true)} />
								<Route path="/usuarios" component={Usuarios} />
								<Route path="/registros" component={RegistrosComunidad} />
								{/* @ts-ignore */}
								<Route path="*" component={() => useLocation().route('/', true)} />
							</Router>
						}
					</main>
			</ErrorBoundary>
    </LocationProvider>
	);
}

render(<App />, document.getElementById("app"));
