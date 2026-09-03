"use client";

import {
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  ImageIcon,
  Loader2,
  MessageSquareQuote,
  Video,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Estadisticas = {
  servicios: number;
  proyectos: number;
  imagenes: number;
  videos: number;
  testimonios: number;
  cotizaciones: number;
  nuevas: number;
};

type CotizacionReciente = {
  id: number;
  nombre: string;
  servicio: string;
  estado: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [correoAdmin, setCorreoAdmin] =
  useState("");
  const [estadisticas, setEstadisticas] =
    useState<Estadisticas>({
      servicios: 0,
      proyectos: 0,
      imagenes: 0,
      videos: 0,
      testimonios: 0,
      cotizaciones: 0,
      nuevas: 0,
    });

  const [
    cotizacionesRecientes,
    setCotizacionesRecientes,
  ] = useState<CotizacionReciente[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

    useEffect(() => {
    cargarDashboard();
    cargarUsuario();
    }, []);

    async function cargarUsuario() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
        setCorreoAdmin(user.email);
    }
    }

  async function cargarDashboard() {
    setCargando(true);
    setError("");

    const [
      servicios,
      proyectos,
      imagenesProyecto,
      imagenesInicio,
      videosProyecto,
      videosInicio,
      testimonios,
      cotizaciones,
      cotizacionesNuevas,
      recientes,
    ] = await Promise.all([
      supabase
        .from("servicios")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("proyectos")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("proyecto_imagenes")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("galeria_inicio")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("proyecto_videos")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("videos_inicio")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("testimonios")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("cotizaciones")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("cotizaciones")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("estado", "Nuevo"),

      supabase
        .from("cotizaciones")
        .select(`
          id,
          nombre,
          servicio,
          estado,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        })
        .limit(5),
    ]);

    const errores = [
      servicios.error,
      proyectos.error,
      imagenesProyecto.error,
      imagenesInicio.error,
      videosProyecto.error,
      videosInicio.error,
      testimonios.error,
      cotizaciones.error,
      cotizacionesNuevas.error,
      recientes.error,
    ].filter(Boolean);

    if (errores.length > 0) {
      console.error(
        "Errores cargando dashboard:",
        errores
      );

      setError(
        "Algunos datos del panel no pudieron cargarse."
      );
    }

    setEstadisticas({
      servicios:
        servicios.count ?? 0,

      proyectos:
        proyectos.count ?? 0,

      imagenes:
        (imagenesProyecto.count ?? 0) +
        (imagenesInicio.count ?? 0),

      videos:
        (videosProyecto.count ?? 0) +
        (videosInicio.count ?? 0),

      testimonios:
        testimonios.count ?? 0,

      cotizaciones:
        cotizaciones.count ?? 0,

      nuevas:
        cotizacionesNuevas.count ?? 0,
    });

    setCotizacionesRecientes(
      (recientes.data ?? []) as CotizacionReciente[]
    );

    setCargando(false);
  }

  function formatoFecha(
    fecha: string
  ) {
    return new Intl.DateTimeFormat(
      "es",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(
      new Date(fecha)
    );
  }

  const tarjetas = [
    {
      titulo: "Servicios",
      valor:
        estadisticas.servicios,
      icono:
        BriefcaseBusiness,
      href:
        "/admin/servicios",
    },

    {
      titulo: "Proyectos",
      valor:
        estadisticas.proyectos,
      icono:
        FolderKanban,
      href:
        "/admin/proyectos",
    },

    {
      titulo: "Fotografías",
      valor:
        estadisticas.imagenes,
      icono:
        ImageIcon,
      href:
        "/admin/galeria",
    },

    {
      titulo: "Videos",
      valor:
        estadisticas.videos,
      icono:
        Video,
      href:
        "/admin/videos",
    },

    {
      titulo: "Testimonios",
      valor:
        estadisticas.testimonios,
      icono:
        MessageSquareQuote,
      href:
        "/admin/testimonios",
    },

    {
      titulo: "Cotizaciones",
      valor:
        estadisticas.cotizaciones,
      icono:
        ClipboardList,
      href:
        "/admin/cotizaciones",
    },
  ];

  if (cargando) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-yellow-500" />

          <p className="mt-3 text-sm font-semibold text-gray-500">
            Cargando panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
          Panel principal
        </h1>

        <p className="mt-2 text-gray-600">
          Resumen general del contenido y las
          solicitudes recibidas desde la página web.
        </p>

        {correoAdmin && (
        <div className="mt-5 w-fit rounded-xl bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-500">
            Sesión iniciada como
            </p>

            <p className="mt-1 text-sm font-bold text-gray-900">
            {correoAdmin}
            </p>
        </div>
        )}

      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 font-semibold text-yellow-800">
          {error}
        </div>
      )}

      {/* COTIZACIONES NUEVAS */}
      {estadisticas.nuevas > 0 && (
        <a
          href="/admin/cotizaciones"
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-yellow-300 bg-yellow-50 p-6 transition hover:bg-yellow-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-yellow-700">
              Atención
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-gray-900">
              Tienes{" "}
              {estadisticas.nuevas}{" "}
              {estadisticas.nuevas === 1
                ? "cotización nueva"
                : "cotizaciones nuevas"}
            </h2>

            <p className="mt-2 text-gray-600">
              Hay solicitudes de clientes pendientes
              de revisión.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white">
            Revisar solicitudes
          </span>
        </a>
      )}

      {/* TARJETAS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tarjetas.map(
          (tarjeta) => {
            const Icono =
              tarjeta.icono;

            return (
              <a
                key={
                  tarjeta.href
                }
                href={
                  tarjeta.href
                }
                className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-500">
                      {
                        tarjeta.titulo
                      }
                    </p>

                    <p className="mt-3 text-4xl font-extrabold text-gray-900">
                      {
                        tarjeta.valor
                      }
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 transition group-hover:bg-yellow-500 group-hover:text-black">
                    <Icono
                      size={23}
                    />
                  </div>
                </div>

                <p className="mt-5 text-sm font-bold text-yellow-600">
                  Administrar →
                </p>
              </a>
            );
          }
        )}
      </div>

      {/* COTIZACIONES RECIENTES */}
      <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Cotizaciones recientes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Últimas solicitudes recibidas desde la página.
            </p>
          </div>

          <a
            href="/admin/cotizaciones"
            className="w-fit text-sm font-bold text-yellow-600 hover:text-yellow-700"
          >
            Ver todas →
          </a>
        </div>

        {cotizacionesRecientes.length >
        0 ? (
          <div className="mt-5 divide-y divide-gray-100">
            {cotizacionesRecientes.map(
              (
                cotizacion
              ) => (
                <a
                  key={
                    cotizacion.id
                  }
                  href="/admin/cotizaciones"
                  className="flex flex-col gap-3 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-3"
                >
                  <div>
                    <h3 className="font-extrabold text-gray-900">
                      {
                        cotizacion.nombre
                      }
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      {
                        cotizacion.servicio
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatoFecha(
                        cotizacion.created_at
                      )}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      cotizacion.estado ===
                      "Nuevo"
                        ? "bg-yellow-100 text-yellow-700"
                        : cotizacion.estado ===
                            "Finalizado"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {
                      cotizacion.estado
                    }
                  </span>
                </a>
              )
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <ClipboardList
              size={40}
              className="mx-auto text-gray-300"
            />

            <p className="mt-4 font-bold text-gray-900">
              No hay cotizaciones todavía
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Cuando un cliente envíe una solicitud,
              aparecerá aquí.
            </p>
          </div>
        )}
      </section>

      {/* ACCIONES RÁPIDAS */}
      <section className="mt-8">
        <h2 className="text-xl font-extrabold text-gray-900">
          Acciones rápidas
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/proyectos"
            className="rounded-xl bg-gray-950 p-5 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            + Nuevo proyecto
          </a>

          <a
            href="/admin/galeria"
            className="rounded-xl bg-gray-950 p-5 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            + Agregar fotografía
          </a>

          <a
            href="/admin/videos"
            className="rounded-xl bg-gray-950 p-5 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            + Agregar video
          </a>

          <a
            href="/admin/testimonios"
            className="rounded-xl bg-gray-950 p-5 font-bold text-white transition hover:bg-yellow-500 hover:text-black"
          >
            + Nuevo testimonio
          </a>
        </div>
      </section>
    </div>
  );
}