"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";

type Imagen = {
  id: number;
  imagen_url: string;
  orden: number;
};

type Props = {
  imagenes: Imagen[];
  titulo: string;
};

export default function ProyectoGaleria({
  imagenes,
  titulo,
}: Props) {
  const [imagenSeleccionada, setImagenSeleccionada] =
    useState<number | null>(null);

  function cerrarImagen() {
    setImagenSeleccionada(null);
  }

  function imagenAnterior() {
    if (imagenSeleccionada === null) return;

    setImagenSeleccionada(
      imagenSeleccionada === 0
        ? imagenes.length - 1
        : imagenSeleccionada - 1
    );
  }

  function imagenSiguiente() {
    if (imagenSeleccionada === null) return;

    setImagenSeleccionada(
      imagenSeleccionada === imagenes.length - 1
        ? 0
        : imagenSeleccionada + 1
    );
  }

  useEffect(() => {
    function teclado(e: KeyboardEvent) {
      if (imagenSeleccionada === null) return;

      if (e.key === "Escape") {
        cerrarImagen();
      }

      if (e.key === "ArrowLeft") {
        imagenAnterior();
      }

      if (e.key === "ArrowRight") {
        imagenSiguiente();
      }
    }

    window.addEventListener("keydown", teclado);

    return () => {
      window.removeEventListener("keydown", teclado);
    };
  }, [imagenSeleccionada]);

  return (
    <>
      {/* GALERÍA */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imagenes.map((imagen, index) => (
          <button
            key={imagen.id}
            type="button"
            onClick={() => setImagenSeleccionada(index)}
            className="group relative overflow-hidden rounded-2xl bg-gray-200 text-left shadow-sm"
            aria-label={`Ver fotografía ${index + 1} en grande`}
          >
            <img
              src={imagen.imagen_url}
              alt={`${titulo} - fotografía ${index + 1}`}
              className="h-64 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-72"
            />

            {/* INDICADOR DE ZOOM */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
              <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn size={23} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* VISOR GRANDE */}
      {imagenSeleccionada !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={cerrarImagen}
        >
          {/* CERRAR */}
          <button
            type="button"
            onClick={cerrarImagen}
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-black sm:right-6 sm:top-6"
            aria-label="Cerrar fotografía"
          >
            <X size={26} />
          </button>

          {/* FOTO */}
          <div
            className="flex max-h-full max-w-7xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagenes[imagenSeleccionada].imagen_url}
              alt={`${titulo} - fotografía ${
                imagenSeleccionada + 1
              }`}
              className="max-h-[82vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>

          {/* ANTERIOR */}
          {imagenes.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                imagenAnterior();
              }}
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white hover:text-black sm:left-6 sm:h-14 sm:w-14"
              aria-label="Fotografía anterior"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* SIGUIENTE */}
          {imagenes.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                imagenSiguiente();
              }}
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white hover:text-black sm:right-6 sm:h-14 sm:w-14"
              aria-label="Fotografía siguiente"
            >
              <ChevronRight size={30} />
            </button>
          )}

          {/* CONTADOR */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white">
            {imagenSeleccionada + 1} / {imagenes.length}
          </div>
        </div>
      )}
    </>
  );
}