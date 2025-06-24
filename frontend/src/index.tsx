import './style.css';
import { render } from 'preact';
import { signal } from '@preact/signals';
import { LocationProvider, ErrorBoundary, Router, Route, useLocation } from 'preact-iso';
import { ContextoSesion } from './contexto/sesion';

import RegistroComunidad from "./vistas/registro-comunidad";
import Login from "./vistas/login";
import RegistroUsuarios from "./vistas/registro-usuarios";
import RegistrosComunidad from "./vistas/registros-comunidad";
import Usuarios from "./vistas/lista-usuarios";

export function App() {
	const sesion = signal({
		"usuario": "",
		rol: ""
	})

	return (
		<LocationProvider>
			<ErrorBoundary>
				<ContextoSesion value={sesion}>
					<main>
						{!sesion.value.usuario ?
							<Router>
								<Route path="/registro" component={RegistroUsuarios} />
								<Route path="*" component={Login} />
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
				</ContextoSesion>
			</ErrorBoundary>
		</LocationProvider >
	);
}

render(<App />, document.getElementById('app'));
