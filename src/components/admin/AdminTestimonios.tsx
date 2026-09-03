"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Testimonio = {
  id: number;
  nombre: string;
  servicio: string | null;
  comentario: string;
  calificacion: number;
  activo: boolean;
  orden: number;
};

export default function AdminTestimonios() {
  const [testimonios, setTestimonios] =
    useState<Testimonio[]>([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);

  useEffect(() => {
    cargarTestimonios();
  }, []);

  async function cargarTestimonios() {
    setCargando(true);
    setMensajeError("");

    const { data, error } = await supabase
      .from("testimonios")
      .select(
        "id, nombre, servicio, comentario, calificacion, activo, orden"
      )
      .order("orden", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible cargar los testimonios."
      );

      setCargando(false);
      return;
    }

    setTestimonios(data ?? []);
    setCargando(false);
  }

  function limpiarFormulario() {
    setNombre("");
    setServicio("");
    setComentario("");
    setCalificacion(5);

    setEditandoId(null);
    setMostrarFormulario(false);
    setMensajeError("");
  }

  function nuevoTestimonio() {
    limpiarFormulario();

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editarTestimonio(
    testimonio: Testimonio
  ) {
    setNombre(testimonio.nombre);
    setServicio(testimonio.servicio ?? "");
    setComentario(testimonio.comentario);
    setCalificacion(testimonio.calificacion);

    setEditandoId(testimonio.id);
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function guardarTestimonio(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !comentario.trim()
    ) {
      return;
    }

    setGuardando(true);
    setMensajeError("");

    if (editandoId !== null) {
      const { error } = await supabase
        .from("testimonios")
        .update({
          nombre: nombre.trim(),
          servicio:
            servicio.trim() || null,
          comentario:
            comentario.trim(),
          calificacion,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", editandoId);

      if (error) {
        console.error(error);

        setMensajeError(
          "No fue posible actualizar el testimonio."
        );

        setGuardando(false);
        return;
      }
    } else {
      const ultimoOrden =
        testimonios.length > 0
          ? Math.max(
              ...testimonios.map(
                (testimonio) =>
                  testimonio.orden
              )
            )
          : 0;

      const { error } = await supabase
        .from("testimonios")
        .insert({
          nombre: nombre.trim(),
          servicio:
            servicio.trim() || null,
          comentario:
            comentario.trim(),
          calificacion,
          activo: true,
          orden: ultimoOrden + 1,
        });

      if (error) {
        console.error(error);

        setMensajeError(
          "No fue posible crear el testimonio."
        );

        setGuardando(false);
        return;
      }
    }

    await cargarTestimonios();

    limpiarFormulario();

    setGuardando(false);
  }

  async function cambiarEstado(
    testimonio: Testimonio
  ) {
    const { error } = await supabase
      .from("testimonios")
      .update({
        activo: !testimonio.activo,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", testimonio.id);

    if (error) {
      setMensajeError(
        "No fue posible cambiar el estado."
      );

      return;
    }

    await cargarTestimonios();
  }

  async function eliminarTestimonio(
    testimonio: Testimonio
  ) {
    const confirmar = window.confirm(
      `¿Deseas eliminar el testimonio de "${testimonio.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    const { error } = await supabase
      .from("testimonios")
      .delete()
      .eq("id", testimonio.id);

    if (error) {
      setMensajeError(
        "No fue posible eliminar el testimonio."
      );

      return;
    }

    await cargarTestimonios();
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Opiniones
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Testimonios
          </h1>

          <p className="mt-2 text-gray-600">
            Administra las opiniones que aparecen en la página.
          </p>
        </div>

        <button
          onClick={nuevoTestimonio}
          className="flex w-fit items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
        >
          <Plus size={20} />

          Nuevo testimonio
        </button>
      </div>

      {mensajeError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {mensajeError}
        </div>
      )}

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">
              {editandoId !== null
                ? "Editar testimonio"
                : "Nuevo testimonio"}
            </h2>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg bg-gray-100 p-2"
            >
              <X size={21} />
            </button>
          </div>

          <form
            onSubmit={guardarTestimonio}
            className="mt-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {/* NOMBRE */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nombre del cliente
                </label>

                <input
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  required
                  placeholder="Ejemplo: Carlos M."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              {/* SERVICIO */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Servicio realizado
                </label>

                <input
                  value={servicio}
                  onChange={(e) =>
                    setServicio(
                      e.target.value
                    )
                  }
                  placeholder="Ejemplo: Remodelación de cocina"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              {/* CALIFICACIÓN */}
              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-bold">
                  Calificación
                </label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (numero) => (
                      <button
                        key={numero}
                        type="button"
                        onClick={() =>
                          setCalificacion(
                            numero
                          )
                        }
                        className="rounded-lg p-1"
                        aria-label={`${numero} estrellas`}
                      >
                        <Star
                          size={28}
                          className={
                            numero <=
                            calificacion
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fill={
                            numero <=
                            calificacion
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* COMENTARIO */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold">
                  Comentario
                </label>

                <textarea
                  value={comentario}
                  onChange={(e) =>
                    setComentario(
                      e.target.value
                    )
                  }
                  required
                  rows={5}
                  placeholder="Escribe la opinión del cliente..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={guardando}
                className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black disabled:opacity-60"
              >
                {guardando && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {guardando
                  ? "Guardando..."
                  : editandoId !== null
                    ? "Guardar cambios"
                    : "Crear testimonio"}
              </button>

              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-lg border border-gray-300 px-6 py-3 font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTADO */}
      {cargando ? (
        <div className="mt-8 flex h-60 items-center justify-center rounded-2xl bg-white">
          <Loader2 className="animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {testimonios.map(
            (testimonio) => (
              <article
                key={testimonio.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (numero) => (
                      <Star
                        key={numero}
                        size={19}
                        className={
                          numero <=
                          testimonio.calificacion
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                        fill={
                          numero <=
                          testimonio.calificacion
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  “{testimonio.comentario}”
                </p>

                <div className="mt-6 border-t pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-gray-900">
                      {testimonio.nombre}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        testimonio.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {testimonio.activo
                        ? "Publicado"
                        : "Oculto"}
                    </span>
                  </div>

                  {testimonio.servicio && (
                    <p className="mt-2 text-sm font-semibold text-yellow-600">
                      {testimonio.servicio}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
                  <button
                    onClick={() =>
                      editarTestimonio(
                        testimonio
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(
                        testimonio
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold"
                  >
                    {testimonio.activo ? (
                      <>
                        <EyeOff size={16} />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Publicar
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      eliminarTestimonio(
                        testimonio
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}