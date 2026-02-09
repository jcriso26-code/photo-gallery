import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PHOTOS_KEY = "portfolio:photos";

// Lazy initialization - solo se crea cuando se necesita
function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
}

export interface Photo {
  url: string;
  category: string;
  title?: string;
  date: string;
}

// GET - Obtener todas las fotos
export async function GET(request: NextRequest) {
  try {
    const redis = getRedis();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const photos = await redis.get<Photo[]>(PHOTOS_KEY) || [];
    
    if (category && category !== "all") {
      const filtered = photos.filter(p => p.category === category);
      return NextResponse.json({ photos: filtered });
    }

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error al obtener fotos:", error);
    return NextResponse.json({ photos: [] });
  }
}

// POST - Agregar nueva foto
export async function POST(request: NextRequest) {
  try {
    const redis = getRedis();
    const { url, category, title } = await request.json();
    
    if (!url || !category) {
      return NextResponse.json(
        { error: "URL y categoría requeridas" },
        { status: 400 }
      );
    }

    const photos = await redis.get<Photo[]>(PHOTOS_KEY) || [];
    const newPhoto: Photo = {
      url,
      category,
      title: title || "",
      date: new Date().toISOString(),
    };
    
    photos.push(newPhoto);
    await redis.set(PHOTOS_KEY, photos);

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error al guardar foto:", error);
    return NextResponse.json(
      { error: "Error al guardar foto" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar foto
export async function DELETE(request: NextRequest) {
  try {
    const redis = getRedis();
    const { index } = await request.json();
    
    if (typeof index !== "number") {
      return NextResponse.json(
        { error: "Índice requerido" },
        { status: 400 }
      );
    }

    const photos = await redis.get<Photo[]>(PHOTOS_KEY) || [];
    photos.splice(index, 1);
    await redis.set(PHOTOS_KEY, photos);

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error al eliminar foto:", error);
    return NextResponse.json(
      { error: "Error al eliminar foto" },
      { status: 500 }
    );
  }
}
