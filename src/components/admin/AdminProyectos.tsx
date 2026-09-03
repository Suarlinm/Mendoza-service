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
  ImagePlus,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type ImagenProyecto = {
  id: number;
  imagen_url: string;
  imagen_path: string;
  orden: number;
};

type VideoProyecto = {
  id: number;
  video_url: string;
  video_path: string;
  orden: number;
};

type Proyecto = {
  id: number;
  titulo: string;
  categoria: string;
  ubicacion: string | null;
  descripcion: string;
  imagen_portada_url: string | null;
  imagen_portada_path: string | null;
  activo: boolean;
  destacado: boolean;
  orden: number;

  proyecto_imagenes?: ImagenProyecto[];
  proyecto_videos?: VideoProyecto[];
};

export default function AdminProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mensajeError, setMensajeError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [imagenPortada, setImagenPortada] =
    useState<File | null>(null);

  const [vistaPortada, setVistaPortada] =
    useState<string | null>(null);

  const [imagenesGaleria, setImagenesGaleria] =
    useState<File[]>([]);

  const [videos, setVideos] =
    useState<File[]>([]);

  useEffect(() => {
    cargarProyectos();
  }, []);

  async function cargarProyectos() {
    setCargando(true);
    setMensajeError("");

    const { data, error } = await supabase
      .from("proyectos")
      .select(`
        id,
        titulo,
        categoria,
        ubicacion,
        descripcion,
        imagen_portada_url,
        imagen_portada_path,
        activo,
        destacado,
        orden,
        proyecto_imagenes (
          id,
          imagen_url,
          imagen_path,
          orden
        ),
        proyecto_videos (
          id,
          video_url,
          video_path,
          orden
        )
      `)
      .order("orden", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible cargar los proyectos."
      );

      setCargando(false);
      return;
    }

    setProyectos((data ?? []) as Proyecto[]);

    setCargando(false);
  }

  function limpiarFormulario() {
    setTitulo("");
    setCategoria("");
    setUbicacion("");
    setDescripcion("");

    setImagenPortada(null);
    setVistaPortada(null);

    setImagenesGaleria([]);
    setVideos([]);

    setEditandoId(null);
    setMostrarFormulario(false);

    setMensajeError("");
  }

  function nuevoProyecto() {
    limpiarFormulario();

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editarProyecto(proyecto: Proyecto) {
    setTitulo(proyecto.titulo);
    setCategoria(proyecto.categoria);
    setUbicacion(proyecto.ubicacion ?? "");
    setDescripcion(proyecto.descripcion);

    setImagenPortada(null);
    setVistaPortada(
      proyecto.imagen_portada_url
    );

    setImagenesGaleria([]);
    setVideos([]);

    setEditandoId(proyecto.id);
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function seleccionarPortada(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!validarImagen(archivo)) {
      return;
    }

    setImagenPortada(archivo);

    setVistaPortada(
      URL.createObjectURL(archivo)
    );
  }

  function seleccionarGaleria(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivos =
      Array.from(e.target.files ?? []);

    if (archivos.length === 0) {
      return;
    }

    const validos = archivos.filter(
      validarImagen
    );

    setImagenesGaleria((actuales) => [
      ...actuales,
      ...validos,
    ]);
  }

  function seleccionarVideos(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivos =
      Array.from(e.target.files ?? []);

    if (archivos.length === 0) {
      return;
    }

    const validos = archivos.filter(
      validarVideo
    );

    setVideos((actuales) => [
      ...actuales,
      ...validos,
    ]);
  }

  function validarImagen(
    archivo: File
  ) {
    const tipos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tipos.includes(archivo.type)) {
      setMensajeError(
        "Las imágenes deben ser JPG, PNG o WEBP."
      );

      return false;
    }

    const limite =
      5 * 1024 * 1024;

    if (archivo.size > limite) {
      setMensajeError(
        "Cada fotografía debe pesar máximo 5 MB."
      );

      return false;
    }

    setMensajeError("");

    return true;
  }

  function validarVideo(
    archivo: File
  ) {
    const tipos = [
      "video/mp4",
      "video/webm",
    ];

    if (!tipos.includes(archivo.type)) {
      setMensajeError(
        "Los videos deben estar en formato MP4 o WEBM."
      );

      return false;
    }

    const limite =
      50 * 1024 * 1024;

    if (archivo.size > limite) {
      setMensajeError(
        "Cada video debe pesar máximo 50 MB."
      );

      return false;
    }

    setMensajeError("");

    return true;
  }

  async function subirArchivo(
    archivo: File,
    carpeta: string
  ) {
    const extension =
      archivo.name
        .split(".")
        .pop()
        ?.toLowerCase() || "bin";

    const nombre =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path =
      `${carpeta}/${nombre}`;

    const { data, error } =
      await supabase.storage
        .from("proyectos")
        .upload(
          path,
          archivo,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: archivo.type,
          }
        );

    if (error) {
      console.error(error);

      return null;
    }

    const { data: urlData } =
      supabase.storage
        .from("proyectos")
        .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  }

  async function guardarProyecto(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !titulo.trim() ||
      !categoria.trim() ||
      !descripcion.trim()
    ) {
      return;
    }

    setGuardando(true);
    setMensajeError("");

    let proyectoId =
      editandoId;

    /*
     * EDITAR PROYECTO
     */
    if (editandoId !== null) {
      const { error } =
        await supabase
          .from("proyectos")
          .update({
            titulo: titulo.trim(),
            categoria,
            ubicacion:
              ubicacion.trim() || null,
            descripcion:
              descripcion.trim(),
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            editandoId
          );

      if (error) {
        console.error(error);

        setMensajeError(
          "No fue posible actualizar el proyecto."
        );

        setGuardando(false);

        return;
      }
    } else {
      /*
       * CREAR PROYECTO
       */

      const ultimoOrden =
        proyectos.length > 0
          ? Math.max(
              ...proyectos.map(
                (p) => p.orden
              )
            )
          : 0;

      const {
        data,
        error,
      } = await supabase
        .from("proyectos")
        .insert({
          titulo:
            titulo.trim(),
          categoria,
          ubicacion:
            ubicacion.trim() || null,
          descripcion:
            descripcion.trim(),
          activo: true,
          destacado: false,
          orden:
            ultimoOrden + 1,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error(error);

        setMensajeError(
          "No fue posible crear el proyecto."
        );

        setGuardando(false);

        return;
      }

      proyectoId = data.id;
    }

    if (!proyectoId) {
      setMensajeError(
        "No se pudo determinar el proyecto."
      );

      setGuardando(false);

      return;
    }

    /*
     * PORTADA
     */
    if (imagenPortada) {
      const portada =
        await subirArchivo(
          imagenPortada,
          `proyecto-${proyectoId}/portada`
        );

      if (!portada) {
        setMensajeError(
          "No fue posible subir la portada."
        );

        setGuardando(false);

        return;
      }

      const proyectoAnterior =
        proyectos.find(
          (p) =>
            p.id === proyectoId
        );

      const { error } =
        await supabase
          .from("proyectos")
          .update({
            imagen_portada_url:
              portada.url,

            imagen_portada_path:
              portada.path,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            proyectoId
          );

      if (error) {
        console.error(error);

        setMensajeError(
          "Se subió la imagen pero no se pudo guardar como portada."
        );

        setGuardando(false);

        return;
      }

      /*
       * Eliminar portada anterior
       */
      if (
        proyectoAnterior
          ?.imagen_portada_path &&
        proyectoAnterior
          .imagen_portada_path !==
          portada.path
      ) {
        await supabase.storage
          .from("proyectos")
          .remove([
            proyectoAnterior
              .imagen_portada_path,
          ]);
      }
    }

    /*
     * GALERÍA
     */
    for (
      let i = 0;
      i <
      imagenesGaleria.length;
      i++
    ) {
      const archivo =
        imagenesGaleria[i];

      const resultado =
        await subirArchivo(
          archivo,
          `proyecto-${proyectoId}/galeria`
        );

      if (!resultado) {
        continue;
      }

      await supabase
        .from(
          "proyecto_imagenes"
        )
        .insert({
          proyecto_id:
            proyectoId,

          imagen_url:
            resultado.url,

          imagen_path:
            resultado.path,

          orden: i + 1,
        });
    }

    /*
     * VIDEOS
     */
    for (
      let i = 0;
      i < videos.length;
      i++
    ) {
      const archivo =
        videos[i];

      const resultado =
        await subirArchivo(
          archivo,
          `proyecto-${proyectoId}/videos`
        );

      if (!resultado) {
        continue;
      }

      await supabase
        .from(
          "proyecto_videos"
        )
        .insert({
          proyecto_id:
            proyectoId,

          video_url:
            resultado.url,

          video_path:
            resultado.path,

          orden: i + 1,
        });
    }

    await cargarProyectos();

    limpiarFormulario();

    setGuardando(false);
  }

  async function cambiarEstado(
    proyecto: Proyecto
  ) {
    const { error } =
      await supabase
        .from("proyectos")
        .update({
          activo:
            !proyecto.activo,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          proyecto.id
        );

    if (error) {
      setMensajeError(
        "No fue posible cambiar el estado."
      );

      return;
    }

    await cargarProyectos();
  }

  async function cambiarDestacado(
    proyecto: Proyecto
  ) {
    const { error } =
      await supabase
        .from("proyectos")
        .update({
          destacado:
            !proyecto.destacado,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          proyecto.id
        );

    if (error) {
      setMensajeError(
        "No fue posible cambiar el proyecto destacado."
      );

      return;
    }

    await cargarProyectos();
  }

  async function eliminarImagenGaleria(
    imagen: ImagenProyecto
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar esta fotografía?"
      );

    if (!confirmar) {
      return;
    }

    await supabase.storage
      .from("proyectos")
      .remove([
        imagen.imagen_path,
      ]);

    await supabase
      .from(
        "proyecto_imagenes"
      )
      .delete()
      .eq(
        "id",
        imagen.id
      );

    await cargarProyectos();
  }

  async function eliminarVideo(
    video: VideoProyecto
  ) {
    const confirmar =
      window.confirm(
        "¿Deseas eliminar este video?"
      );

    if (!confirmar) {
      return;
    }

    await supabase.storage
      .from("proyectos")
      .remove([
        video.video_path,
      ]);

    await supabase
      .from(
        "proyecto_videos"
      )
      .delete()
      .eq(
        "id",
        video.id
      );

    await cargarProyectos();
  }

  async function eliminarProyecto(
    proyecto: Proyecto
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar "${proyecto.titulo}"?`
      );

    if (!confirmar) {
      return;
    }

    const archivos: string[] =
      [];

    if (
      proyecto.imagen_portada_path
    ) {
      archivos.push(
        proyecto.imagen_portada_path
      );
    }

    proyecto.proyecto_imagenes
      ?.forEach((imagen) => {
        archivos.push(
          imagen.imagen_path
        );
      });

    proyecto.proyecto_videos
      ?.forEach((video) => {
        archivos.push(
          video.video_path
        );
      });

    if (
      archivos.length > 0
    ) {
      await supabase.storage
        .from("proyectos")
        .remove(archivos);
    }

    const { error } =
      await supabase
        .from("proyectos")
        .delete()
        .eq(
          "id",
          proyecto.id
        );

    if (error) {
      setMensajeError(
        "No fue posible eliminar el proyecto."
      );

      return;
    }

    await cargarProyectos();
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Portafolio
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Proyectos
          </h1>

          <p className="mt-2 text-gray-600">
            Administra fotografías, videos y trabajos realizados.
          </p>
        </div>

        <button
          onClick={nuevoProyecto}
          className="flex w-fit items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
        >
          <Plus size={20} />

          Nuevo proyecto
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
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                {editandoId !== null
                  ? "Editar proyecto"
                  : "Nuevo proyecto"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Agrega información, fotografías y videos.
              </p>
            </div>

            <button
              type="button"
              onClick={
                limpiarFormulario
              }
              className="rounded-lg bg-gray-100 p-2"
            >
              <X size={21} />
            </button>
          </div>

          <form
            onSubmit={
              guardarProyecto
            }
            className="mt-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nombre
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
                  Categoría
                </label>

                <select
                  value={categoria}
                  onChange={(e) =>
                    setCategoria(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                >
                  <option value="">
                    Selecciona
                  </option>

                  <option value="Pintura">
                    Pintura
                  </option>

                  <option value="Cocinas">
                    Cocinas
                  </option>

                  <option value="Baños">
                    Baños
                  </option>

                  <option value="Tablaroca">
                    Tablaroca
                  </option>

                  <option value="Remodelaciones">
                    Remodelaciones
                  </option>

                  <option value="Otros">
                    Otros
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold">
                  Ubicación
                </label>

                <input
                  value={ubicacion}
                  onChange={(e) =>
                    setUbicacion(
                      e.target.value
                    )
                  }
                  placeholder="Ejemplo: Connecticut"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold">
                  Descripción
                </label>

                <textarea
                  value={
                    descripcion
                  }
                  onChange={(e) =>
                    setDescripcion(
                      e.target.value
                    )
                  }
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            {/* PORTADA */}
            <div className="mt-7">
              <label className="mb-3 block font-bold">
                Imagen principal
              </label>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                {vistaPortada ? (
                  <img
                    src={
                      vistaPortada
                    }
                    alt="Portada"
                    className="h-72 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <ImagePlus className="mx-auto" />

                    <p className="mt-3">
                      Sin imagen
                    </p>
                  </div>
                )}

                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-bold text-white">
                  <Upload size={18} />

                  {vistaPortada
                    ? "Cambiar portada"
                    : "Seleccionar portada"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      seleccionarPortada
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* GALERÍA */}
            <div className="mt-7">
              <label className="mb-3 block font-bold">
                Galería
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8">
                <ImagePlus />

                Agregar fotografías

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    seleccionarGaleria
                  }
                  className="hidden"
                />
              </label>

              {imagenesGaleria.length >
                0 && (
                <div className="mt-4 space-y-2">
                  {imagenesGaleria.map(
                    (
                      archivo,
                      index
                    ) => (
                      <div
                        key={`${archivo.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
                      >
                        <span className="truncate text-sm">
                          {
                            archivo.name
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setImagenesGaleria(
                              (
                                actuales
                              ) =>
                                actuales.filter(
                                  (
                                    _,
                                    i
                                  ) =>
                                    i !==
                                    index
                                )
                            )
                          }
                        >
                          <X size={17} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* VIDEOS */}
            <div className="mt-7">
              <label className="mb-3 block font-bold">
                Videos cortos
              </label>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-8">
                <Video />

                Agregar videos

                <input
                  type="file"
                  multiple
                  accept="video/mp4,video/webm"
                  onChange={
                    seleccionarVideos
                  }
                  className="hidden"
                />
              </label>

              {videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {videos.map(
                    (
                      archivo,
                      index
                    ) => (
                      <div
                        key={`${archivo.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
                      >
                        <span className="truncate text-sm">
                          {
                            archivo.name
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setVideos(
                              (
                                actuales
                              ) =>
                                actuales.filter(
                                  (
                                    _,
                                    i
                                  ) =>
                                    i !==
                                    index
                                )
                            )
                          }
                        >
                          <X size={17} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={
                  guardando
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-bold"
              >
                {guardando && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {guardando
                  ? "Guardando..."
                  : editandoId !==
                      null
                    ? "Guardar cambios"
                    : "Crear proyecto"}
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

      {/* LISTADO */}
      {cargando ? (
        <div className="mt-8 flex h-60 items-center justify-center rounded-2xl bg-white">
          <Loader2 className="animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {proyectos.map(
            (proyecto) => (
              <article
                key={
                  proyecto.id
                }
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {proyecto.imagen_portada_url ? (
                  <img
                    src={
                      proyecto.imagen_portada_url
                    }
                    alt={
                      proyecto.titulo
                    }
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-gray-200">
                    Sin portada
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold">
                      {
                        proyecto.categoria
                      }
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {proyecto.activo
                        ? "Publicado"
                        : "Oculto"}
                    </span>

                    {proyecto.destacado && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs">
                        Destacado
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold">
                    {
                      proyecto.titulo
                    }
                  </h3>

                  {proyecto.ubicacion && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={16} />

                      {
                        proyecto.ubicacion
                      }
                    </p>
                  )}

                  <p className="mt-4 text-gray-600">
                    {
                      proyecto.descripcion
                    }
                  </p>

                  {/* GALERÍA EXISTENTE */}
                  {proyecto.proyecto_imagenes &&
                    proyecto
                      .proyecto_imagenes
                      .length >
                      0 && (
                      <div className="mt-6">
                        <p className="mb-3 font-bold">
                          Galería
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          {proyecto.proyecto_imagenes.map(
                            (
                              imagen
                            ) => (
                              <div
                                key={
                                  imagen.id
                                }
                                className="relative"
                              >
                                <img
                                  src={
                                    imagen.imagen_url
                                  }
                                  alt=""
                                  className="h-24 w-full rounded-lg object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    eliminarImagenGaleria(
                                      imagen
                                    )
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* VIDEOS EXISTENTES */}
                  {proyecto.proyecto_videos &&
                    proyecto
                      .proyecto_videos
                      .length >
                      0 && (
                      <div className="mt-6">
                        <p className="mb-3 font-bold">
                          Videos
                        </p>

                        <div className="space-y-3">
                          {proyecto.proyecto_videos.map(
                            (
                              video
                            ) => (
                              <div
                                key={
                                  video.id
                                }
                                className="rounded-lg bg-gray-100 p-3"
                              >
                                <video
                                  src={
                                    video.video_url
                                  }
                                  controls
                                  className="w-full rounded-lg"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    eliminarVideo(
                                      video
                                    )
                                  }
                                  className="mt-2 flex items-center gap-2 text-sm font-bold text-red-600"
                                >
                                  <Trash2 size={15} />

                                  Eliminar video
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
                    <button
                      onClick={() =>
                        editarProyecto(
                          proyecto
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold"
                    >
                      <Pencil size={17} />

                      Editar
                    </button>

                    <button
                      onClick={() =>
                        cambiarEstado(
                          proyecto
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold"
                    >
                      {proyecto.activo ? (
                        <>
                          <EyeOff size={17} />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye size={17} />
                          Publicar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        cambiarDestacado(
                          proyecto
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-yellow-100 px-4 py-2 text-sm font-bold"
                    >
                      <Star
                        size={17}
                        fill={
                          proyecto.destacado
                            ? "currentColor"
                            : "none"
                        }
                      />

                      Destacar
                    </button>

                    <button
                      onClick={() =>
                        eliminarProyecto(
                          proyecto
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
                    >
                      <Trash2 size={17} />

                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}