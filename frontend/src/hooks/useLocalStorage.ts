import { useEffect, useState } from "preact/hooks";

export default <T>(params: {
  key: string;
  default: T;
  // eslint-disable-next-line no-unused-vars
  validacion?: (val: T) => boolean;
}) => {
  const [valor, setValor] = useState<T>(
    JSON.parse(localStorage.getItem(params.key)) || params.default
  );

  if (params.validacion && !params.validacion(valor)) setValor(params.default);

  useEffect(() => {
    localStorage.setItem(params.key, JSON.stringify(valor));
  }, [valor]);

  return [valor, setValor] as const;
};
