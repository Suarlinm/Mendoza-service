import { FaWhatsapp } from "react-icons/fa";

import { obtenerConfiguracionSitio } from "@/lib/configuracionSitio";

export default async function WhatsAppButton() {
  const configuracion =
    await obtenerConfiguracionSitio();

  if (!configuracion.whatsapp) {
    return null;
  }

  const numero =
    configuracion.whatsapp.replace(/\D/g, "");

  if (!numero) {
    return null;
  }

  const mensaje = encodeURIComponent(
    `Hola, me gustaría solicitar información sobre los servicios de ${configuracion.nombre_empresa}.`
  );

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-green-600 sm:h-16 sm:w-16 sm:text-3xl"
    >
      <FaWhatsapp />
    </a>
  );
}