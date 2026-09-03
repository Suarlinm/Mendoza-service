"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type EstadoCotizacion =
  | "Nuevo"
  | "Contactado"
  | "En seguimiento"
  | "Finalizado";

type Cotizacion = {
  id: number;
  nombre: string;
  telefono: string;
  correo: string | null;
  servicio: string;
  mensaje: string;
  estado: EstadoCotizacion;
  created_at: string;
};

const estados: EstadoCotizacion[] = [
  "Nuevo",
  "Contactado",
  "En seguimiento",
  "Finalizado",
];

export default function AdminCotizaciones() {
  const [cotizaciones, setCotizaciones] =
    useState<Cotizacion[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filtro, setFiltro] =
    useState("Todos");

  useEffect(() => {
    cargarCotizaciones();
  }, []);

  async function cargarCotizaciones() {
    setCargando(true);
    setError("");

    const {
      data,
      error: errorSupabase,
    } = await supabase
      .from("cotizaciones")
      .select(`
        id,
        nombre,
        telefono,
        correo,
        servicio,
        mensaje,
        estado,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (errorSupabase) {
      console.error(errorSupabase);

      setError(
        "No fue posible cargar las cotizaciones."
      );

      setCargando(false);
      return;
    }

    setCotizaciones(
      (data ?? []) as Cotizacion[]
    );

    setCargando(false);
  }

  async function cambiarEstado(
    cotizacion: Cotizacion,
    nuevoEstado: EstadoCotizacion
  ) {
    const { error } = await supabase
      .from("cotizaciones")
      .update({
        estado: nuevoEstado,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", cotizacion.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible actualizar el estado."
      );

      return;
    }

    await cargarCotizaciones();
  }

  async function eliminarCotizacion(
    cotizacion: Cotizacion
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar la solicitud de "${cotizacion.nombre}"?`
      );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("cotizaciones")
      .delete()
      .eq("id", cotizacion.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible eliminar la cotización."
      );

      return;
    }

    await cargarCotizaciones();
  }

  const cotizacionesFiltradas =
    filtro === "Todos"
      ? cotizaciones
      : cotizaciones.filter(
          (cotizacion) =>
            cotizacion.estado === filtro
        );

  function formatoFecha(fecha: string) {
    return new Intl.DateTimeFormat(
      "es-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(fecha));
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
          Clientes
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
          Cotizaciones
        </h1>

        <p className="mt-2 text-gray-600">
          Solicitudes recibidas desde la página web.
        </p>
      </div>

      {/* RESUMEN */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {estados.map((estado) => (
          <div
            key={estado}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {estado}
            </p>

            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              {
                cotizaciones.filter(
                  (cotizacion) =>
                    cotizacion.estado ===
                    estado
                ).length
              }
            </p>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div className="mt-8 flex flex-wrap gap-2">
        {["Todos", ...estados].map(
          (estado) => (
            <button
              key={estado}
              onClick={() =>
                setFiltro(estado)
              }
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                filtro === estado
                  ? "bg-yellow-500 text-black"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
              }`}
            >
              {estado}
            </button>
          )
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* CARGANDO */}
      {cargando ? (
        <div className="mt-8 flex h-60 items-center justify-center rounded-2xl bg-white">
          <Loader2 className="animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {cotizacionesFiltradas.map(
            (cotizacion) => (
              <article
                key={cotizacion.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {cotizacion.nombre}
                      </h2>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                        {cotizacion.estado}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {formatoFecha(
                        cotizacion.created_at
                      )}
                    </p>

                    <p className="mt-4 font-bold text-gray-800">
                      {cotizacion.servicio}
                    </p>
                  </div>

                  <select
                    value={
                      cotizacion.estado
                    }
                    onChange={(e) =>
                      cambiarEstado(
                        cotizacion,
                        e.target
                          .value as EstadoCotizacion
                      )
                    }
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700"
                  >
                    {estados.map(
                      (estado) => (
                        <option
                          key={estado}
                          value={estado}
                        >
                          {estado}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* CONTACTO */}
                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 md:grid-cols-2">
                  <a
                    href={`tel:${cotizacion.telefono}`}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <Phone
                      size={20}
                      className="text-yellow-600"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Teléfono
                      </p>

                      <p className="mt-1 font-bold text-gray-900">
                        {cotizacion.telefono}
                      </p>
                    </div>
                  </a>

                  {cotizacion.correo && (
                    <a
                      href={`mailto:${cotizacion.correo}`}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <Mail
                        size={20}
                        className="text-yellow-600"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Correo
                        </p>

                        <p className="mt-1 truncate font-bold text-gray-900">
                          {cotizacion.correo}
                        </p>
                      </div>
                    </a>
                  )}
                </div>

                {/* MENSAJE */}
                <div className="mt-5 rounded-xl bg-gray-50 p-5">
                  <div className="flex gap-3">
                    <MessageSquare
                      size={20}
                      className="mt-1 shrink-0 text-yellow-600"
                    />

                    <p className="leading-7 text-gray-600">
                      {cotizacion.mensaje}
                    </p>
                  </div>
                </div>

                {/* ELIMINAR */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() =>
                      eliminarCotizacion(
                        cotizacion
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={17} />

                    Eliminar
                  </button>
                </div>
              </article>
            )
          )}

          {cotizacionesFiltradas.length ===
            0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="font-bold text-gray-900">
                No hay cotizaciones.
              </p>

              <p className="mt-2 text-gray-500">
                Las solicitudes enviadas desde
                la página aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}   