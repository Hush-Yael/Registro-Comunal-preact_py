import { signal } from "@preact/signals";

export default (query: string) => {
  const media = window.matchMedia(query);
  const mediaMatched = signal(media.matches);

  media.addEventListener
    ? media.addEventListener(
        "change",
        () => (mediaMatched.value = media.matches)
      )
    : media.addListener(() => (mediaMatched.value = media.matches));

  return mediaMatched;
};
