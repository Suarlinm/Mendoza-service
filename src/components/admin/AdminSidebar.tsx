"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  FileText,
  GalleryHorizontalEnd,
  Hammer,
  Home,
  Images,
  LogOut,
  Menu,
  MessageSquareText,
  Settings,
  Star,
  Video,
  X,
} from "lucide-react";

const opciones = [
  {
    nombre: "Dashboard",
    href: "/admin",
    icono: BarChart3,
  },

  {
    nombre: "Servicios",
    href: "/admin/servicios",
    icono: Hammer,
  },
  {
  nombre: "Configuración",
  href: "/admin/configuracion",
  icono: Settings,
  },
  {
    nombre: "Proyectos",
    href: "/admin/proyectos",
    icono: GalleryHorizontalEnd,
  },
  {
    nombre: "Antes / Después",
    href: "/admin/antes-despues",
    icono: Images,
  },
  {
    nombre: "Galería",
    href: "/admin/galeria",
    icono: Images,
  },
  {
    nombre: "Videos",
    href: "/admin/videos",
    icono: Video,
  },
  {
    nombre: "Testimonios",
    href: "/admin/testimonios",
    icono: Star,
  },
  {
    nombre: "Cotizaciones",
    href: "/admin/cotizaciones",
    icono: FileText,
  },
  {
    nombre: "Contacto",
    href: "/admin/contacto",
    icono: MessageSquareText,
  },
];

export default function AdminSidebar() {
  const [abierto, setAbierto] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] =
  useState("CONSTRUCTORA");

    useEffect(() => {
    async function cargarNombreEmpresa() {
        const { data, error } = await supabase
        .from("configuracion_sitio")
        .select("nombre_empresa")
        .eq("id", 1)
        .maybeSingle();

        if (error) {
        console.error(
            "Error cargando nombre de empresa:",
            error.message
        );

        return;
        }

        if (data?.nombre_empresa) {
        setNombreEmpresa(data.nombre_empresa);
        }
    }

    cargarNombreEmpresa();
    }, []);

  async function cerrarSesion() {
  await supabase.auth.signOut();

  window.location.href = "/admin-login";
    }

  return (
    <>
      {/* BARRA SUPERIOR CELULAR */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-5 lg:hidden">
        <div>
          <p className="font-extrabold text-gray-900">
            CONSTRUCTORA
          </p>

          <p className="text-xs text-gray-500">
            Administración
          </p>
        </div>

        <button
          onClick={() => setAbierto(true)}
          className="rounded-lg bg-gray-100 p-2 text-gray-900"
          aria-label="Abrir menú"
        >
          <Menu size={25} />
        </button>
      </div>

      {/* FONDO OSCURO CELULAR */}
      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

        {/* SIDEBAR */}
        <aside
        className={`
            fixed bottom-0 left-0 top-0 z-50
            flex w-72 flex-col
            bg-gray-950 text-white
            transition-transform duration-300
            lg:translate-x-0
            ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
        >

        {/* LOGO */}
        <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="min-w-0">
            <h2 className="break-words text-lg font-extrabold leading-tight">
            {nombreEmpresa}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
            Panel administrativo
            </p>
        </div>

        <button
            onClick={() => setAbierto(false)}
            className="ml-3 shrink-0 rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
            <X size={22} />
        </button>
        </div>


        {/* MENÚ */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {opciones.map((opcion) => {
              const Icono = opcion.icono;

              return (
                <a
                  key={opcion.href}
                  href={opcion.href}
                  onClick={() => setAbierto(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-yellow-500 hover:text-black"
                >
                  <Icono size={20} />

                  {opcion.nombre}
                </a>
              );
            })}
          </div>
        </nav>

        {/* VOLVER A LA WEB */}
        <div className="shrink-0 space-y-2 border-t border-white/10 bg-gray-950 p-4">
        <a
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white hover:text-black"
        >
            <ChevronLeft size={18} />

            Ver página web
        </a>

        <button
            onClick={cerrarSesion}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
            <LogOut size={18} />

            Cerrar sesión
        </button>
        </div>


        
      </aside>
    </>
  );
}