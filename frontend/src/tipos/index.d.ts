export type Usuario = {
  id: number;
  nombre: string;
  rol: string;
};

export type DatosComunidad = {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: number | string | null;
  fecha_nacimiento: string;
  edad?: number | null;
  patologia: string;
  direccion: string;
  numero_casa: string;
};
