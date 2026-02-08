"use client";

import { useState, useEffect } from "react";
import UploadZone from "@/components/UploadZone";
import { Photo } from "@/components/Gallery";

const CATEGORIES = [
  { id: "retratos", name: "Retratos", icon: "👤" },
  { id: "bodas", name: "Bodas", icon: "💍" },
  { id: "paisajes", name: "Paisajes", icon: "🏔️" },
  { id: "eventos", name: "Eventos", icon: "🎉" },
  { id: "productos", name: "Productos", icon: "📦" },
  { id: "arquitectura", name: "Arquitectura", icon: "🏛️" },
  { id: "naturaleza", name: "Naturaleza", icon: "🌿" },
];

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("retratos");
  const [photoTitle, setPhotoTitle] = useState("");

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
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Error al subir la foto");
      }

      const saveResponse = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: uploadData.url,
          category: selectedCategory,
          title: photoTitle,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.error || "Error al guardar en BD");
      }

      setPhotos(saveData.photos);
      setPhotoTitle("");
      
      alert("✅ Foto subida exitosamente!");
    } catch (error: any) {
      console.error("Error:", error);
      alert(`❌ Error: ${error.message}`);
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
            
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Categoría
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                placeholder="Ej: Atardecer en la playa"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
                    src={photo.url}
                    alt={photo.title || `Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                    <span className="text-white text-xs font-medium mb-1">
                      {CATEGORIES.find(c => c.id === photo.category)?.icon} {CATEGORIES.find(c => c.id === photo.category)?.name}
                    </span>
                    {photo.title && (
                      <p className="text-white text-xs text-center mb-2">{photo.title}</p>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
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
                Los visitantes pueden filtrar por categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
