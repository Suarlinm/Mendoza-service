import {
  Brush,
  CookingPot,
  Bath,
  PanelsTopLeft,
  House,
  Hammer,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import ImagenServicio from "@/components/ImagenServicio";

type Servicio = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  activo: boolean;
  orden: number;
};

function obtenerIcono(titulo: string) {
  const nombre = titulo.toLowerCase();

  if (
    nombre.includes("painting") ||
    nombre.includes("pintura")
  ) {
    return Brush;
  }

  if (
    nombre.includes("kitchen") ||
    nombre.includes("cocina")
  ) {
    return CookingPot;
  }

  if (
    nombre.includes("bathroom") ||
    nombre.includes("baño")
  ) {
    return Bath;
  }

  if (
    nombre.includes("drywall") ||
    nombre.includes("tablaroca")
  ) {
    return PanelsTopLeft;
  }

  if (
    nombre.includes("home") ||
    nombre.includes("house") ||
    nombre.includes("casa") ||
    nombre.includes("remodeling") ||
    nombre.includes("remodelación")
  ) {
    return House;
  }

  if (
    nombre.includes("repair") ||
    nombre.includes("reparación")
  ) {
    return Wrench;
  }

  return Hammer;
}

export default async function Servicios() {
  const { data, error } = await supabase
    .from("servicios")
    .select(
      "id, titulo, descripcion, imagen_url, activo, orden"
    )
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error(
      "Error al cargar servicios:",
      error.message
    );
  }

  const servicios: Servicio[] = data ?? [];

  return (
    <section
      id="servicios"
      className="bg-gray-50 px-5 py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* ENCABEZADO */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            Our Services
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
            Solutions to Transform Your Home
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            We provide construction, remodeling, and maintenance services tailored to the needs of each project.
          </p>
        </div>

        {/* SI OCURRE UN ERROR */}
        {error && (
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-bold text-red-700">
              No fue posible cargar los servicios.
            </p>

            <p className="mt-2 text-sm text-red-600">
              Revisa la conexión con Supabase.
            </p>
          </div>
        )}

        {/* SERVICIOS */}
        {!error && (
          <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => {
              const Icono = obtenerIcono(
                servicio.titulo
              );

              return (
                <article
                key={servicio.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                {/* ÁREA SUPERIOR */}
                <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100">
                        {servicio.imagen_url ? (
                        <ImagenServicio
                            src={servicio.imagen_url}
                            alt={servicio.titulo}
                        />
                        ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-500 text-black shadow-sm">
                        <Icono size={38} />
                        </div>
                    </div>
                    )}
                </div>

                {/* CONTENIDO */}
                <div className="flex flex-1 flex-col p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-500 text-black">
                    <Icono size={28} />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-gray-900">
                    {servicio.titulo}
                    </h3>

                    <p className="mt-4 leading-7 text-gray-600">
                    {servicio.descripcion}
                    </p>
                </div>
                </article>
              );
            })}
          </div>
        )}

        {/* SIN SERVICIOS */}
        {!error && servicios.length === 0 && (
          <div className="mt-12 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="font-bold text-gray-900">
              No hay servicios disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}