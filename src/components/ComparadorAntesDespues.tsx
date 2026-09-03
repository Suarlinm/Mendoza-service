"use client";

import { useState } from "react";

type Props = {
  imagenAntes: string;
  imagenDespues: string;
  titulo: string;
};

export default function ComparadorAntesDespues({
  imagenAntes,
  imagenDespues,
  titulo,
}: Props) {
  const [posicion, setPosicion] = useState(50);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-800 shadow-xl sm:aspect-[16/10] lg:aspect-[16/9]">
      {/* FOTO DESPUÉS */}
      <img
        src={imagenDespues}
        alt={`${titulo} después`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* FOTO ANTES */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${posicion}%`,
        }}
      >
        <img
          src={imagenAntes}
          alt={`${titulo} antes`}
          className="absolute left-0 top-0 h-full max-w-none object-cover"
          style={{
            width: `${10000 / posicion}%`,
          }}
        />
      </div>

      {/* ETIQUETA ANTES */}
      <div className="absolute left-3 top-3 z-20 rounded-full bg-black/75 px-3 py-2 text-xs font-bold text-white sm:left-5 sm:top-5 sm:px-4 sm:text-sm">
        BEFORE
      </div>

      {/* ETIQUETA DESPUÉS */}
      <div className="absolute right-3 top-3 z-20 rounded-full bg-yellow-500 px-3 py-2 text-xs font-bold text-black sm:right-5 sm:top-5 sm:px-4 sm:text-sm">
        AFTER
      </div>

      {/* LÍNEA */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 z-20 w-[3px] bg-white"
        style={{
          left: `${posicion}%`,
        }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-yellow-500 font-bold text-black shadow-xl sm:h-13 sm:w-13">
          ↔
        </div>
      </div>

      {/* SLIDER INVISIBLE */}
      <input
        type="range"
        min="1"
        max="99"
        value={posicion}
        onChange={(e) =>
          setPosicion(Number(e.target.value))
        }
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
        aria-label={`Comparar antes y después de ${titulo}`}
      />
    </div>
  );
}