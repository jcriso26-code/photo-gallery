# 📸 Galería de Fotos con Cloudinary

Aplicación web moderna para subir y mostrar fotografías usando Next.js y Cloudinary.

## ✨ Características

- 🎨 Diseño moderno y responsive con Tailwind CSS
- 📤 Drag & drop para subir fotos
- 👁️ Vista previa antes de subir
- 🖼️ Galería con grid responsive
- ⚡ Optimización automática de imágenes con Cloudinary
- 🎭 Animaciones suaves y transiciones

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura Cloudinary:
   - Ve a [Cloudinary Console](https://console.cloudinary.com/)
   - Crea una cuenta gratuita si no tienes una
   - Copia tus credenciales

3. Crea el archivo `.env.local`:
```bash
cp .env.local.example .env.local
```

4. Edita `.env.local` con tus credenciales de Cloudinary:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 🏃 Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del proyecto

```
├── app/
│   ├── api/upload/route.ts    # API para subir fotos a Cloudinary
│   ├── page.tsx                # Página principal
│   ├── layout.tsx              # Layout global
│   └── globals.css             # Estilos globales
├── components/
│   ├── UploadZone.tsx          # Componente de subida con drag & drop
│   └── Gallery.tsx             # Componente de galería
└── package.json
```

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Cloudinary** - Almacenamiento y optimización de imágenes

## 📝 Notas

- Las imágenes se suben a la carpeta `photo-gallery` en Cloudinary
- El plan gratuito de Cloudinary incluye 25 GB de almacenamiento
- Las imágenes se optimizan automáticamente para web
