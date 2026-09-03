import { MapPin } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/lib/supabase";

export default async function ProyectosPage() {
  const { data: proyectos, error } =
    await supabase
      .from("proyectos")
      .select(`
        id,
        titulo,
        categoria,
        ubicacion,
        descripcion,
        imagen_portada_url,
        destacado,
        orden
      `)
      .eq("activo", true)
      .order("destacado", {
        ascending: false,
      })
      .order("orden", {
        ascending: true,
      });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* CABECERA */}
        <section className="bg-gray-950 px-5 py-20 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              Portafolio
            </p>

            <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
              Nuestros proyectos
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">
              Explora algunos de los trabajos de construcción,
              reparación y remodelación realizados.
            </p>
          </div>
        </section>

        {/* LISTADO */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="font-bold text-red-700">
                  No fue posible cargar los proyectos.
                </p>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {(proyectos ?? []).map(
                  (proyecto) => (
                    <article
                      key={proyecto.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      {proyecto.imagen_portada_url ? (
                        <img
                          src={
                            proyecto.imagen_portada_url
                          }
                          alt={proyecto.titulo}
                          className="h-64 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-64 items-center justify-center bg-gray-200 text-gray-500">
                          Sin fotografía
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                            {proyecto.categoria}
                          </span>

                          {proyecto.destacado && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              Destacado
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                          {proyecto.titulo}
                        </h2>

                        {proyecto.ubicacion && (
                          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} />

                            {proyecto.ubicacion}
                          </p>
                        )}

                        <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                          {proyecto.descripcion}
                        </p>

                        <a
                          href={`/proyectos/${proyecto.id}`}
                          className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
                        >
                          Ver proyecto
                        </a>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}