import { JSX } from "preact/jsx-runtime";

export default (props: JSX.IntrinsicElements["main"]) => (
  <main
    class={`col p-4 mx-auto py-5 px-6 rounded-box border border-base bg-base shadow-lg max-w-full h-full max-h-full overflow-auto first:row-span-2 first:h-max first:m-auto ${
      props.class || ""
    }`}
  >
    {props.children}
  </main>
);
