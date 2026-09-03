import { Star } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { obtenerConfiguracionSitio } from "@/lib/configuracionSitio";

type Testimonio = {
  id: number;
  nombre: string;
  servicio: string | null;
  comentario: string;
  calificacion: number;
  orden: number;
};

export default async function Testimonios() {
  const configuracion =
  await obtenerConfiguracionSitio();

    if (!configuracion.mostrar_testimonios) {
    return null;
 }


  const { data, error } = await supabase
    .from("testimonios")
    .select(
      "id, nombre, servicio, comentario, calificacion, orden"
    )
    .eq("activo", true)
    .order("orden", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error al cargar testimonios:",
      error.message
    );
  }

  const testimonios: Testimonio[] =
    data ?? [];

  if (
    !error &&
    testimonios.length === 0
  ) {
    return null;
  }

  return (
    <section className="bg-gray-50 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            Testimonios
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
            Lo que dicen nuestros clientes
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            La satisfacción de nuestros clientes es una
            parte importante de cada proyecto que
            realizamos.
          </p>
        </div>

        {error ? (
          <div className="mt-12 text-center text-red-600">
            No fue posible cargar los testimonios.
          </div>
        ) : (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {testimonios.map(
              (testimonio) => (
                <article
                  key={testimonio.id}
                  className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (estrella) => (
                        <Star
                          key={estrella}
                          size={20}
                          className={
                            estrella <=
                            testimonio.calificacion
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fill={
                            estrella <=
                            testimonio.calificacion
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>

                  <p className="mt-6 leading-8 text-gray-600">
                    “{testimonio.comentario}”
                  </p>

                  <div className="mt-7 border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-gray-900">
                      {testimonio.nombre}
                    </h3>

                    {testimonio.servicio && (
                      <p className="mt-1 text-sm font-medium text-yellow-600">
                        {testimonio.servicio}
                      </p>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}