"use client";

import Navigation from "@/components/Navigation";
import CategoryGrid from "@/components/CategoryGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Jose Jimenez
          </h1>
          <p className="text-lg md:text-xl text-white/70 tracking-widest uppercase mb-4">
            Luz. Detalle. Intención.
          </p>
          <p className="text-xl md:text-2xl text-white/90 font-light italic mb-8">
            La fotografía es mi forma de interpretar el mundo.
          </p>
          <a
            href="#portfolio"
            className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors"
          >
            Ver Portfolio
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-8">Sobre Mí</h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            La fotografía comenzó como una curiosidad y se convirtió en una
            práctica constante. Me interesa la luz, la estructura y el
            equilibrio dentro del encuadre.
          </p>
          <p className="text-xl text-slate-600 leading-relaxed mb-6">
            Disfruto el proceso técnico tanto como el resultado final: entender
            la exposición, ajustar el enfoque, trabajar la composición.
          </p>
          <p className="text-xl text-slate-600 leading-relaxed">
            No busco capturar todo, solo aquello que realmente tiene intención.
          </p>
        </div>
      </section>

      {/* Portfolio Section - Category Grid */}
      <section id="portfolio" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">Portfolio</h2>
            <p className="text-xl text-slate-600">
              Explora mi visión por categoría
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-8">Trabajemos Juntos</h2>
          <p className="text-xl text-slate-300 mb-12">
            ¿Tienes un proyecto en mente? Me encantaría explorar tu visión juntos.
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
            © 2026 Jose Jimenez. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
