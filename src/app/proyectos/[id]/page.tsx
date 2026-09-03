import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProyectoGaleria from "@/components/ProyectoGaleria";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProyectoDetallePage({
  params,
}: Props) {
  const { id } = await params;

  const proyectoId = Number(id);

  if (
    !Number.isInteger(proyectoId) ||
    proyectoId <= 0
  ) {
    notFound();
  }

  const { data: proyecto, error } =
    await supabase
      .from("proyectos")
      .select(`
        id,
        titulo,
        categoria,
        ubicacion,
        descripcion,
        imagen_portada_url,
        proyecto_imagenes (
          id,
          imagen_url,
          orden
        ),
        proyecto_videos (
          id,
          video_url,
          orden
        )
      `)
      .eq("id", proyectoId)
      .eq("activo", true)
      .single();

  if (error || !proyecto) {
    notFound();
  }

  const imagenes = [
    ...(proyecto.proyecto_imagenes ?? []),
  ].sort(
    (a, b) =>
      a.orden - b.orden
  );

  const videos = [
    ...(proyecto.proyecto_videos ?? []),
  ].sort(
    (a, b) =>
      a.orden - b.orden
  );

  return (
    <>
      <Navbar />

      <main>
        {/* COVER */}
        <section
          className="relative flex min-h-[520px] items-end bg-gray-950 bg-cover bg-center px-5 py-16 text-white"
          style={{
            backgroundImage:
              proyecto.imagen_portada_url
                ? `linear-gradient(to top, rgba(0,0,0,.90), rgba(0,0,0,.25)), url("${proyecto.imagen_portada_url}")`
                : "linear-gradient(to top, rgba(0,0,0,.90), rgba(0,0,0,.45))",
          }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <span className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black">
              {proyecto.categoria}
            </span>

            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold md:text-6xl">
              {proyecto.titulo}
            </h1>

            {proyecto.ubicacion && (
              <p className="mt-5 flex items-center gap-2 text-gray-200">
                <MapPin size={19} />

                {proyecto.ubicacion}
              </p>
            )}
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="bg-white px-5 py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
              The Project
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Completed Work
            </h2>

            <p className="mt-6 whitespace-pre-line text-lg leading-9 text-gray-600">
              {proyecto.descripcion}
            </p>
          </div>
        </section>

        {/* GALLERY */}
        {imagenes.length > 0 && (
          <section className="bg-gray-50 px-5 py-20">
            <div className="mx-auto max-w-7xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
                Gallery
              </p>

              <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
                Project Photos
              </h2>

              <p className="mt-4 max-w-2xl text-gray-600">
                Select a photo to view it in a larger size.
              </p>

              <ProyectoGaleria
                imagenes={imagenes}
                titulo={proyecto.titulo}
              />
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section className="bg-gray-950 px-5 py-20 text-white">
            <div className="mx-auto max-w-7xl">
              {/* HEADER */}
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                  Videos
                </p>

                <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
                  See the Project in Action
                </h2>

                <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-400">
                  Take a closer look at the process and the final results.
                </p>
              </div>

              {/* VIDEOS */}
              <div className="mt-10 flex flex-wrap justify-center gap-8">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex w-full max-w-[430px] justify-center rounded-2xl bg-black p-2 shadow-xl"
                  >
                    <video
                      src={video.video_url}
                      controls
                      preload="metadata"
                      playsInline
                      className="max-h-[520px] w-full rounded-xl bg-black object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* QUOTE */}
        <section className="bg-yellow-500 px-5 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold text-black md:text-4xl">
              Looking for a Similar Project?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-black/75">
              Tell us about your project and request a free quote.
            </p>

            <a
              href="/#contacto"
              className="mt-7 inline-flex rounded-lg bg-gray-950 px-7 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              Request a Quote
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}