import {
  CheckCircle2,
  Hammer,
  ShieldCheck,
} from "lucide-react";

import { obtenerConfiguracionSitio } from "@/lib/configuracionSitio";

export default async function Nosotros() {
  const configuracion =
    await obtenerConfiguracionSitio();

  const imagen =
    configuracion.nosotros_imagen_url ||
    "/images/nosotros.jpg";

  return (
    <section
      id="nosotros"
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* IMAGEN */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
          <img
            src={imagen}
            alt={configuracion.nombre_empresa}
            className="h-[420px] w-full object-cover sm:h-[520px]"
          />

        </div>

        {/* INFORMACIÓN */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            About Us
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            {configuracion.nosotros_titulo}
          </h2>

          {configuracion.nosotros_texto && (
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-gray-600">
              {configuracion.nosotros_texto}
            </p>
          )}

          <div className="mt-8 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                <Hammer className="text-yellow-700" />
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900">
                {configuracion.nosotros_valor_1_titulo}
                </h3>

                <p className="mt-1 leading-7 text-gray-600">
                {configuracion.nosotros_valor_1_texto}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
                <ShieldCheck className="text-yellow-700" />
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900">
                {configuracion.nosotros_valor_2_titulo}
                </h3>

                <p className="mt-1 leading-7 text-gray-600">
                {configuracion.nosotros_valor_2_texto}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="mt-1 shrink-0 text-yellow-500" />

                <p className="font-semibold text-gray-700">
                {configuracion.nosotros_resumen}
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}