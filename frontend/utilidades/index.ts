export const rutaApi = (ruta: string) =>
  `${location.origin.replace(/:\d+/, ":1144")}/api/${ruta}`;
