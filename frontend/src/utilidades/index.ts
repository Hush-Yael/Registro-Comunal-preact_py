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
