import { supabase } from "@/lib/supabase";

type VideoProyecto = {
  id: number;
  video_url: string;

  proyectos: {
    id: number;
    titulo: string;
    categoria: string;
    activo: boolean;
  };
};

type VideoInicio = {
  id: number;
  titulo: string;
  descripcion: string | null;
  video_url: string;
  orden: number;
};

export default async function Videos() {
  const {
    data: videosProyecto,
    error: errorProyecto,
  } = await supabase
    .from("proyecto_videos")
    .select(`
      id,
      video_url,
      proyectos!inner (
        id,
        titulo,
        categoria,
        activo
      )
    `)
    .eq("mostrar_inicio", true)
    .eq(
      "proyectos.activo",
      true
    )
    .order("id", {
      ascending: false,
    });

  const {
    data: videosInicio,
    error: errorInicio,
  } = await supabase
    .from("videos_inicio")
    .select(`
      id,
      titulo,
      descripcion,
      video_url,
      orden
    `)
    .eq("activo", true)
    .order("orden", {
      ascending: true,
    });

  if (
    errorProyecto ||
    errorInicio
  ) {
    console.error(
      "Error cargando videos:",
      errorProyecto?.message ||
        errorInicio?.message
    );

    return null;
  }

  const proyectos =
    (videosProyecto ??
      []) as unknown as VideoProyecto[];

  const independientes =
    (videosInicio ??
      []) as VideoInicio[];

  const videos = [
    ...independientes.map(
      (video) => ({
        id: `inicio-${video.id}`,

        video_url:
          video.video_url,

        titulo:
          video.titulo,

        categoria:
          "Video",

        descripcion:
          video.descripcion,

        proyectoId:
          null as number | null,
      })
    ),

    ...proyectos.map(
      (video) => ({
        id: `proyecto-${video.id}`,

        video_url:
          video.video_url,

        titulo:
          video.proyectos.titulo,

        categoria:
          video.proyectos.categoria,

        descripcion:
          null as string | null,

        proyectoId:
          video.proyectos.id,
      })
    ),
  ].slice(0, 6);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      id="videos"
      className="bg-gray-950 px-5 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">
        {/* ENCABEZADO */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
            Videos
          </p>

          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
            Mira nuestro trabajo
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-400">
            Conoce algunos detalles del proceso
            y los resultados de nuestros trabajos.
          </p>
        </div>

        {/* LISTADO */}
        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              className="w-full max-w-[430px]"
            >
              <div className="flex justify-center overflow-hidden rounded-2xl bg-black p-2 shadow-xl">
                <video
                  src={video.video_url}
                  controls
                  preload="metadata"
                  playsInline
                  className="max-h-[500px] w-full rounded-xl bg-black object-contain"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  {video.categoria}
                </p>

                <h3 className="mt-2 text-lg font-extrabold text-white">
                  {video.titulo}
                </h3>

                {video.descripcion && (
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
                    {video.descripcion}
                  </p>
                )}

                {video.proyectoId && (
                  <a
                    href={`/proyectos/${video.proyectoId}`}
                    className="mt-3 inline-block text-sm font-bold text-gray-400 transition hover:text-yellow-400"
                  >
                    Ver proyecto →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}