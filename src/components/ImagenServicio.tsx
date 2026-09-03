"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
};

export default function ImagenServicio({
  src,
  alt,
}: Props) {
  const [abierta, setAbierta] =
    useState(false);

  const [montado, setMontado] =
    useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    function cerrarConEscape(
      evento: KeyboardEvent
    ) {
      if (evento.key === "Escape") {
        setAbierta(false);
      }
    }

    if (abierta) {
      document.addEventListener(
        "keydown",
        cerrarConEscape
      );

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        cerrarConEscape
      );

      document.body.style.overflow = "";
    };
  }, [abierta]);

  return (
    <>
      {/* IMAGEN PEQUEÑA */}
      <button
        type="button"
        onClick={() => setAbierta(true)}
        className="block h-full w-full cursor-zoom-in"
        aria-label={`Ampliar imagen de ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </button>

      {/* VISOR FUERA DE LA TARJETA */}
      {montado &&
        abierta &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 md:p-8"
            onClick={() =>
              setAbierta(false)
            }
          >
            <div
              className="relative flex w-full max-w-[760px] flex-col items-center"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              {/* CERRAR */}
              <button
                type="button"
                onClick={() =>
                  setAbierta(false)
                }
                className="absolute right-0 top-0 z-10 flex h-11 w-11 -translate-y-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-yellow-500"
                aria-label="Cerrar imagen"
              >
                <X size={23} />
              </button>

              {/* IMAGEN GRANDE */}
              <div className="flex w-full items-center justify-center rounded-2xl bg-black/30 p-2">
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>

              <p className="mt-3 text-center text-sm font-semibold text-white">
                {alt}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}