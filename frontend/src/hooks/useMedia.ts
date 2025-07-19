import { useState } from "preact/hooks";

export default (query: string) => {
  const media = window.matchMedia(query);
  const [mediaMatched, setMediaMatched] = useState(media.matches);

  media.addEventListener
    ? media.addEventListener("change", () => setMediaMatched(media.matches))
    : media.addListener(() => setMediaMatched(media.matches));

  return [mediaMatched, setMediaMatched] as const;
};
