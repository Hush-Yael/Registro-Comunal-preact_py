import { type Signal, useSignalEffect } from "@preact/signals";
import { useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

type ModalProps = JSX.IntrinsicElements["dialog"] & {
  titulo: JSX.Element | string;
  onClose?: () => void;
  onConfirm?: () => void;
  abierto?: Signal<boolean>;
  submitProps?: JSX.IntrinsicElements["button"];
};

export default (props: ModalProps) => {
  const modal = useRef<HTMLDialogElement>();

  if (props.abierto)
    useSignalEffect(() => {
      const m = modal.current;

      if (m && props.abierto.value) m.showModal();
      return () => m && m.close();
    });

  return (
    <dialog
      {...props}
      ref={modal}
      class="max-h-9/10 m-auto bg-base dark:border dark:border-base rounded-box open:animate-[aparecer_0.150s_ease-in-out] backdrop:bg-[#0002] dark:backdrop:bg-[#0009] open:backdrop:animate-[aparecer_0.150s_ease-in-out] shadow-xl dark:shadow-2xl"
      onClose={() => props.abierto && (props.abierto.value = false)}
      //   @ts-expect-error: no se debe pasar submitProps
      submitProps={null}
    >
      <div class={`flex flex-col gap-6 p-4 ${props.class || ""}`}>
        <h1 class="font-bold text-xl">{props.titulo}</h1>
        <div>{props.children}</div>
        <div class="grid grid-cols-2 ml-auto gap-2">
          <button
            class="btn btn-borde py-1! px-3!"
            onClick={() => {
              props.abierto && (props.abierto.value = false);
              props.onClose && props.onClose();
            }}
          >
            Cancelar
          </button>
          <button
            class="btn btn-primario py-1! px-3!"
            onClick={props.onConfirm}
            {...props.submitProps}
          >
            {props.submitProps.children || "Aceptar"}
          </button>
        </div>
      </div>
    </dialog>
  );
};
