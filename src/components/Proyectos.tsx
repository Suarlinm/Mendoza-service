import { MapPin } from "lucide-react";

import { supabase } from "@/lib/supabase";

type Proyecto = {
  id: number;
  titulo: string;
  categoria: string;
  ubicacion: string | null;
  descripcion: string;
  imagen_portada_url: string | null;
  destacado: boolean;
  orden: number;
};

export default async function Proyectos() {
  const { data, error } = await supabase
    .from("proyectos")
    .select(
      `
      id,
      titulo,
      categoria,
      ubicacion,
      descripcion,
      imagen_portada_url,
      destacado,
      orden
      `
    )
    .eq("activo", true)
    .order("destacado", {
      ascending: false,
    })
    .order("orden", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error loading projects:",
      error.message
    );
  }

  const proyectos: Proyecto[] =
    data ?? [];

  return (
    <section
      id="proyectos"
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              Our Projects
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
              Take a Look at Some of Our Work
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Every project reflects our commitment to
              quality, attention to detail, and the needs
              of our clients.
            </p>
          </div>

          <a
            href="/proyectos"
            className="inline-flex w-fit rounded-md bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            View All Projects
          </a>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-bold text-red-700">
              Unable to load projects.
            </p>
          </div>
        )}

        {/* PROJECTS */}
        {!error && proyectos.length > 0 && (
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {proyectos
              .slice(0, 6)
              .map((proyecto) => (
                <article
                  key={proyecto.id}
                  className="group overflow-hidden rounded-2xl bg-gray-900 shadow-sm"
                >
                  <div
                    className="relative h-[390px] bg-gray-800 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        proyecto.imagen_portada_url
                          ? `linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.10)), url("${proyecto.imagen_portada_url}")`
                          : "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.30))",
                    }}
                  >
                    {proyecto.destacado && (
                      <div className="absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-extrabold text-black">
                        Featured
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold uppercase text-black">
                        {proyecto.categoria}
                      </span>

                      <h3 className="mt-4 text-2xl font-extrabold text-white">
                        {proyecto.titulo}
                      </h3>

                      {proyecto.ubicacion && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                          <MapPin size={16} />

                          {proyecto.ubicacion}
                        </p>
                      )}

                      <p className="mt-4 line-clamp-2 leading-7 text-gray-300">
                        {proyecto.descripcion}
                      </p>

                      <a
                        href={`/proyectos/${proyecto.id}`}
                        className="mt-5 inline-flex font-bold text-yellow-400 transition group-hover:text-yellow-300"
                      >
                        View Project →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        )}

        {/* EMPTY */}
        {!error && proyectos.length === 0 && (
          <div className="mt-12 rounded-2xl bg-gray-50 p-10 text-center">
            <p className="font-bold text-gray-900">
              No projects have been published yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}