import { effect } from "@preact/signals";
import useLocalStorage from "./useLocalStorage";
import useMedia from "./useMedia";

const HTML = document.documentElement,
  meta = document.querySelector("meta[name=theme-color]");

export type Tema = "claro" | "oscuro" | "sistema";

export default () => {
  const mediaMatched = useMedia("(prefers-color-scheme: dark)");
  const tema = useLocalStorage<Tema>({
    key: "tema",
    default: "sistema",
    validacion: (v) => ["claro", "oscuro", "sistema"].includes(v),
  });

  effect(() => {
    const oscuro =
      tema.value === "oscuro" ||
      (tema.value === "sistema" && mediaMatched.value);

    if (!oscuro) {
      HTML.removeAttribute("class");
      meta.setAttribute("content", "#fff");
    } else {
      HTML.classList.add("oscuro");
      meta.setAttribute("content", "#141414");
    }
  });

  return tema;
};
