export type Usuario = {
  id: number;
  nombre: string;
  rol: string;
};

export type DatosComunidad = {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: number | string;
  fecha_nacimiento: string;
  patologia: string;
  direccion: string;
  numero_casa: string;
};
