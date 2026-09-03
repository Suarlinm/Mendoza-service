"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type VideoProyecto = {
  id: number;
  proyecto_id: number;
  video_url: string;
  video_path: string;
  mostrar_inicio: boolean;

  proyectos: {
    id: number;
    titulo: string;
    categoria: string;
    activo: boolean;
  } | null;
};

type VideoInicio = {
  id: number;
  titulo: string;
  descripcion: string | null;
  video_url: string;
  video_path: string;
  activo: boolean;
  orden: number;
};

export default function AdminVideos() {
  const [videosProyecto, setVideosProyecto] =
    useState<VideoProyecto[]>([]);

  const [videosInicio, setVideosInicio] =
    useState<VideoInicio[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [titulo, setTitulo] =
    useState("");

  const [descripcion, setDescripcion] =
    useState("");

  const [video, setVideo] =
    useState<File | null>(null);

  const [vistaPrevia, setVistaPrevia] =
    useState<string | null>(null);

  useEffect(() => {
    cargarVideos();
  }, []);

  async function cargarVideos() {
    setCargando(true);
    setError("");

    const {
      data: datosProyecto,
      error: errorProyecto,
    } = await supabase
      .from("proyecto_videos")
      .select(`
        id,
        proyecto_id,
        video_url,
        video_path,
        mostrar_inicio,
        proyectos (
          id,
          titulo,
          categoria,
          activo
        )
      `)
      .order("id", {
        ascending: false,
      });

    if (errorProyecto) {
      console.error(errorProyecto);

      setError(
        "No fue posible cargar los videos de proyectos."
      );

      setCargando(false);
      return;
    }

    const {
      data: datosInicio,
      error: errorInicio,
    } = await supabase
      .from("videos_inicio")
      .select(`
        id,
        titulo,
        descripcion,
        video_url,
        video_path,
        activo,
        orden
      `)
      .order("orden", {
        ascending: true,
      });

    if (errorInicio) {
      console.error(errorInicio);

      setError(
        "No fue posible cargar los videos del Inicio."
      );

      setCargando(false);
      return;
    }

    setVideosProyecto(
      (datosProyecto ?? []) as unknown as VideoProyecto[]
    );

    setVideosInicio(
      (datosInicio ?? []) as VideoInicio[]
    );

    setCargando(false);
  }

  function limpiarFormulario() {
    setTitulo("");
    setDescripcion("");
    setVideo(null);
    setVistaPrevia(null);
    setMostrarFormulario(false);
    setError("");
  }

  function seleccionarVideo(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      e.target.files?.[0];

    if (!archivo) {
      return;
    }

    const permitidos = [
      "video/mp4",
      "video/webm",
    ];

    if (!permitidos.includes(archivo.type)) {
      setError(
        "Solo se permiten videos MP4 o WEBM."
      );

      return;
    }

    if (
      archivo.size >
      50 * 1024 * 1024
    ) {
      setError(
        "El video debe pesar máximo 50 MB."
      );

      return;
    }

    setError("");
    setVideo(archivo);

    setVistaPrevia(
      URL.createObjectURL(archivo)
    );
  }

  async function cambiarMostrarInicio(
    video: VideoProyecto
  ) {
    const { error } = await supabase
      .from("proyecto_videos")
      .update({
        mostrar_inicio:
          !video.mostrar_inicio,
      })
      .eq("id", video.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible cambiar la visibilidad del video."
      );

      return;
    }

    await cargarVideos();
  }

  async function cambiarEstadoIndependiente(
    video: VideoInicio
  ) {
    const { error } = await supabase
      .from("videos_inicio")
      .update({
        activo: !video.activo,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", video.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible cambiar el estado."
      );

      return;
    }

    await cargarVideos();
  }

  async function guardarVideo(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !titulo.trim() ||
      !video
    ) {
      setError(
        "Agrega un título y selecciona un video."
      );

      return;
    }

    setGuardando(true);
    setError("");

    const extension =
      video.name
        .split(".")
        .pop()
        ?.toLowerCase() || "mp4";

    const nombreArchivo =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path =
      `videos/${nombreArchivo}`;

    const {
      data: archivoSubido,
      error: errorSubida,
    } = await supabase.storage
      .from("inicio-media")
      .upload(
        path,
        video,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: video.type,
        }
      );

    if (
      errorSubida ||
      !archivoSubido
    ) {
      console.error(errorSubida);

      setError(
        "No fue posible subir el video."
      );

      setGuardando(false);
      return;
    }

    const { data: urlData } =
      supabase.storage
        .from("inicio-media")
        .getPublicUrl(
          archivoSubido.path
        );

    const ultimoOrden =
      videosInicio.length > 0
        ? Math.max(
            ...videosInicio.map(
              (item) => item.orden
            )
          )
        : 0;

    const {
      error: errorRegistro,
    } = await supabase
      .from("videos_inicio")
      .insert({
        titulo: titulo.trim(),

        descripcion:
          descripcion.trim() || null,

        video_url:
          urlData.publicUrl,

        video_path:
          archivoSubido.path,

        activo: true,

        orden:
          ultimoOrden + 1,
      });

    if (errorRegistro) {
      console.error(
        errorRegistro
      );

      await supabase.storage
        .from("inicio-media")
        .remove([
          archivoSubido.path,
        ]);

      setError(
        "El video se subió, pero no pudo guardarse."
      );

      setGuardando(false);
      return;
    }

    await cargarVideos();

    limpiarFormulario();

    setGuardando(false);
  }

  async function eliminarVideoIndependiente(
    video: VideoInicio
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar definitivamente "${video.titulo}"?`
      );

    if (!confirmar) {
      return;
    }

    const {
      error: errorArchivo,
    } = await supabase.storage
      .from("inicio-media")
      .remove([
        video.video_path,
      ]);

    if (errorArchivo) {
      console.error(errorArchivo);

      setError(
        "No fue posible eliminar el archivo."
      );

      return;
    }

    const {
      error: errorRegistro,
    } = await supabase
      .from("videos_inicio")
      .delete()
      .eq("id", video.id);

    if (errorRegistro) {
      console.error(errorRegistro);

      setError(
        "No fue posible eliminar el video."
      );

      return;
    }

    await cargarVideos();
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
      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Página de inicio
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Videos
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Elige videos de proyectos o sube videos
            exclusivos para la página principal.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMostrarFormulario(true)
          }
          className="flex w-fit items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
        >
          <Plus size={19} />

          Subir video
        </button>
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Nuevo video
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Este video será independiente de los proyectos.
              </p>
            </div>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg bg-gray-100 p-2"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={guardarVideo}
            className="mt-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Título
                </label>

                <input
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Descripción
                </label>

                <input
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-bold">
                Video
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                {vistaPrevia ? (
                  <div className="flex justify-center">
                    <video
                      src={vistaPrevia}
                      controls
                      playsInline
                      className="max-h-[450px] w-full max-w-[430px] rounded-xl bg-black object-contain"
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <Video className="mx-auto" />

                    <p className="mt-3">
                      Selecciona un video
                    </p>
                  </div>
                )}

                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-center font-bold text-white">
                  <Upload size={18} />

                  Seleccionar video

                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={seleccionarVideo}
                    className="hidden"
                  />
                </label>

                <p className="mt-3 text-center text-xs text-gray-500">
                  MP4 o WEBM. Máximo 50 MB.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                  : "Agregar video"}
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

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* VIDEOS DE PROYECTOS */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Videos de proyectos
        </h2>

        <p className="mt-2 text-gray-600">
          Elige cuáles quieres mostrar también
          en la página principal.
        </p>

        {videosProyecto.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-6 xl:justify-start">
            {videosProyecto.map(
              (video) => (
                <article
                  key={video.id}
                  className="w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="relative flex justify-center bg-black p-2">
                    <video
                      src={video.video_url}
                      controls
                      preload="metadata"
                      playsInline
                      className="max-h-[450px] w-full rounded-xl bg-black object-contain"
                    />

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                        video.mostrar_inicio
                          ? "bg-green-500 text-white"
                          : "bg-black/70 text-white"
                      }`}
                    >
                      {video.mostrar_inicio
                        ? "Visible en Inicio"
                        : "No visible en Inicio"}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                      {video.proyectos
                        ?.categoria ??
                        "Proyecto"}
                    </p>

                    <h3 className="mt-2 font-extrabold text-gray-900">
                      {video.proyectos
                        ?.titulo ??
                        "Proyecto"}
                    </h3>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarMostrarInicio(
                            video
                          )
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${
                          video.mostrar_inicio
                            ? "bg-gray-900 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {video.mostrar_inicio ? (
                          <>
                            <EyeOff size={17} />
                            Quitar del Inicio
                          </>
                        ) : (
                          <>
                            <Eye size={17} />
                            Mostrar en Inicio
                          </>
                        )}
                      </button>

                      {video.proyectos && (
                        <a
                          href={`/proyectos/${video.proyectos.id}`}
                          target="_blank"
                          className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-3 text-sm font-bold text-gray-700"
                        >
                          <ExternalLink size={16} />

                          Ver
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-10 text-center text-gray-500">
            No hay videos de proyectos.
          </div>
        )}
      </section>

      {/* VIDEOS INDEPENDIENTES */}
      <section className="mt-14 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Videos exclusivos del Inicio
        </h2>

        <p className="mt-2 text-gray-600">
          Estos videos no pertenecen a ningún proyecto.
        </p>

        {videosInicio.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-6 xl:justify-start">
            {videosInicio.map(
              (video) => (
                <article
                  key={video.id}
                  className="w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="flex justify-center bg-black p-2">
                    <video
                      src={video.video_url}
                      controls
                      preload="metadata"
                      playsInline
                      className="max-h-[450px] w-full rounded-xl bg-black object-contain"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-gray-900">
                          {video.titulo}
                        </h3>

                        {video.descripcion && (
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            {video.descripcion}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          video.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {video.activo
                          ? "Visible"
                          : "Oculto"}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2 border-t pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarEstadoIndependiente(
                            video
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold"
                      >
                        {video.activo ? (
                          <>
                            <EyeOff size={16} />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            Mostrar
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarVideoIndependiente(
                            video
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600"
                      >
                        <Trash2 size={16} />

                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-white p-10 text-center text-gray-500">
            Todavía no has subido videos exclusivos para el Inicio.
          </div>
        )}
      </section>
    </div>
  );
}