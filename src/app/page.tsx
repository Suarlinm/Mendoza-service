import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Proyectos from "@/components/Proyectos";
import AntesDespues from "@/components/AntesDespues";
import Nosotros from "@/components/Nosotros";
import Testimonios from "@/components/Testimonios";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Galeria from "@/components/Galeria";
import Videos from "@/components/Videos";
export const dynamic = "force-dynamic";


export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <Servicios />

      <Proyectos />

      <AntesDespues />

      <Galeria />

      <Videos />

      <Nosotros />

      <Testimonios />

      <Contacto />

      <Footer />

    </main>
  );
} 