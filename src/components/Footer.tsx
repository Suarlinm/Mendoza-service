import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import { obtenerConfiguracionSitio } from "@/lib/configuracionSitio";

export default async function Footer() {
  const configuracion =
    await obtenerConfiguracionSitio();

  return (
    <footer className="bg-gray-950 px-5 pt-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* EMPRESA */}
        <div>
          <h2 className="text-2xl font-extrabold">
            {configuracion.nombre_empresa}
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            Construction, remodeling, and repair services with commitment, responsibility, and quality.
          </p>

          <div className="mt-6 flex gap-3">
            {configuracion.facebook && (
              <a
                href={configuracion.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-yellow-500 hover:text-black"
              >
                <FaFacebookF />
              </a>
            )}

            {configuracion.instagram && (
              <a
                href={configuracion.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-yellow-500 hover:text-black"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>

        {/* ENLACES */}
        <div>
          <h3 className="font-extrabold">
            Navegación
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-gray-400">
            <a
              href="/#inicio"
              className="hover:text-yellow-400"
            >
              Home
            </a>

            <a
              href="/#nosotros"
              className="hover:text-yellow-400"
            >
              About Us
            </a>

            <a
              href="/#servicios"
              className="hover:text-yellow-400"
            >
              Services
            </a>

            <a
              href="/proyectos"
              className="hover:text-yellow-400"
            >
              Projects
            </a>

            <a
              href="/#contacto"
              className="hover:text-yellow-400"
            >
              Contact US
            </a>
          </div>
        </div>

        {/* SERVICIOS */}
        <div>
          <h3 className="font-extrabold">
            Services
          </h3>

          <div className="mt-5 space-y-3 text-gray-400">
            <p>Drywall</p>
            <p>Power wash</p>
            <p>Paint cabinets</p>
          </div>
        </div>

        {/* CONTACTO */}
        <div>
          <h3 className="font-extrabold">
            Contact Us
          </h3>

          <div className="mt-5 space-y-4 text-gray-400">
            {configuracion.telefono && (
              <a
                href={`tel:${configuracion.telefono}`}
                className="flex items-start gap-3 hover:text-yellow-400"
              >
                <Phone
                  size={19}
                  className="mt-1 shrink-0"
                />

                <span>
                  {configuracion.telefono}
                </span>
              </a>
            )}

            {configuracion.correo && (
              <a
                href={`mailto:${configuracion.correo}`}
                className="flex items-start gap-3 hover:text-yellow-400"
              >
                <Mail
                  size={19}
                  className="mt-1 shrink-0"
                />

                <span className="break-all">
                  {configuracion.correo}
                </span>
              </a>
            )}

            {configuracion.ubicacion && (
              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-1 shrink-0"
                />

                <span>
                  {configuracion.ubicacion}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 py-7 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        {configuracion.nombre_empresa}. All Rights Reserved.
      </div>
    </footer>
  );
}