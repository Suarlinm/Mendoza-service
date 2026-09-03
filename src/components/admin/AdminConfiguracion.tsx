"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Building2,
  ImagePlus,
  Loader2,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Configuracion = {
  id: number;

  nombre_empresa: string;

  telefono: string | null;
  whatsapp: string | null;
  correo: string | null;
  ubicacion: string | null;

  facebook: string | null;
  instagram: string | null;

  hero_titulo: string | null;
  hero_subtitulo: string | null;
  hero_imagen_url: string | null;
  hero_imagen_path: string | null;

  hero_etiqueta: string | null;
  hero_beneficio_1: string | null;
  hero_beneficio_2: string | null;
  hero_beneficio_3: string | null;

  nosotros_titulo: string | null;
  nosotros_texto: string | null;
  nosotros_imagen_url: string | null;
  nosotros_imagen_path: string | null;

    nosotros_destacado_titulo: string | null;
    nosotros_destacado_texto: string | null;

    nosotros_valor_1_titulo: string | null;
    nosotros_valor_1_texto: string | null;

    nosotros_valor_2_titulo: string | null;
    nosotros_valor_2_texto: string | null;

    nosotros_resumen: string | null;

    mostrar_testimonios: boolean;

};

export default function AdminConfiguracion() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarTestimonios, setMostrarTestimonios] =
  useState(true);

  const [configuracionActual, setConfiguracionActual] =
    useState<Configuracion | null>(null);

  const [nombreEmpresa, setNombreEmpresa] = useState("");

  const [telefono, setTelefono] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");

  const [heroTitulo, setHeroTitulo] = useState("");
  const [heroSubtitulo, setHeroSubtitulo] = useState("");

  const [heroEtiqueta, setHeroEtiqueta] =
  useState("");

  const [heroBeneficio1, setHeroBeneficio1] =
  useState("");

  const [heroBeneficio2, setHeroBeneficio2] =
  useState("");

  const [heroBeneficio3, setHeroBeneficio3] =
  useState("");

  const [nosotrosTitulo, setNosotrosTitulo] = useState("");
  const [nosotrosTexto, setNosotrosTexto] = useState("");

  const [heroImagen, setHeroImagen] =
    useState<File | null>(null);

  const [nosotrosImagen, setNosotrosImagen] =
    useState<File | null>(null);

  const [vistaHero, setVistaHero] =
    useState<string | null>(null);

  const [vistaNosotros, setVistaNosotros] =
    useState<string | null>(null);

    const [
    nosotrosDestacadoTitulo,
    setNosotrosDestacadoTitulo,
    ] = useState("");

    const [
    nosotrosDestacadoTexto,
    setNosotrosDestacadoTexto,
    ] = useState("");

    const [
    nosotrosValor1Titulo,
    setNosotrosValor1Titulo,
    ] = useState("");

    const [
    nosotrosValor1Texto,
    setNosotrosValor1Texto,
    ] = useState("");

    const [
    nosotrosValor2Titulo,
    setNosotrosValor2Titulo,
    ] = useState("");

    const [
    nosotrosValor2Texto,
    setNosotrosValor2Texto,
    ] = useState("");

    const [
    nosotrosResumen,
    setNosotrosResumen,
    ] = useState("");



  useEffect(() => {
    cargarConfiguracion();
  }, []);

  async function cargarConfiguracion() {
    setCargando(true);
    setError("");

    const { data, error } = await supabase
      .from("configuracion_sitio")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.error(error);

      setError(
        "No fue posible cargar la configuración."
      );

      setCargando(false);
      return;
    }

    const config = data as Configuracion;

    setConfiguracionActual(config);

    setNombreEmpresa(config.nombre_empresa ?? "");

    setTelefono(config.telefono ?? "");
    setWhatsapp(config.whatsapp ?? "");
    setCorreo(config.correo ?? "");
    setUbicacion(config.ubicacion ?? "");

    setFacebook(config.facebook ?? "");
    setInstagram(config.instagram ?? "");

    setHeroTitulo(config.hero_titulo ?? "");
    setHeroSubtitulo(config.hero_subtitulo ?? "");

    setHeroEtiqueta(
    config.hero_etiqueta ??
    "Construcción y remodelación"
    );

    setHeroBeneficio1(
    config.hero_beneficio_1 ??
        "Calidad"
    );

    setHeroBeneficio2(
    config.hero_beneficio_2 ??
        "Responsabilidad"
    );

    setHeroBeneficio3(
    config.hero_beneficio_3 ??
        "Experiencia"
    );

    setNosotrosTitulo(
      config.nosotros_titulo ?? ""
    );

    setNosotrosTexto(
      config.nosotros_texto ?? ""
    );

    setNosotrosDestacadoTitulo(
    config.nosotros_destacado_titulo ??
        "Calidad en cada proyecto"
    );

    setNosotrosDestacadoTexto(
    config.nosotros_destacado_texto ??
        "Atención a cada detalle"
    );

    setNosotrosValor1Titulo(
    config.nosotros_valor_1_titulo ??
        "Trabajo profesional"
    );

    setNosotrosValor1Texto(
    config.nosotros_valor_1_texto ??
        "Soluciones pensadas para cada espacio y necesidad."
    );

    setNosotrosValor2Titulo(
    config.nosotros_valor_2_titulo ??
        "Compromiso"
    );

    setNosotrosValor2Texto(
    config.nosotros_valor_2_texto ??
        "Responsabilidad durante todo el desarrollo del proyecto."
    );

    setNosotrosResumen(
    config.nosotros_resumen ??
        "Remodelaciones, pintura, tablaroca y reparaciones."
    );

    setMostrarTestimonios(
    config.mostrar_testimonios ?? true
    );


    setVistaHero(config.hero_imagen_url);
    setVistaNosotros(config.nosotros_imagen_url);

    setCargando(false);
  }

  function validarImagen(archivo: File) {
    const permitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!permitidos.includes(archivo.type)) {
      setError(
        "Solo se permiten fotografías JPG, PNG o WEBP."
      );

      return false;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setError(
        "Cada fotografía debe pesar máximo 5 MB."
      );

      return false;
    }

    setError("");

    return true;
  }

  function seleccionarHero(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!validarImagen(archivo)) return;

    setHeroImagen(archivo);

    setVistaHero(
      URL.createObjectURL(archivo)
    );
  }

  function seleccionarNosotros(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!validarImagen(archivo)) return;

    setNosotrosImagen(archivo);

    setVistaNosotros(
      URL.createObjectURL(archivo)
    );
  }

  async function subirImagen(
    archivo: File,
    carpeta: string
  ) {
    const extension =
      archivo.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const nombre =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path =
      `${carpeta}/${nombre}`;

    const { data, error } =
      await supabase.storage
        .from("sitio")
        .upload(path, archivo, {
          cacheControl: "3600",
          upsert: false,
          contentType: archivo.type,
        });

    if (error) {
      console.error(error);
      return null;
    }

    const { data: urlData } =
      supabase.storage
        .from("sitio")
        .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  }

  async function guardarConfiguracion(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!nombreEmpresa.trim()) return;

    setGuardando(true);
    setError("");
    setMensaje("");

    let nuevaHero = null;
    let nuevaNosotros = null;

    if (heroImagen) {
      nuevaHero = await subirImagen(
        heroImagen,
        "hero"
      );

      if (!nuevaHero) {
        setError(
          "No fue posible subir la imagen principal."
        );

        setGuardando(false);
        return;
      }
    }

    if (nosotrosImagen) {
      nuevaNosotros = await subirImagen(
        nosotrosImagen,
        "nosotros"
      );

      if (!nuevaNosotros) {
        setError(
          "No fue posible subir la fotografía de Nosotros."
        );

        setGuardando(false);
        return;
      }
    }

    const cambios: Record<
        string,
        string | boolean | null
        > = {
      nombre_empresa: nombreEmpresa.trim(),

      telefono: telefono.trim() || null,
      whatsapp: whatsapp.trim() || null,
      correo: correo.trim() || null,
      ubicacion: ubicacion.trim() || null,

      facebook: facebook.trim() || null,
      instagram: instagram.trim() || null,

      hero_titulo:
        heroTitulo.trim() || null,

      hero_subtitulo:
        heroSubtitulo.trim() || null,

        hero_etiqueta:
      heroEtiqueta.trim() || null,

      hero_beneficio_1:
        heroBeneficio1.trim() || null,

     hero_beneficio_2:
        heroBeneficio2.trim() || null,

     hero_beneficio_3:
        heroBeneficio3.trim() || null,

      nosotros_titulo:
        nosotrosTitulo.trim() || null,

      nosotros_texto:
        nosotrosTexto.trim() || null,


    nosotros_destacado_titulo:
    nosotrosDestacadoTitulo.trim() || null,

    nosotros_destacado_texto:
    nosotrosDestacadoTexto.trim() || null,

    nosotros_valor_1_titulo:
    nosotrosValor1Titulo.trim() || null,

    nosotros_valor_1_texto:
    nosotrosValor1Texto.trim() || null,

    nosotros_valor_2_titulo:
    nosotrosValor2Titulo.trim() || null,

    nosotros_valor_2_texto:
    nosotrosValor2Texto.trim() || null,

    nosotros_resumen:
    nosotrosResumen.trim() || null,

    mostrar_testimonios: mostrarTestimonios,

      updated_at:
        new Date().toISOString(),
    };

    if (nuevaHero) {
      cambios.hero_imagen_url =
        nuevaHero.url;

      cambios.hero_imagen_path =
        nuevaHero.path;
    }

    if (nuevaNosotros) {
      cambios.nosotros_imagen_url =
        nuevaNosotros.url;

      cambios.nosotros_imagen_path =
        nuevaNosotros.path;
    }

    const {
    data: configuracionGuardada,
    error: errorActualizar,
    } = await supabase
    .from("configuracion_sitio")
    .update(cambios)
    .eq("id", 1)
    .select()
    .single();

    if (errorActualizar) {
    console.error(
        "Error guardando configuración:",
        {
        message: errorActualizar.message,
        code: errorActualizar.code,
        details: errorActualizar.details,
        hint: errorActualizar.hint,
        }
    );

    setError(
        errorActualizar.message ||
        "No fue posible guardar la configuración."
    );

    setGuardando(false);
    return;
    }

    console.log(
    "Configuración guardada:",
    configuracionGuardada
    );

    if (
      nuevaHero &&
      configuracionActual?.hero_imagen_path &&
      configuracionActual.hero_imagen_path !==
        nuevaHero.path
    ) {
      await supabase.storage
        .from("sitio")
        .remove([
          configuracionActual.hero_imagen_path,
        ]);
    }

    if (
      nuevaNosotros &&
      configuracionActual?.nosotros_imagen_path &&
      configuracionActual.nosotros_imagen_path !==
        nuevaNosotros.path
    ) {
      await supabase.storage
        .from("sitio")
        .remove([
          configuracionActual.nosotros_imagen_path,
        ]);
    }

    setHeroImagen(null);
    setNosotrosImagen(null);

    setMensaje(
      "Configuración guardada correctamente."
    );

    await cargarConfiguracion();

    setGuardando(false);
  }

  if (cargando) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-yellow-500" />

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
              Página web
            </p>

            <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
              Configuración
            </h1>
          </div>
        </div>

        <p className="mt-3 text-gray-600">
          Modifica la información general de la empresa y
          los textos principales de la página.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
          {mensaje}
        </div>
      )}

      <form
        onSubmit={guardarConfiguracion}
        className="mt-8 space-y-8"
      >
        {/* EMPRESA */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Información de la empresa
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold">
                Nombre de la empresa
              </label>

              <input
                value={nombreEmpresa}
                onChange={(e) =>
                  setNombreEmpresa(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Teléfono
              </label>

              <input
                value={telefono}
                onChange={(e) =>
                  setTelefono(e.target.value)
                }
                placeholder="+1 000 000 0000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                WhatsApp
              </label>

              <input
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                placeholder="10000000000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-2 text-xs text-gray-500">
                Coloca únicamente el número con código de país.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Correo
              </label>

              <input
                type="email"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Ubicación
              </label>

              <input
                value={ubicacion}
                onChange={(e) =>
                  setUbicacion(e.target.value)
                }
                placeholder="Connecticut, USA"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Facebook
              </label>

              <input
                value={facebook}
                onChange={(e) =>
                  setFacebook(e.target.value)
                }
                placeholder="https://facebook.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Instagram
              </label>

              <input
                value={instagram}
                onChange={(e) =>
                  setInstagram(e.target.value)
                }
                placeholder="https://instagram.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
          </div>
        </section>

        {/* HERO */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Inicio / Portada
          </h2>

          <div className="mt-6 space-y-5">
            <div>
            <label className="mb-2 block text-sm font-bold">
                Texto superior
            </label>

            <input
                value={heroEtiqueta}
                onChange={(e) =>
                setHeroEtiqueta(e.target.value)
                }
                placeholder="Ejemplo: Construcción y remodelación"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Título principal
              </label>

              <input
                value={heroTitulo}
                onChange={(e) =>
                  setHeroTitulo(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Texto secundario
              </label>


              <textarea
                value={heroSubtitulo}
                onChange={(e) =>
                  setHeroSubtitulo(
                    e.target.value
                  )
                }
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
            <label className="mb-3 block text-sm font-bold">
                Características principales
            </label>

            <div className="grid gap-4 md:grid-cols-3">
                <input
                value={heroBeneficio1}
                onChange={(e) =>
                    setHeroBeneficio1(
                    e.target.value
                    )
                }
                placeholder="Calidad"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <input
                value={heroBeneficio2}
                onChange={(e) =>
                    setHeroBeneficio2(
                    e.target.value
                    )
                }
                placeholder="Responsabilidad"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <input
                value={heroBeneficio3}
                onChange={(e) =>
                    setHeroBeneficio3(
                    e.target.value
                    )
                }
                placeholder="Experiencia"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold">
                Fotografía de portada
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                {vistaHero ? (
                  <img
                    src={vistaHero}
                    alt="Portada"
                    className="h-72 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <ImagePlus className="mx-auto" />
                    <p className="mt-3">
                      Sin fotografía
                    </p>
                  </div>
                )}

                <label className="mt-5 block cursor-pointer rounded-lg bg-gray-900 px-5 py-3 text-center font-bold text-white">
                  {vistaHero
                    ? "Cambiar fotografía"
                    : "Seleccionar fotografía"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={seleccionarHero}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* NOSOTROS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900">
            Nosotros
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                Título
              </label>

              <input
                value={nosotrosTitulo}
                onChange={(e) =>
                  setNosotrosTitulo(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Descripción
              </label>

              <textarea
                value={nosotrosTexto}
                onChange={(e) =>
                  setNosotrosTexto(
                    e.target.value
                  )
                }
                rows={6}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>


            <div className="border-t border-gray-200 pt-6">
            <h3 className="font-extrabold text-gray-900">
                Texto sobre la fotografía
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                value={nosotrosDestacadoTitulo}
                onChange={(e) =>
                    setNosotrosDestacadoTitulo(
                    e.target.value
                    )
                }
                placeholder="Calidad en cada proyecto"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <input
                value={nosotrosDestacadoTexto}
                onChange={(e) =>
                    setNosotrosDestacadoTexto(
                    e.target.value
                    )
                }
                placeholder="Atención a cada detalle"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>
            </div>

            <div>
            <h3 className="font-extrabold text-gray-900">
                Característica 1
            </h3>

            <div className="mt-4 space-y-4">
                <input
                value={nosotrosValor1Titulo}
                onChange={(e) =>
                    setNosotrosValor1Titulo(
                    e.target.value
                    )
                }
                placeholder="Trabajo profesional"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <textarea
                value={nosotrosValor1Texto}
                onChange={(e) =>
                    setNosotrosValor1Texto(
                    e.target.value
                    )
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>
            </div>

            <div>
            <h3 className="font-extrabold text-gray-900">
                Característica 2
            </h3>

            <div className="mt-4 space-y-4">
                <input
                value={nosotrosValor2Titulo}
                onChange={(e) =>
                    setNosotrosValor2Titulo(
                    e.target.value
                    )
                }
                placeholder="Compromiso"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <textarea
                value={nosotrosValor2Texto}
                onChange={(e) =>
                    setNosotrosValor2Texto(
                    e.target.value
                    )
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                />
            </div>
            </div>

            <div>
            <label className="mb-2 block text-sm font-bold">
                Texto final
            </label>

            <input
                value={nosotrosResumen}
                onChange={(e) =>
                setNosotrosResumen(
                    e.target.value
                )
                }
                placeholder="Remodelaciones, pintura, tablaroca y reparaciones."
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
            </div>


            <div>
              <label className="mb-3 block text-sm font-bold">
                Fotografía
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                {vistaNosotros ? (
                  <img
                    src={vistaNosotros}
                    alt="Nosotros"
                    className="h-72 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <ImagePlus className="mx-auto" />
                    <p className="mt-3">
                      Sin fotografía
                    </p>
                  </div>
                )}

                <label className="mt-5 block cursor-pointer rounded-lg bg-gray-900 px-5 py-3 text-center font-bold text-white">
                  {vistaNosotros
                    ? "Cambiar fotografía"
                    : "Seleccionar fotografía"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      seleccionarNosotros
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* VISIBILIDAD DE TESTIMONIOS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h2 className="text-xl font-extrabold text-gray-900">
                Sección de testimonios
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
                Puedes ocultar o mostrar toda la sección de testimonios
                en la página pública sin eliminar los testimonios guardados.
            </p>
            </div>

            <button
            type="button"
            onClick={() =>
                setMostrarTestimonios(
                !mostrarTestimonios
                )
            }
            className={`w-fit rounded-xl px-6 py-3 text-sm font-extrabold transition ${
                mostrarTestimonios
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            >
            {mostrarTestimonios
                ? "Visible"
                : "Oculta"}
            </button>
        </div>
        </section>


        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center gap-2 rounded-xl bg-yellow-500 px-7 py-4 font-extrabold text-black shadow-lg transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {guardando ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Save size={20} />
            )}

            {guardando
              ? "Guardando..."
              : "Guardar configuración"}
          </button>
        </div>
      </form>
    </div>
  );
}