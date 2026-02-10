"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Photo } from "./Gallery";

const CATEGORIES = [
  { id: "retratos", name: "Retratos", icon: "👤" },
  { id: "bodas", name: "Bodas", icon: "💍" },
  { id: "paisajes", name: "Paisajes", icon: "🏔️" },
  { id: "eventos", name: "Eventos", icon: "🎉" },
  { id: "productos", name: "Productos", icon: "📦" },
  { id: "arquitectura", name: "Arquitectura", icon: "🏛️" },
  { id: "naturaleza", name: "Naturaleza", icon: "🌿" },
];

interface CategoryWithCover {
  id: string;
  name: string;
  icon: string;
  coverPhoto: string | null;
  count: number;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryWithCover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      const photos: Photo[] = data.photos || [];

      // Agrupar fotos por categoría
      const categoriesWithCovers = CATEGORIES.map((cat) => {
        const categoryPhotos = photos.filter((p) => p.category === cat.id);
        return {
          ...cat,
          coverPhoto: categoryPhotos.length > 0 ? categoryPhotos[0].url : null,
          count: categoryPhotos.length,
        };
      }).filter((cat) => cat.count > 0); // Solo mostrar categorías con fotos

      setCategories(categoriesWithCovers);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-slate-600">Cargando portfolio...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 text-xl">
          Aún no hay fotos en el portfolio.
        </p>
        <p className="text-slate-500 mt-2">
          Ve al panel de admin para subir fotos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/portfolio/${category.id}`}
          className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
            index === 0 && categories.length % 2 !== 0
              ? "md:col-span-2 h-[500px]"
              : "h-[400px]"
          }`}
        >
          {/* Background Image */}
          {category.coverPhoto && (
            <Image
              src={category.coverPhoto}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <span className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
              {category.icon}
            </span>
            <h3 className="text-4xl font-bold mb-2 tracking-wide">
              {category.name}
            </h3>
            <p className="text-lg text-white/80">
              {category.count} {category.count === 1 ? "foto" : "fotos"}
            </p>
            <div className="mt-6 px-6 py-2 border-2 border-white/50 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Ver galería →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
