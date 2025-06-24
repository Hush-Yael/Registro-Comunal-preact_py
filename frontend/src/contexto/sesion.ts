import { createContext } from "preact";
import { Signal } from "@preact/signals";

export const ContextoSesion = createContext<Signal<{ usuario: string, rol: string }>>(undefined);