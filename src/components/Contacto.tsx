"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type DatosEmpresa = {
  nombre_empresa: string;
  telefono: string | null;
  correo: string | null;
  ubicacion: string | null;
};

export default function Contacto() {
  const [enviado, setEnviado] =
    useState(false);

  const [enviando, setEnviando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [datosEmpresa, setDatosEmpresa] =
    useState<DatosEmpresa>({
      nombre_empresa: "CONSTRUCTORA",
      telefono: null,
      correo: null,
      ubicacion: null,
    });

  useEffect(() => {
    async function cargarDatosEmpresa() {
      const {
        data,
        error: errorConfiguracion,
      } = await supabase
        .from("configuracion_sitio")
        .select(`
          nombre_empresa,
          telefono,
          correo,
          ubicacion
        `)
        .eq("id", 1)
        .maybeSingle();

      if (errorConfiguracion) {
        console.error(
          "Error cargando información de contacto:",
          errorConfiguracion.message
        );

        return;
      }

      if (data) {
        setDatosEmpresa(
          data as DatosEmpresa
        );
      }
    }

    cargarDatosEmpresa();
  }, []);

  async function enviarFormulario(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setEnviando(true);
    setError("");

    const formulario =
      e.currentTarget;

    const datos =
      new FormData(formulario);

    const nombre = String(
      datos.get("nombre") ?? ""
    ).trim();

    const telefono = String(
      datos.get("telefono") ?? ""
    ).trim();

    const correo = String(
      datos.get("correo") ?? ""
    ).trim();

    const servicio = String(
      datos.get("servicio") ?? ""
    ).trim();

    const mensaje = String(
      datos.get("mensaje") ?? ""
    ).trim();

    if (
      !nombre ||
      !telefono ||
      !servicio ||
      !mensaje
    ) {
      setError(
        "Completa todos los campos obligatorios."
      );

      setEnviando(false);

      return;
    }

    const {
      error: errorSupabase,
    } = await supabase
      .from("cotizaciones")
      .insert({
        nombre,
        telefono,
        correo: correo || null,
        servicio,
        mensaje,
        estado: "Nuevo",
      });

    if (errorSupabase) {
      console.error(
        errorSupabase
      );

      setError(
        "No fue posible enviar la solicitud. Intenta nuevamente."
      );

      setEnviando(false);

      return;
    }

    formulario.reset();

    setEnviado(true);
    setEnviando(false);
  }

  return (
    <section
      id="contacto"
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* INFORMACIÓN */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            Contact
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Let’s Talk About Your Next Project
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Tell us what you need, and we’ll be happy 
            to learn more about your project and prepare a quote.
          </p>

          {/* DATOS */}
          <div className="mt-10 space-y-4">
            {datosEmpresa.telefono && (
              <a
                href={`tel:${datosEmpresa.telefono}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-yellow-400"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-black">
                  <Phone size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Teléfono
                  </p>

                  <p className="mt-1 font-extrabold text-gray-900">
                    {datosEmpresa.telefono}
                  </p>
                </div>
              </a>
            )}

            {datosEmpresa.correo && (
              <a
                href={`mailto:${datosEmpresa.correo}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 transition hover:border-yellow-400"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-black">
                  <Mail size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-gray-500">
                    Correo electrónico
                  </p>

                  <p className="mt-1 break-all font-extrabold text-gray-900">
                    {datosEmpresa.correo}
                  </p>
                </div>
              </a>
            )}

            {datosEmpresa.ubicacion && (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-black">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Área de servicio
                  </p>

                  <p className="mt-1 font-extrabold text-gray-900">
                    {datosEmpresa.ubicacion}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-xl bg-gray-950 p-6 text-white">
            <div className="flex gap-3">
              <CheckCircle2
                className="mt-1 shrink-0 text-yellow-400"
                size={21}
              />

              <p className="leading-7 text-gray-300">
                Your request will be received directly so we can follow up with you.
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8">
          {enviado ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2
                  size={34}
                />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-gray-900">
                Solicitud enviada
              </h3>

              <p className="mt-3 max-w-md leading-7 text-gray-600">
                Hemos recibido tu solicitud de
                cotización. Nos pondremos en
                contacto contigo.
              </p>

              <button
                type="button"
                onClick={() => {
                  setEnviado(false);
                  setError("");
                }}
                className="mt-7 rounded-lg bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-extrabold text-gray-900">
                Request a Quote
              </h3>

              <p className="mt-2 text-gray-600">
                Fill in your information and tell us what kind of work you need.
              </p>

              <form
                onSubmit={
                  enviarFormulario
                }
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Name *
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Your name"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Phone number *
                    </label>

                    <input
                      type="tel"
                      name="telefono"
                      required
                      placeholder="Your phone number"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-800">
                      Email
                    </label>

                    <input
                      type="email"
                      name="correo"
                      placeholder="email@example.com"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Service *
                  </label>

                  <select
                    name="servicio"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select a service
                    </option>

                    <option value="Pintura">
                      Painting
                    </option>

                    <option value="Remodelación de cocina">
                      Kitchen Remodeling
                    </option>

                    <option value="Remodelación de baño">
                      Bathroom Remodeling
                    </option>

                    <option value="Tablaroca / Drywall">
                      Drywall Installation
                    </option>

                    <option value="Reparación de casas">
                      House Repair
                    </option>

                    <option value="Otro">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Tell us about your project *
                  </label>

                  <textarea
                    name="mensaje"
                    required
                    rows={5}
                    placeholder="Briefly describe the work you need..."
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-500"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-lg bg-yellow-500 px-6 py-4 font-extrabold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando
                    ? "Enviando..."
                    : "Request a Quote"}
                </button>

                <p className="text-center text-xs leading-5 text-gray-500">
                  By submitting your request, your
                  information will be used solely
                  to contact you regarding your
                  project.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}