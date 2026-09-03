import { supabase } from "@/lib/supabase";

export type ConfiguracionSitio = {
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

  hero_etiqueta: string | null;
  hero_beneficio_1: string | null;
  hero_beneficio_2: string | null;
  hero_beneficio_3: string | null;

  nosotros_titulo: string | null;
  nosotros_texto: string | null;
  nosotros_imagen_url: string | null;

  nosotros_destacado_titulo: string | null;
  nosotros_destacado_texto: string | null;

  nosotros_valor_1_titulo: string | null;
  nosotros_valor_1_texto: string | null;

  nosotros_valor_2_titulo: string | null;
  nosotros_valor_2_texto: string | null;

  nosotros_resumen: string | null;

  mostrar_testimonios: boolean;
};

const configuracionPorDefecto: ConfiguracionSitio = {
  id: 1,

  nombre_empresa: "CONSTRUCTORA",

  telefono: null,
  whatsapp: null,
  correo: null,
  ubicacion: null,

  facebook: null,
  instagram: null,

  hero_titulo:
    "Transformamos tus espacios en lugares extraordinarios",

  hero_subtitulo:
    "Construcción, reparación y remodelación con calidad, responsabilidad y atención a cada detalle.",

  hero_imagen_url: null,

  hero_etiqueta:
    "Construcción y remodelación",

  hero_beneficio_1:
    "Calidad",

  hero_beneficio_2:
    "Responsabilidad",

  hero_beneficio_3:
    "Experiencia",

  nosotros_titulo:
    "Construimos con compromiso y calidad",

  nosotros_texto:
    "Nos especializamos en construcción, remodelación y reparación de espacios residenciales.",

  nosotros_imagen_url: null,

  nosotros_destacado_titulo:
    "Calidad en cada proyecto",

  nosotros_destacado_texto:
    "Atención a cada detalle",

  nosotros_valor_1_titulo:
    "Trabajo profesional",

  nosotros_valor_1_texto:
    "Soluciones pensadas para cada espacio y necesidad.",

  nosotros_valor_2_titulo:
    "Compromiso",

  nosotros_valor_2_texto:
    "Responsabilidad durante todo el desarrollo del proyecto.",

  nosotros_resumen:
    "Remodelaciones, pintura, tablaroca y reparaciones.",

  mostrar_testimonios: true,
};

export async function obtenerConfiguracionSitio() {
  const { data, error } = await supabase
    .from("configuracion_sitio")
    .select(`
      id,
      nombre_empresa,
      telefono,
      whatsapp,
      correo,
      ubicacion,
      facebook,
      instagram,
      hero_titulo,
      hero_subtitulo,
      hero_imagen_url,
      hero_etiqueta,
      hero_beneficio_1,
      hero_beneficio_2,
      hero_beneficio_3,
      nosotros_titulo,
      nosotros_texto,
      nosotros_imagen_url,
      nosotros_destacado_titulo,
      nosotros_destacado_texto,
      nosotros_valor_1_titulo,
      nosotros_valor_1_texto,
      nosotros_valor_2_titulo,
      nosotros_valor_2_texto,
      nosotros_resumen,
      mostrar_testimonios
    `)
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(
      "Error cargando configuración:",
      error.message
    );

    return configuracionPorDefecto;
  }

  return (
    (data as ConfiguracionSitio | null) ??
    configuracionPorDefecto
  );
}