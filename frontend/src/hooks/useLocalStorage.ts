import { signal, effect } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

type Params<T> = {
  key: string;
  default: T;
  // eslint-disable-next-line no-unused-vars
  validacion?: (val: T) => boolean;
};

export default <T>(params: Params<T>) => {
  const valor = signal<T>(
    JSON.parse(localStorage.getItem(params.key)) || params.default
  );

  if (params.validacion && !params.validacion(valor.value))
    valor.value = params.default;

  effect(() => {
    localStorage.setItem(params.key, JSON.stringify(valor));
  });

  return valor;
};

export const useLocalStorageState = <T>(params: Params<T>) => {
  const [valor, setValor] = useState<T>(
    JSON.parse(localStorage.getItem(params.key)) || params.default
  );

  if (params.validacion && !params.validacion(valor)) setValor(params.default);

  useEffect(() => {
    localStorage.setItem(params.key, JSON.stringify(valor));
  }, [valor]);

  return [valor, setValor] as const;
};
