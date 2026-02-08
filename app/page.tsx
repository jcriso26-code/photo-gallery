"use client";

import { useState, useEffect } from "react";
import Gallery from "@/components/Gallery";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      setPortfolioPhotos(data.photos || []);
    } catch (error) {
      console.error("Error al cargar fotos:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Tu Nombre
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-light mb-8">
            Fotógrafo Profesional
          </p>
          <a
            href="#portfolio"
            className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
          >
            Ver Portfolio
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-8">
            Sobre Mí
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            Soy un fotógrafo apasionado por capturar la esencia de cada momento. 
            Con más de 10 años de experiencia, me especializo en fotografía de paisajes, 
            retratos y eventos.
          </p>
          <p className="text-xl text-slate-600 leading-relaxed">
            Mi objetivo es contar historias a través de imágenes que perduren para siempre.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Portfolio
            </h2>
            <p className="text-xl text-slate-600">
              Una selección de mis mejores trabajos
            </p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              <p className="mt-4 text-slate-600">Cargando portfolio...</p>
            </div>
          ) : portfolioPhotos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-xl">
                Aún no hay fotos en el portfolio.
              </p>
              <p className="text-slate-500 mt-2">
                Ve al panel de admin para subir fotos.
              </p>
            </div>
          ) : (
            <Gallery photos={portfolioPhotos} />
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-8">
            Trabajemos Juntos
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            ¿Tienes un proyecto en mente? Me encantaría escuchar tu historia.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="mailto:contacto@tudominio.com"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              Enviar Email
            </a>
            <a
              href="https://instagram.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-slate-900 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2026 Tu Nombre. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
