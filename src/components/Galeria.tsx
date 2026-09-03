import GaleriaGeneral from "@/components/GaleriaGeneral";

import { supabase } from "@/lib/supabase";

type FotoProyecto = {
  id: number;
  imagen_url: string;

  proyectos: {
    titulo: string;
    categoria: string;
    activo: boolean;
  };
};

type FotoInicio = {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen_url: string;
  orden: number;
};

export default async function Galeria() {
  const {
    data: fotosProyecto,
    error: errorProyecto,
  } = await supabase
    .from("proyecto_imagenes")
    .select(`
      id,
      imagen_url,
      proyectos!inner (
        titulo,
        categoria,
        activo
      )
    `)
    .eq("mostrar_inicio", true)
    .eq(
      "proyectos.activo",
      true
    )
    .order("id", {
      ascending: false,
    });

  const {
    data: fotosInicio,
    error: errorInicio,
  } = await supabase
    .from("galeria_inicio")
    .select(`
      id,
      titulo,
      descripcion,
      imagen_url,
      orden
    `)
    .eq("activo", true)
    .order("orden", {
      ascending: true,
    });

  if (
    errorProyecto ||
    errorInicio
  ) {
    console.error(
      "Error cargando galería:",
      errorProyecto?.message ||
        errorInicio?.message
    );

    return null;
  }

  const proyecto =
    (fotosProyecto ??
      []) as unknown as FotoProyecto[];

  const independientes =
    (fotosInicio ?? []) as FotoInicio[];

  const imagenes = [
    ...independientes.map(
      (foto) => ({
        id: `inicio-${foto.id}`,

        imagen_url:
          foto.imagen_url,

        titulo:
          foto.titulo,

        categoria:
          "Galería",
      })
    ),

    ...proyecto.map(
      (foto) => ({
        id: `proyecto-${foto.id}`,

        imagen_url:
          foto.imagen_url,

        titulo:
          foto.proyectos.titulo,

        categoria:
          foto.proyectos.categoria,
      })
    ),
  ].slice(0, 12);

  if (imagenes.length === 0) {
    return null;
  }

  return (
    <section
      id="galeria"
      className="bg-white px-5 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-600">
            Gallery
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-5xl">
            Our Work in Pictures
          </h2>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Explore some of the details behind our projects, processes, and transformations.
          </p>
        </div>

        <div className="mt-14">
          <GaleriaGeneral
            imagenes={imagenes}
          />
        </div>
      </div>
    </section>
  );
}