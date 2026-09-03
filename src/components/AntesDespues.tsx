import ComparadorAntesDespues from "@/components/ComparadorAntesDespues";
import { supabase } from "@/lib/supabase";

type Comparacion = {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string | null;

  imagen_antes_url: string | null;
  imagen_despues_url: string | null;

  orden: number;
};

export default async function AntesDespues() {
  const { data, error } = await supabase
    .from("antes_despues")
    .select(`
      id,
      titulo,
      categoria,
      descripcion,
      imagen_antes_url,
      imagen_despues_url,
      orden
    `)
    .eq("activo", true)
    .order("orden", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error al cargar antes y después:",
      error.message
    );
  }

  const comparaciones: Comparacion[] =
    data ?? [];

  return (
    <section className="bg-gray-950 px-5 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        {/* ENCABEZADO */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            Before & After
          </p>

          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
            See Our Transformations
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-300">
            Slide through each comparison to discover 
            the changes we’ve made in our projects.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="font-bold text-red-300">
              No fue posible cargar las comparaciones.
            </p>
          </div>
        )}

        {/* COMPARACIONES */}
        {!error && comparaciones.length > 0 && (
          <div className="mt-14 space-y-20">
            {comparaciones.map(
              (comparacion) => {
                if (
                  !comparacion.imagen_antes_url ||
                  !comparacion.imagen_despues_url
                ) {
                  return null;
                }

                return (
                  <article
                    key={comparacion.id}
                    className="mx-auto max-w-5xl"
                  >
                    <ComparadorAntesDespues
                      imagenAntes={
                        comparacion.imagen_antes_url
                      }
                      imagenDespues={
                        comparacion.imagen_despues_url
                      }
                      titulo={comparacion.titulo}
                    />

                    <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                          {comparacion.categoria}
                        </p>

                        <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">
                          {comparacion.titulo}
                        </h3>

                        {comparacion.descripcion && (
                          <p className="mt-4 leading-7 text-gray-400">
                            {comparacion.descripcion}
                          </p>
                        )}
                      </div>

                      <a
                        href="#proyectos"
                        className="w-fit shrink-0 rounded-lg border border-gray-600 px-5 py-3 text-sm font-bold transition hover:border-yellow-500 hover:bg-yellow-500 hover:text-black"
                      >
                        View All Proyects
                      </a>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        {/* SIN DATOS */}
        {!error &&
          comparaciones.length === 0 && (
            <div className="mt-12 text-center text-gray-400">
              No hay comparaciones publicadas todavía.
            </div>
          )}
      </div>
    </section>
  );
}