"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Gallery, { Photo } from "@/components/Gallery";
import Navigation from "@/components/Navigation";

const CATEGORIES: Record<string, { name: string; icon: string }> = {
  retratos: { name: "Retratos", icon: "👤" },
  bodas: { name: "Bodas", icon: "💍" },
  paisajes: { name: "Paisajes", icon: "🏔️" },
  eventos: { name: "Eventos", icon: "🎉" },
  productos: { name: "Productos", icon: "📦" },
  arquitectura: { name: "Arquitectura", icon: "🏛️" },
  naturaleza: { name: "Naturaleza", icon: "🌿" },
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = CATEGORIES[category];

  useEffect(() => {
    if (!categoryInfo) {
      router.push("/");
      return;
    }
    loadPhotos();
  }, [category]);

  const loadPhotos = async () => {
    try {
      const response = await fetch(`/api/photos?category=${category}`);
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Error al cargar fotos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!categoryInfo) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero de categoría */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <span className="text-6xl mb-4 block">{categoryInfo.icon}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {categoryInfo.name}
          </h1>
          <p className="text-xl text-slate-300">
            {photos.length} {photos.length === 1 ? "fotografía" : "fotografías"}
          </p>
        </div>
      </section>

      {/* Galería */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
              <p className="mt-4 text-slate-600">Cargando...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-xl">
                Aún no hay fotos en esta categoría.
              </p>
              <a
                href="/"
                className="inline-block mt-6 px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                ← Volver al inicio
              </a>
            </div>
          ) : (
            <>
              <Gallery photos={photos} />
              <div className="text-center mt-12">
                <a
                  href="/#portfolio"
                  className="inline-block px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
                >
                  ← Ver todas las categorías
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
