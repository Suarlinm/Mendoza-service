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
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type ImagenProyecto = {
  id: number;
  proyecto_id: number;
  imagen_url: string;
  imagen_path: string;
  mostrar_inicio: boolean;

  proyectos: {
    id: number;
    titulo: string;
    categoria: string;
    activo: boolean;
  } | null;
};

type ImagenInicio = {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string;
  imagen_path: string;
  activo: boolean;
  orden: number;
};

export default function AdminGaleria() {
  const [imagenesProyecto, setImagenesProyecto] =
    useState<ImagenProyecto[]>([]);

  const [imagenesInicio, setImagenesInicio] =
    useState<ImagenInicio[]>([]);

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

  const [imagen, setImagen] =
    useState<File | null>(null);

  const [vistaPrevia, setVistaPrevia] =
    useState<string | null>(null);

  useEffect(() => {
    cargarGaleria();
  }, []);

  async function cargarGaleria() {
    setCargando(true);
    setError("");

    const {
      data: datosProyecto,
      error: errorProyecto,
    } = await supabase
      .from("proyecto_imagenes")
      .select(`
        id,
        proyecto_id,
        imagen_url,
        imagen_path,
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
        "No fue posible cargar las fotografías de proyectos."
      );

      setCargando(false);
      return;
    }

    const {
      data: datosInicio,
      error: errorInicio,
    } = await supabase
      .from("galeria_inicio")
      .select(`
        id,
        titulo,
        descripcion,
        imagen_url,
        imagen_path,
        activo,
        orden
      `)
      .order("orden", {
        ascending: true,
      });

    if (errorInicio) {
      console.error(errorInicio);

      setError(
        "No fue posible cargar la galería del inicio."
      );

      setCargando(false);
      return;
    }

    setImagenesProyecto(
      (datosProyecto ?? []) as unknown as ImagenProyecto[]
    );

    setImagenesInicio(
      (datosInicio ?? []) as ImagenInicio[]
    );

    setCargando(false);
  }

  function limpiarFormulario() {
    setTitulo("");
    setDescripcion("");
    setImagen(null);
    setVistaPrevia(null);
    setMostrarFormulario(false);
    setError("");
  }

  function seleccionarImagen(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      e.target.files?.[0];

    if (!archivo) {
      return;
    }

    const tipos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tipos.includes(archivo.type)) {
      setError(
        "Solo se permiten imágenes JPG, PNG o WEBP."
      );

      return;
    }

    if (
      archivo.size >
      5 * 1024 * 1024
    ) {
      setError(
        "La fotografía debe pesar máximo 5 MB."
      );

      return;
    }

    setError("");
    setImagen(archivo);

    setVistaPrevia(
      URL.createObjectURL(archivo)
    );
  }

  async function cambiarMostrarInicio(
    imagen: ImagenProyecto
  ) {
    const { error } = await supabase
      .from("proyecto_imagenes")
      .update({
        mostrar_inicio:
          !imagen.mostrar_inicio,
      })
      .eq("id", imagen.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible cambiar la visibilidad."
      );

      return;
    }

    await cargarGaleria();
  }

  async function cambiarEstadoIndependiente(
    imagen: ImagenInicio
  ) {
    const { error } = await supabase
      .from("galeria_inicio")
      .update({
        activo: !imagen.activo,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", imagen.id);

    if (error) {
      console.error(error);

      setError(
        "No fue posible cambiar el estado."
      );

      return;
    }

    await cargarGaleria();
  }

  async function guardarImagen(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !titulo.trim() ||
      !imagen
    ) {
      setError(
        "Agrega un título y selecciona una fotografía."
      );

      return;
    }

    setGuardando(true);
    setError("");

    const extension =
      imagen.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const nombreArchivo =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path =
      `galeria/${nombreArchivo}`;

    const {
      data: archivoSubido,
      error: errorSubida,
    } = await supabase.storage
      .from("inicio-media")
      .upload(
        path,
        imagen,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: imagen.type,
        }
      );

    if (
      errorSubida ||
      !archivoSubido
    ) {
      console.error(errorSubida);

      setError(
        "No fue posible subir la fotografía."
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
      imagenesInicio.length > 0
        ? Math.max(
            ...imagenesInicio.map(
              (item) => item.orden
            )
          )
        : 0;

    const {
      error: errorRegistro,
    } = await supabase
      .from("galeria_inicio")
      .insert({
        titulo: titulo.trim(),

        descripcion:
          descripcion.trim() || null,

        imagen_url:
          urlData.publicUrl,

        imagen_path:
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
        "La fotografía se subió, pero no pudo guardarse."
      );

      setGuardando(false);
      return;
    }

    await cargarGaleria();

    limpiarFormulario();

    setGuardando(false);
  }

  async function eliminarImagenIndependiente(
    imagen: ImagenInicio
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar definitivamente "${imagen.titulo}"?`
      );

    if (!confirmar) {
      return;
    }

    const {
      error: errorArchivo,
    } = await supabase.storage
      .from("inicio-media")
      .remove([
        imagen.imagen_path,
      ]);

    if (errorArchivo) {
      console.error(
        errorArchivo
      );

      setError(
        "No fue posible eliminar el archivo."
      );

      return;
    }

    const {
      error: errorRegistro,
    } = await supabase
      .from("galeria_inicio")
      .delete()
      .eq("id", imagen.id);

    if (errorRegistro) {
      console.error(
        errorRegistro
      );

      setError(
        "No fue posible eliminar el registro."
      );

      return;
    }

    await cargarGaleria();
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
            Galería
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Elige fotografías de proyectos o sube
            fotografías exclusivas para la galería
            de la página principal.
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

          Subir fotografía
        </button>
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Nueva fotografía
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Esta fotografía será independiente
                de los proyectos.
              </p>
            </div>

            <button
              type="button"
              onClick={
                limpiarFormulario
              }
              className="rounded-lg bg-gray-100 p-2"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={
              guardarImagen
            }
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
                Fotografía
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                {vistaPrevia ? (
                  <img
                    src={vistaPrevia}
                    alt="Vista previa"
                    className="h-72 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <ImagePlus className="mx-auto" />

                    <p className="mt-3">
                      Selecciona una fotografía
                    </p>
                  </div>
                )}

                <label className="mt-5 block cursor-pointer rounded-lg bg-gray-900 px-5 py-3 text-center font-bold text-white">
                  Seleccionar fotografía

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      seleccionarImagen
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={
                  guardando
                }
                className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black disabled:opacity-60"
              >
                {guardando && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {guardando
                  ? "Guardando..."
                  : "Agregar a galería"}
              </button>

              <button
                type="button"
                onClick={
                  limpiarFormulario
                }
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

      {/* FOTOS DE PROYECTOS */}
      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Fotografías de proyectos
          </h2>

          <p className="mt-2 text-gray-600">
            Elige cuáles quieres mostrar también
            en la página de inicio.
          </p>
        </div>

        {imagenesProyecto.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {imagenesProyecto.map(
              (imagen) => (
                <article
                  key={imagen.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={
                        imagen.imagen_url
                      }
                      alt={
                        imagen.proyectos
                          ?.titulo ??
                        "Proyecto"
                      }
                      className="h-60 w-full object-cover"
                    />

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                        imagen.mostrar_inicio
                          ? "bg-green-500 text-white"
                          : "bg-black/70 text-white"
                      }`}
                    >
                      {imagen.mostrar_inicio
                        ? "Visible en Inicio"
                        : "No visible en Inicio"}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                      {imagen.proyectos
                        ?.categoria ??
                        "Proyecto"}
                    </p>

                    <h3 className="mt-2 font-extrabold text-gray-900">
                      {imagen.proyectos
                        ?.titulo ??
                        "Proyecto"}
                    </h3>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarMostrarInicio(
                            imagen
                          )
                        }
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${
                          imagen.mostrar_inicio
                            ? "bg-gray-900 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {imagen.mostrar_inicio ? (
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

                      {imagen.proyectos && (
                        <a
                          href={`/proyectos/${imagen.proyectos.id}`}
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
          <div className="mt-6 rounded-xl bg-white p-10 text-center">
            No hay fotografías de proyectos.
          </div>
        )}
      </section>

      {/* FOTOS INDEPENDIENTES */}
      <section className="mt-14 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Fotografías exclusivas del Inicio
        </h2>

        <p className="mt-2 text-gray-600">
          Estas fotografías no pertenecen a ningún
          proyecto.
        </p>

        {imagenesInicio.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {imagenesInicio.map(
              (imagen) => (
                <article
                  key={imagen.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <img
                    src={
                      imagen.imagen_url
                    }
                    alt={
                      imagen.titulo
                    }
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-gray-900">
                          {imagen.titulo}
                        </h3>

                        {imagen.descripcion && (
                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            {imagen.descripcion}
                          </p>
                        )}
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          imagen.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {imagen.activo
                          ? "Visible"
                          : "Oculta"}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2 border-t pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          cambiarEstadoIndependiente(
                            imagen
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold"
                      >
                        {imagen.activo ? (
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
                          eliminarImagenIndependiente(
                            imagen
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
            Todavía no has subido fotografías
            exclusivas para el Inicio.
          </div>
        )}
      </section>
    </div>
  );
}