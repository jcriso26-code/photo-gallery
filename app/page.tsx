"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import Gallery from "@/components/Gallery";

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir la foto");

      const data = await response.json();
      setPhotos((prev) => [data.url, ...prev]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir la foto. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-slate-800 mb-4">
          📸 Galería de Fotos
        </h1>
        <p className="text-slate-600 text-lg">
          Sube tus mejores fotografías y compártelas con el mundo
        </p>
      </div>

      <UploadZone onUpload={handleUpload} uploading={uploading} />

      {photos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-slate-800 mb-8">
            Tus Fotos
          </h2>
          <Gallery photos={photos} />
        </div>
      )}
    </main>
  );
}
