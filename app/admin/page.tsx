"use client";

import { useState, useEffect } from "react";
import UploadZone from "@/components/UploadZone";

export default function AdminPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Contraseña (cámbiala por una segura)
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (isAuthenticated) {
      loadPhotos();
    }
  }, [isAuthenticated]);

  const loadPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Error al cargar fotos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Subir a Cloudinary
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Error al subir la foto");

      const uploadData = await uploadResponse.json();

      // 2. Guardar URL en la base de datos
      const saveResponse = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url }),
      });

      if (!saveResponse.ok) throw new Error("Error al guardar en BD");

      const saveData = await saveResponse.json();
      setPhotos(saveData.photos);
      
      alert("✅ Foto subida y guardada exitosamente!");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al subir la foto. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("¿Eliminar esta foto?")) return;

    try {
      const response = await fetch("/api/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error("Error al eliminar");

      const data = await response.json();
      setPhotos(data.photos);
      alert("✅ Foto eliminada");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al eliminar la foto");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            🔒 Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa la contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Contraseña por defecto: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              📸 Panel de Administración
            </h1>
            <a
              href="/"
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Ver Portfolio
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Subir Nueva Foto
            </h2>
            <UploadZone onUpload={handleUpload} uploading={uploading} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              Fotos del Portfolio ({photos.length})
            </h2>
          </div>

          {loading ? (
            <p className="text-slate-500 text-center py-12">Cargando fotos...</p>
          ) : photos.length === 0 ? (
            <p className="text-slate-500 text-center py-12">
              No hay fotos aún. Sube tu primera foto arriba.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Las fotos se actualizan automáticamente
              </h3>
              <p className="text-sm text-green-700">
                Todas las fotos que subas aquí aparecerán automáticamente en tu portfolio público.
                No necesitas hacer nada más.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
