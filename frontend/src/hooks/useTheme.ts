import useLocalStorage from "./useLocalStorage";
import useMedia from "./useMedia";
import { useEffect } from "preact/hooks";

const HTML = document.documentElement,
  meta = document.querySelector("meta[name=theme-color]");

export type Tema = "claro" | "oscuro" | "sistema";

export default () => {
  const [mediaMatched] = useMedia("(prefers-color-scheme: dark)");
  const [tema, setTema] = useLocalStorage<Tema>({
    key: "tema",
    default: "sistema",
    validacion: (v) => ["claro", "oscuro", "sistema"].includes(v),
  });

  useEffect(() => {
    const oscuro = tema === "oscuro" || (tema === "sistema" && mediaMatched);

    if (!oscuro) {
      HTML.removeAttribute("class");
      meta.setAttribute("content", "#fff");
    } else {
      HTML.classList.add("oscuro");
      meta.setAttribute("content", "#141414");
    }
  }, [tema, mediaMatched]);

  return [tema, setTema, mediaMatched] as const;
};
