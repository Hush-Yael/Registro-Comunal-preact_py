export const rutaApi = (ruta: string) =>
  `${location.protocol}//${
    // es la propia máquina, se usa 127.0.0.1, ya que ese es el backend
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "127.0.0.1:1144"
      : // se está corriendo en otro dispositivo: se usa la ip de la máquina donde se ejecuta el backend
        location.hostname + ":1144"
  }/api/${ruta}`;

export const descarga = async (r: Response, nombre: string) => {
  const url = URL.createObjectURL(await r.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = nombre;
  link.click();
  URL.revokeObjectURL(url);
};

export const normalizarString = (s: string) => {
  return s
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const comparacionInsensitiva = (
  s1: string,
  s2: string,
  fn: "startsWith" | "endsWith" | "includes" = "includes"
) => normalizarString(s1)[fn](normalizarString(s2));

export const añosDesdeFecha = (fechaNacimiento: string) => {
  const fecha = new Date(fechaNacimiento);
  if (fecha.toString() === "Invalid Date") return false;

  fecha.setHours(0, 0, 0, 0);
  const diferencia = Date.now() - fecha.getTime();
  const fechaEdad = new Date(diferencia);
  return Math.abs(fechaEdad.getUTCFullYear() - 1970);
};
