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
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Comparacion = {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string | null;

  imagen_antes_url: string | null;
  imagen_antes_path: string | null;

  imagen_despues_url: string | null;
  imagen_despues_path: string | null;

  activo: boolean;
  orden: number;
};

export default function AdminAntesDespues() {
  const [comparaciones, setComparaciones] =
    useState<Comparacion[]>([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mensajeError, setMensajeError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [imagenAntes, setImagenAntes] =
    useState<File | null>(null);

  const [imagenDespues, setImagenDespues] =
    useState<File | null>(null);

  const [vistaAntes, setVistaAntes] =
    useState<string | null>(null);

  const [vistaDespues, setVistaDespues] =
    useState<string | null>(null);

  useEffect(() => {
    cargarComparaciones();
  }, []);

  async function cargarComparaciones() {
    setCargando(true);
    setMensajeError("");

    const { data, error } = await supabase
      .from("antes_despues")
      .select(`
        id,
        titulo,
        categoria,
        descripcion,
        imagen_antes_url,
        imagen_antes_path,
        imagen_despues_url,
        imagen_despues_path,
        activo,
        orden
      `)
      .order("orden", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMensajeError(
        "No fue posible cargar las comparaciones."
      );

      setCargando(false);

      return;
    }

    setComparaciones(data ?? []);
    setCargando(false);
  }

  function limpiarFormulario() {
    setTitulo("");
    setCategoria("");
    setDescripcion("");

    setImagenAntes(null);
    setImagenDespues(null);

    setVistaAntes(null);
    setVistaDespues(null);

    setEditandoId(null);
    setMostrarFormulario(false);

    setMensajeError("");
  }

  function nuevaComparacion() {
    limpiarFormulario();

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function editarComparacion(
    comparacion: Comparacion
  ) {
    setTitulo(comparacion.titulo);
    setCategoria(comparacion.categoria);
    setDescripcion(
      comparacion.descripcion ?? ""
    );

    setImagenAntes(null);
    setImagenDespues(null);

    setVistaAntes(
      comparacion.imagen_antes_url
    );

    setVistaDespues(
      comparacion.imagen_despues_url
    );

    setEditandoId(comparacion.id);
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
        "Solo se permiten imágenes JPG, PNG o WEBP."
      );

      return false;
    }

    if (
      archivo.size >
      5 * 1024 * 1024
    ) {
      setMensajeError(
        "Cada fotografía debe pesar máximo 5 MB."
      );

      return false;
    }

    setMensajeError("");

    return true;
  }

  function seleccionarAntes(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      e.target.files?.[0];

    if (!archivo) return;

    if (!validarImagen(archivo)) {
      return;
    }

    setImagenAntes(archivo);

    setVistaAntes(
      URL.createObjectURL(archivo)
    );
  }

  function seleccionarDespues(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      e.target.files?.[0];

    if (!archivo) return;

    if (!validarImagen(archivo)) {
      return;
    }

    setImagenDespues(archivo);

    setVistaDespues(
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
        .from("antes-despues")
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
        .from("antes-despues")
        .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  }

  async function guardarComparacion(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !titulo.trim() ||
      !categoria.trim()
    ) {
      return;
    }

    if (
      editandoId === null &&
      (!imagenAntes || !imagenDespues)
    ) {
      setMensajeError(
        "Debes seleccionar una fotografía de ANTES y una de DESPUÉS."
      );

      return;
    }

    setGuardando(true);
    setMensajeError("");

    const comparacionActual =
      comparaciones.find(
        (comparacion) =>
          comparacion.id === editandoId
      );

    let nuevaAntes:
      | {
          url: string;
          path: string;
        }
      | null = null;

    let nuevaDespues:
      | {
          url: string;
          path: string;
        }
      | null = null;

    if (imagenAntes) {
      nuevaAntes =
        await subirImagen(
          imagenAntes,
          `comparacion-${editandoId ?? "nueva"}/antes`
        );

      if (!nuevaAntes) {
        setMensajeError(
          "No fue posible subir la fotografía ANTES."
        );

        setGuardando(false);

        return;
      }
    }

    if (imagenDespues) {
      nuevaDespues =
        await subirImagen(
          imagenDespues,
          `comparacion-${editandoId ?? "nueva"}/despues`
        );

      if (!nuevaDespues) {
        setMensajeError(
          "No fue posible subir la fotografía DESPUÉS."
        );

        setGuardando(false);

        return;
      }
    }

    if (editandoId !== null) {
      const cambios: {
        titulo: string;
        categoria: string;
        descripcion: string | null;
        updated_at: string;

        imagen_antes_url?: string;
        imagen_antes_path?: string;

        imagen_despues_url?: string;
        imagen_despues_path?: string;
      } = {
        titulo: titulo.trim(),
        categoria,
        descripcion:
          descripcion.trim() || null,
        updated_at:
          new Date().toISOString(),
      };

      if (nuevaAntes) {
        cambios.imagen_antes_url =
          nuevaAntes.url;

        cambios.imagen_antes_path =
          nuevaAntes.path;
      }

      if (nuevaDespues) {
        cambios.imagen_despues_url =
          nuevaDespues.url;

        cambios.imagen_despues_path =
          nuevaDespues.path;
      }

      const { error } = await supabase
        .from("antes_despues")
        .update(cambios)
        .eq("id", editandoId);

      if (error) {
        console.error(error);

        setMensajeError(
          "No fue posible actualizar la comparación."
        );

        setGuardando(false);

        return;
      }

      if (
        nuevaAntes &&
        comparacionActual?.imagen_antes_path
      ) {
        await supabase.storage
          .from("antes-despues")
          .remove([
            comparacionActual.imagen_antes_path,
          ]);
      }

      if (
        nuevaDespues &&
        comparacionActual?.imagen_despues_path
      ) {
        await supabase.storage
          .from("antes-despues")
          .remove([
            comparacionActual.imagen_despues_path,
          ]);
      }
    } else {
      const ultimoOrden =
        comparaciones.length > 0
          ? Math.max(
              ...comparaciones.map(
                (comparacion) =>
                  comparacion.orden
              )
            )
          : 0;

      const { error } = await supabase
        .from("antes_despues")
        .insert({
          titulo: titulo.trim(),
          categoria,
          descripcion:
            descripcion.trim() || null,

          imagen_antes_url:
            nuevaAntes?.url,

          imagen_antes_path:
            nuevaAntes?.path,

          imagen_despues_url:
            nuevaDespues?.url,

          imagen_despues_path:
            nuevaDespues?.path,

          activo: true,
          orden: ultimoOrden + 1,
        });

      if (error) {
        console.error(error);

        setMensajeError(
          "No fue posible crear la comparación."
        );

        setGuardando(false);

        return;
      }
    }

    await cargarComparaciones();

    limpiarFormulario();

    setGuardando(false);
  }

  async function cambiarEstado(
    comparacion: Comparacion
  ) {
    const { error } =
      await supabase
        .from("antes_despues")
        .update({
          activo:
            !comparacion.activo,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          comparacion.id
        );

    if (error) {
      setMensajeError(
        "No fue posible cambiar el estado."
      );

      return;
    }

    await cargarComparaciones();
  }

  async function eliminarComparacion(
    comparacion: Comparacion
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar "${comparacion.titulo}"?`
      );

    if (!confirmar) return;

    const archivos: string[] = [];

    if (
      comparacion.imagen_antes_path
    ) {
      archivos.push(
        comparacion.imagen_antes_path
      );
    }

    if (
      comparacion.imagen_despues_path
    ) {
      archivos.push(
        comparacion.imagen_despues_path
      );
    }

    if (archivos.length > 0) {
      await supabase.storage
        .from("antes-despues")
        .remove(archivos);
    }

    const { error } =
      await supabase
        .from("antes_despues")
        .delete()
        .eq(
          "id",
          comparacion.id
        );

    if (error) {
      setMensajeError(
        "No fue posible eliminar la comparación."
      );

      return;
    }

    await cargarComparaciones();
  }

  return (
    <div className="p-5 md:p-8">
      {/* ENCABEZADO */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
            Proyectos
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Antes y Después
          </h1>

          <p className="mt-2 text-gray-600">
            Administra las transformaciones de tus proyectos.
          </p>
        </div>

        <button
          onClick={nuevaComparacion}
          className="flex w-fit items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black hover:bg-yellow-400"
        >
          <Plus size={20} />

          Nueva comparación
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
                  ? "Editar comparación"
                  : "Nueva comparación"}
              </h2>
            </div>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-lg bg-gray-100 p-2"
            >
              <X size={21} />
            </button>
          </div>

          <form
            onSubmit={guardarComparacion}
            className="mt-7"
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

                  <option value="Remodelación">
                    Remodelación
                  </option>

                  <option value="Otros">
                    Otros
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold">
                  Descripción
                </label>

                <textarea
                  value={descripcion}
                  onChange={(e) =>
                    setDescripcion(
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            {/* IMÁGENES */}
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {/* ANTES */}
              <div>
                <p className="mb-3 font-bold">
                  Fotografía ANTES
                </p>

                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                  {vistaAntes ? (
                    <img
                      src={vistaAntes}
                      alt="Antes"
                      className="h-64 w-full rounded-xl object-cover"
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
                    {vistaAntes
                      ? "Cambiar fotografía"
                      : "Seleccionar fotografía"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={seleccionarAntes}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* DESPUÉS */}
              <div>
                <p className="mb-3 font-bold">
                  Fotografía DESPUÉS
                </p>

                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">
                  {vistaDespues ? (
                    <img
                      src={vistaDespues}
                      alt="Después"
                      className="h-64 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      <ImagePlus className="mx-auto" />

                      <p className="mt-3">
                        Sin fotografía
                      </p>
                    </div>
                  )}

                  <label className="mt-5 block cursor-pointer rounded-lg bg-yellow-500 px-5 py-3 text-center font-bold text-black">
                    {vistaDespues
                      ? "Cambiar fotografía"
                      : "Seleccionar fotografía"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        seleccionarDespues
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                    : "Crear comparación"}
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
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {comparaciones.map(
            (comparacion) => (
              <article
                key={comparacion.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="grid grid-cols-2">
                  {comparacion.imagen_antes_url ? (
                    <img
                      src={
                        comparacion.imagen_antes_url
                      }
                      alt="Antes"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gray-200">
                      ANTES
                    </div>
                  )}

                  {comparacion.imagen_despues_url ? (
                    <img
                      src={
                        comparacion.imagen_despues_url
                      }
                      alt="Después"
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gray-100">
                      DESPUÉS
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                      {comparacion.categoria}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        comparacion.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {comparacion.activo
                        ? "Publicado"
                        : "Oculto"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold">
                    {comparacion.titulo}
                  </h3>

                  {comparacion.descripcion && (
                    <p className="mt-3 text-gray-600">
                      {comparacion.descripcion}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
                    <button
                      onClick={() =>
                        editarComparacion(
                          comparacion
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
                          comparacion
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold"
                    >
                      {comparacion.activo ? (
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
                        eliminarComparacion(
                          comparacion
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