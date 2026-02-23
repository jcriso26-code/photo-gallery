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
  const [filterCategory, setFilterCategory] = useState("all");

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

      try {
        // 1. Obtener firma del servidor
        const signResponse = await fetch("/api/upload/sign");
        if (!signResponse.ok) throw new Error("Error al obtener firma de upload");
        const { signature, timestamp, apiKey, cloudName } = await signResponse.json();

        // 2. Subir directo a Cloudinary con firma (evita límite 4.5MB de Vercel)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", String(timestamp));
        formData.append("api_key", apiKey);
        formData.append("folder", "photo-gallery");

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadResponse.ok) {
          const errData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Error al subir (status ${uploadResponse.status})`);
        }

        const uploadData = await uploadResponse.json();

        // 3. Guardar referencia en Redis
        const saveResponse = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: uploadData.secure_url,
            category: selectedCategory,
            title: photoTitle,
          }),
        });

        if (!saveResponse.ok) {
          const errData = await saveResponse.json().catch(() => ({}));
          throw new Error(errData.error || `Error al guardar (status ${saveResponse.status})`);
        }

        const saveData = await saveResponse.json();
        setPhotos(saveData.photos);
        setPhotoTitle("");

        alert("✅ Foto subida exitosamente!");
      } catch (error: any) {
        console.error("Error:", error);
        alert(`❌ Error al subir la foto: ${error.message || "Intenta de nuevo."}`);
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

  const handleSetCover = async (index: number) => {
    try {
      const response = await fetch("/api/photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error("Error al reordenar");

      const data = await response.json();
      setPhotos(data.photos);
      alert("✅ Foto de portada actualizada");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al actualizar portada");
    }
  };

  // Filtrar fotos por categoría
  const filteredPhotos =
    filterCategory === "all"
      ? photos
      : photos.filter((p) => p.category === filterCategory);

  // Agrupar fotos por categoría para preview
  const photosByCategory = CATEGORIES.map((cat) => ({
    ...cat,
    photos: photos.filter((p) => p.category === cat.id),
  })).filter((cat) => cat.photos.length > 0);

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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
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

          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Subir Nueva Foto
            </h2>

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

        {/* Preview de Portadas */}
        {photosByCategory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              ⭐ Preview de Portadas
            </h2>
            <p className="text-slate-600 mb-6">
              La primera foto de cada categoría se usa como portada en el
              portfolio. Haz clic en ⭐ para cambiar la portada.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photosByCategory.map((cat) => (
                <div key={cat.id} className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={cat.photos[0].url}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end p-3">
                    <div>
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="text-white font-semibold">{cat.name}</p>
                      <p className="text-white/70 text-sm">
                        {cat.photos.length} fotos
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gestión de Fotos */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-slate-800">
              Gestionar Fotos ({photos.length})
            </h2>

            {/* Filtro por categoría */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterCategory === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todas
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterCategory === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500 text-center py-12">Cargando fotos...</p>
          ) : filteredPhotos.length === 0 ? (
            <p className="text-slate-500 text-center py-12">
              No hay fotos{" "}
              {filterCategory !== "all" ? "en esta categoría" : "aún"}.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, index) => {
                const globalIndex = photos.findIndex((p) => p === photo);
                const categoryPhotos = photos.filter(
                  (p) => p.category === photo.category
                );
                const isFirstInCategory = categoryPhotos[0] === photo;

                return (
                  <div key={index} className="relative group">
                    <div
                      className={`relative rounded-lg overflow-hidden ${
                        isFirstInCategory ? "ring-4 ring-yellow-400" : ""
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title || `Foto ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      {isFirstInCategory && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Portada
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2 gap-2">
                      <span className="text-white text-xs font-medium">
                        {CATEGORIES.find((c) => c.id === photo.category)?.icon}{" "}
                        {CATEGORIES.find((c) => c.id === photo.category)?.name}
                      </span>
                      {photo.title && (
                        <p className="text-white text-xs text-center">
                          {photo.title}
                        </p>
                      )}

                      <div className="flex gap-2 mt-2">
                        {!isFirstInCategory && (
                          <button
                            onClick={() => handleSetCover(globalIndex)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs hover:bg-yellow-600 transition-colors"
                            title="Hacer portada"
                          >
                            ⭐ Portada
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(globalIndex)}
                          className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-700 transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              💡 Consejos
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• La foto con ⭐ es la portada de esa categoría</li>
              <li>• Haz clic en "⭐ Portada" para cambiar la foto de portada</li>
              <li>• Las portadas se muestran en el grid principal del portfolio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
