"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [nombreEmpresa, setNombreEmpresa] =
    useState("CONSTRUCTION COMPANY");

  useEffect(() => {
    async function cargarConfiguracion() {
      const { data, error } = await supabase
        .from("configuracion_sitio")
        .select("nombre_empresa")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error(
          "Error loading company name:",
          error.message
        );

        return;
      }

      if (data?.nombre_empresa) {
        setNombreEmpresa(data.nombre_empresa);
      }
    }

    cargarConfiguracion();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* LOGO */}
        <a
          href="/#inicio"
          className="text-xl font-extrabold text-gray-900"
        >
          {nombreEmpresa}
        </a>

        {/* DESKTOP MENU */}
        <nav className="hidden items-center gap-7 text-sm font-semibold text-gray-700 lg:flex">
          <a
            href="/#inicio"
            className="transition hover:text-yellow-600"
          >
            Home
          </a>

          <a
            href="/#nosotros"
            className="transition hover:text-yellow-600"
          >
            About Us
          </a>

          <a
            href="/#servicios"
            className="transition hover:text-yellow-600"
          >
            Services
          </a>

          <a
            href="/#proyectos"
            className="transition hover:text-yellow-600"
          >
            Projects
          </a>

          <a
            href="/#contacto"
            className="transition hover:text-yellow-600"
          >
            Contact
          </a>
        </nav>

        {/* DESKTOP QUOTE BUTTON */}
        <a
          href="/#contacto"
          className="hidden rounded-md bg-yellow-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-400 lg:block"
        >
          Request a Quote
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() =>
            setMenuAbierto(!menuAbierto)
          }
          className="rounded-md p-2 text-gray-900 lg:hidden"
          aria-label="Open menu"
        >
          {menuAbierto ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuAbierto && (
        <div className="border-t bg-white px-5 pb-6 lg:hidden">
          <nav className="flex flex-col">
            <a
              href="/#inicio"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="border-b py-4 font-semibold text-gray-800"
            >
              Home
            </a>

            <a
              href="/#nosotros"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="border-b py-4 font-semibold text-gray-800"
            >
              About Us
            </a>

            <a
              href="/#servicios"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="border-b py-4 font-semibold text-gray-800"
            >
              Services
            </a>

            <a
              href="/#proyectos"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="border-b py-4 font-semibold text-gray-800"
            >
              Projects
            </a>

            <a
              href="/#contacto"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="py-4 font-semibold text-gray-800"
            >
              Contact
            </a>

            <a
              href="/#contacto"
              onClick={() =>
                setMenuAbierto(false)
              }
              className="mt-3 rounded-md bg-yellow-500 px-5 py-4 text-center font-bold text-black"
            >
              Request a Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}