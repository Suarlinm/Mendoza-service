import { ArrowRight, CheckCircle2 } from "lucide-react";

import { obtenerConfiguracionSitio } from "@/lib/configuracionSitio";

export default async function Hero() {
  const configuracion =
    await obtenerConfiguracionSitio();

  const imagen =
    configuracion.hero_imagen_url ||
    "/images/hero-construccion.jpg";

  return (
    <section
      id="inicio"
      className="relative flex min-h-[650px] items-center bg-gray-950 bg-cover bg-center px-5 py-24 text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(3,7,18,0.94) 0%,
            rgba(3,7,18,0.75) 48%,
            rgba(3,7,18,0.30) 100%
          ),
          url("${imagen}")
        `,
      }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
        {configuracion.hero_etiqueta && (
        <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-yellow-400">
            {configuracion.hero_etiqueta}
        </p>
        )}

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            {configuracion.hero_titulo}
          </h1>

          {configuracion.hero_subtitulo && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
              {configuracion.hero_subtitulo}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-7 py-4 font-extrabold text-black transition hover:bg-yellow-400"
            >
              Request a Quote

              <ArrowRight size={20} />
            </a>

            <a
              href="#proyectos"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
            >
              View Projects
            </a>
          </div>

        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-gray-200">
        {configuracion.hero_beneficio_1 && (
            <div className="flex items-center gap-2">
            <CheckCircle2
                size={18}
                className="text-yellow-400"
            />

            {configuracion.hero_beneficio_1}
            </div>
        )}

        {configuracion.hero_beneficio_2 && (
            <div className="flex items-center gap-2">
            <CheckCircle2
                size={18}
                className="text-yellow-400"
            />

            {configuracion.hero_beneficio_2}
            </div>
        )}

        {configuracion.hero_beneficio_3 && (
            <div className="flex items-center gap-2">
            <CheckCircle2
                size={18}
                className="text-yellow-400"
            />

            {configuracion.hero_beneficio_3}
            </div>
        )}
        </div>

        </div>
      </div>
    </section>
  );
}