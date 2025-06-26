import { JSX } from "preact/jsx-runtime";

export default (props: JSX.IntrinsicElements["svg"]) => (
  <svg
    {...props}
    class={`carga ${props.class || ""}`}
    viewBox="0 0 40 40"
    height="40"
    width="40"
  >
    <circle
      class="track"
      cx="20"
      cy="20"
      r="17.5"
      pathLength="100"
      stroke-width="5px"
      fill="none"
    />
    <circle
      class="car"
      cx="20"
      cy="20"
      r="17.5"
      pathLength="100"
      stroke-width="5px"
      fill="none"
    />
  </svg>
);
