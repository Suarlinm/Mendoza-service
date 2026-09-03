"use client";

import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type ImagenGaleria = {
  id: string;
  imagen_url: string;
  titulo: string;
  categoria: string;
};

type Props = {
  imagenes: ImagenGaleria[];
};

export default function GaleriaGeneral({
  imagenes,
}: Props) {
  const [
    seleccionada,
    setSeleccionada,
  ] = useState<number | null>(null);

  function cerrar() {
    setSeleccionada(null);
  }

  function anterior() {
    if (seleccionada === null) return;

    setSeleccionada(
      seleccionada === 0
        ? imagenes.length - 1
        : seleccionada - 1
    );
  }

  function siguiente() {
    if (seleccionada === null) return;

    setSeleccionada(
      seleccionada ===
        imagenes.length - 1
        ? 0
        : seleccionada + 1
    );
  }

  useEffect(() => {
    function teclado(
      e: KeyboardEvent
    ) {
      if (seleccionada === null) return;

      if (e.key === "Escape") {
        cerrar();
      }

      if (e.key === "ArrowLeft") {
        anterior();
      }

      if (e.key === "ArrowRight") {
        siguiente();
      }
    }

    window.addEventListener(
      "keydown",
      teclado
    );

    return () => {
      window.removeEventListener(
        "keydown",
        teclado
      );
    };
  }, [seleccionada]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imagenes.map(
          (imagen, index) => (
            <button
              key={imagen.id}
              type="button"
              onClick={() =>
                setSeleccionada(index)
              }
              className="group relative overflow-hidden rounded-2xl bg-gray-200 text-left"
            >
              <img
                src={imagen.imagen_url}
                alt={imagen.titulo}
                className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  {imagen.categoria}
                </p>

                <p className="mt-1 font-extrabold text-white">
                  {imagen.titulo}
                </p>
              </div>

              <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
                <ZoomIn size={20} />
              </div>
            </button>
          )
        )}
      </div>

      {seleccionada !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={cerrar}
        >
          <button
            type="button"
            onClick={cerrar}
            className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white hover:text-black"
          >
            <X size={26} />
          </button>

          <div
            className="flex max-h-full max-w-7xl flex-col items-center"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={
                imagenes[seleccionada]
                  .imagen_url
              }
              alt={
                imagenes[seleccionada]
                  .titulo
              }
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />

            <div className="mt-4 text-center">
              <p className="font-extrabold text-white">
                {
                  imagenes[seleccionada]
                    .titulo
                }
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {
                  imagenes[seleccionada]
                    .categoria
                }
              </p>
            </div>
          </div>

          {imagenes.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  anterior();
                }}
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black sm:left-6"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  siguiente();
                }}
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black sm:right-6"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white">
            {seleccionada + 1} /{" "}
            {imagenes.length}
          </div>
        </div>
      )}
    </>
  );
}