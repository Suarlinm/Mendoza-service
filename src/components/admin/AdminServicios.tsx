"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Servicio = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  imagen_path: string | null;
  activo: boolean;
  orden: number;
};

export default function AdminServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  async function cargarServicios() {
    setCargando(true);
    setMensajeError("");

    const { data, error } = await supabase
      .from("servicios")
      .select(
        "id, titulo, descripcion, imagen_url, imagen_path, activo, orden"
      )
      .order("orden", { ascending: true });

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible cargar los servicios."
      );

      setCargando(false);
      return;
    }

    setServicios(data ?? []);
    setCargando(false);
  }

  function limpiarFormulario() {
    setTitulo("");
    setDescripcion("");
    setImagen(null);
    setVistaPrevia(null);
    setEditandoId(null);
    setMostrarFormulario(false);
    setMensajeError("");
  }

  function nuevoServicio() {
    setTitulo("");
    setDescripcion("");
    setEditandoId(null);
    setMensajeError("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editarServicio(servicio: Servicio) {
    setTitulo(servicio.titulo);
    setDescripcion(servicio.descripcion);
    setImagen(null);
    setVistaPrevia(servicio.imagen_url);
    setEditandoId(servicio.id);
    setMensajeError("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

    function seleccionarImagen(
    e: React.ChangeEvent<HTMLInputElement>
    ) {
    const archivo = e.target.files?.[0];

    if (!archivo) {
        return;
    }

    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
        setMensajeError(
        "Solo se permiten imágenes JPG, PNG o WEBP."
        );
        return;
    }

    const limite = 5 * 1024 * 1024;

    if (archivo.size > limite) {
        setMensajeError(
        "La fotografía no puede superar los 5 MB."
        );
        return;
    }

    setMensajeError("");
    setImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
    }

    async function subirImagen(
    archivo: File
    ): Promise<{
    url: string;
    path: string;
    } | null> {
    const extension =
        archivo.name.split(".").pop()?.toLowerCase() || "jpg";

    const nombreArchivo =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { data, error } = await supabase.storage
        .from("servicios")
        .upload(nombreArchivo, archivo, {
        cacheControl: "3600",
        upsert: false,
        contentType: archivo.type,
        });

    if (error) {
        console.error(error);

        setMensajeError(
        "No fue posible subir la fotografía."
        );

        return null;
    }

    const { data: urlData } = supabase.storage
        .from("servicios")
        .getPublicUrl(data.path);

    return {
        url: urlData.publicUrl,
        path: data.path,
    };
    }



    async function guardarServicio(
    e: FormEvent<HTMLFormElement>
    ) {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim()) {
        return;
    }

    setGuardando(true);
    setMensajeError("");

    let nuevaImagenUrl: string | null = null;
    let nuevaImagenPath: string | null = null;

    // Si seleccionó una fotografía nueva
    if (imagen) {
        const resultadoImagen =
        await subirImagen(imagen);

        if (!resultadoImagen) {
        setGuardando(false);
        return;
        }

        nuevaImagenUrl = resultadoImagen.url;
        nuevaImagenPath = resultadoImagen.path;
    }

    /*
    * EDITAR SERVICIO
    */
    if (editandoId !== null) {
        const servicioActual = servicios.find(
        (servicio) => servicio.id === editandoId
        );

        const cambios: {
        titulo: string;
        descripcion: string;
        updated_at: string;
        imagen_url?: string;
        imagen_path?: string;
        } = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        updated_at: new Date().toISOString(),
        };

        if (nuevaImagenUrl && nuevaImagenPath) {
        cambios.imagen_url = nuevaImagenUrl;
        cambios.imagen_path = nuevaImagenPath;
        }

        const { error } = await supabase
        .from("servicios")
        .update(cambios)
        .eq("id", editandoId);

        if (error) {
        console.error(error);

        setMensajeError(
            "No fue posible actualizar el servicio."
        );

        setGuardando(false);
        return;
        }

        /*
        * Eliminar fotografía anterior
        * solamente después de guardar correctamente
        * la nueva.
        */
        if (
        nuevaImagenPath &&
        servicioActual?.imagen_path &&
        servicioActual.imagen_path !== nuevaImagenPath
        ) {
        const { error: errorEliminar } =
            await supabase.storage
            .from("servicios")
            .remove([servicioActual.imagen_path]);

        if (errorEliminar) {
            console.error(
            "No se pudo eliminar imagen anterior:",
            errorEliminar
            );
        }
        }
    } else {
        /*
        * NUEVO SERVICIO
        */

        const ultimoOrden =
        servicios.length > 0
            ? Math.max(
                ...servicios.map(
                (servicio) => servicio.orden
                )
            )
            : 0;

        const { error } = await supabase
        .from("servicios")
        .insert({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            imagen_url: nuevaImagenUrl,
            imagen_path: nuevaImagenPath,
            activo: true,
            orden: ultimoOrden + 1,
        });

        if (error) {
        console.error(error);

        setMensajeError(
            "No fue posible crear el servicio."
        );

        setGuardando(false);
        return;
        }
    }

    await cargarServicios();

    limpiarFormulario();

    setGuardando(false);
    }

  async function cambiarEstado(servicio: Servicio) {
    setMensajeError("");

    const { error } = await supabase
      .from("servicios")
      .update({
        activo: !servicio.activo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", servicio.id);

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible cambiar el estado del servicio."
      );

      return;
    }

    await cargarServicios();
  }

  async function eliminarServicio(servicio: Servicio) {
    const confirmar = window.confirm(
      `¿Deseas eliminar el servicio "${servicio.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    setMensajeError("");

    const { error } = await supabase
      .from("servicios")
      .delete()
      .eq("id", servicio.id);

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible eliminar el servicio."
      );

      return;
    }

    await cargarServicios();
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Contenido
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Servicios
          </h1>

          <p className="mt-2 text-gray-600">
            Administra los servicios que aparecen en la
            página web.
          </p>
        </div>

        <button
          onClick={nuevoServicio}
          className="flex w-fit items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black transition hover:bg-yellow-400"
        >
          <Plus size={20} />

          Nuevo servicio
        </button>
      </div>

      {/* MENSAJE ERROR */}
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
                  ? "Editar servicio"
                  : "Nuevo servicio"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Completa la información del servicio.
              </p>
            </div>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
            >
              <X size={21} />
            </button>
          </div>

          <form
            onSubmit={guardarServicio}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="titulo"
                className="mb-2 block text-sm font-bold text-gray-800"
              >
                Nombre del servicio
              </label>

              <input
                id="titulo"
                value={titulo}
                onChange={(e) =>
                  setTitulo(e.target.value)
                }
                required
                placeholder="Ejemplo: Instalación de pisos"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-bold text-gray-800"
              >
                Descripción
              </label>

              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) =>
                  setDescripcion(e.target.value)
                }
                required
                rows={5}
                placeholder="Describe el servicio..."
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-yellow-500"
              />
            </div>

            {/* FOTOGRAFÍA */}
            <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
                Fotografía del servicio
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
                {vistaPrevia ? (
                <div>
                    <img
                    src={vistaPrevia}
                    alt="Vista previa"
                    className="h-64 w-full rounded-xl object-cover"
                    />

                    <p className="mt-4 text-center text-sm font-semibold text-gray-600">
                    Vista previa
                    </p>
                </div>
                ) : (
                <div className="py-8 text-center">
                    <p className="font-bold text-gray-900">
                    Sin fotografía
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                    Agrega una fotografía relacionada con este servicio.
                    </p>
                </div>
                )}

                <label className="mt-5 block cursor-pointer rounded-lg bg-gray-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-yellow-500 hover:text-black">
                {vistaPrevia
                    ? "Cambiar fotografía"
                    : "Seleccionar fotografía"}

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={seleccionarImagen}
                    className="hidden"
                />
                </label>

                <p className="mt-3 text-center text-xs text-gray-500">
                JPG, PNG o WEBP. Máximo 5 MB.
                </p>
            </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={guardando}
                className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-bold text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                    : "Crear servicio"}
              </button>

              <button
                type="button"
                disabled={guardando}
                onClick={limpiarFormulario}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RESUMEN */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            {servicios.length}
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Publicados
          </p>

          <p className="mt-2 text-3xl font-extrabold text-green-700">
            {
              servicios.filter(
                (servicio) => servicio.activo
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Ocultos
          </p>

          <p className="mt-2 text-3xl font-extrabold text-gray-700">
            {
              servicios.filter(
                (servicio) => !servicio.activo
              ).length
            }
          </p>
        </div>
      </div>

      {/* CARGANDO */}
      {cargando && (
        <div className="mt-8 flex min-h-60 items-center justify-center rounded-2xl bg-white shadow-sm">
          <div className="text-center">
            <Loader2
              size={35}
              className="mx-auto animate-spin text-yellow-500"
            />

            <p className="mt-4 font-semibold text-gray-500">
              Cargando servicios...
            </p>
          </div>
        </div>
      )}

      {/* LISTADO */}
      {!cargando && (
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              Servicios actuales
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Los cambios realizados aquí se guardan en
              Supabase.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {servicios.map((servicio) => (
              <article
                key={servicio.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                {servicio.imagen_url && (
                <img
                    src={servicio.imagen_url}
                    alt={servicio.titulo}
                    className="mb-6 h-52 w-full rounded-xl object-cover"
                />
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {servicio.titulo}
                  </h3>

                  {servicio.activo ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Publicado
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                      Oculto
                    </span>
                  )}
                </div>

                <p className="mt-4 leading-7 text-gray-600">
                  {servicio.descripcion}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  Orden: {servicio.orden}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                  <button
                    onClick={() =>
                      editarServicio(servicio)
                    }
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
                  >
                    <Pencil size={17} />
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(servicio)
                    }
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200"
                  >
                    {servicio.activo ? (
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
                      eliminarServicio(servicio)
                    }
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>

          {servicios.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="font-bold text-gray-900">
                No hay servicios.
              </p>

              <p className="mt-2 text-gray-500">
                Agrega el primer servicio con el botón
                Nuevo servicio.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}