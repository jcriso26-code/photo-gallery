import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PHOTOS_KEY = "portfolio:photos";

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
}

interface Photo {
  url: string;
  category: string;
  title?: string;
  date: string;
}

// POST - Mover foto al inicio de su categoría (hacerla portada)
export async function POST(request: NextRequest) {
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
    
    if (index < 0 || index >= photos.length) {
      return NextResponse.json(
        { error: "Índice inválido" },
        { status: 400 }
      );
    }

    const photo = photos[index];
    const category = photo.category;

    // Remover la foto de su posición actual
    photos.splice(index, 1);

    // Encontrar el primer índice de esta categoría
    const firstCategoryIndex = photos.findIndex((p) => p.category === category);

    // Insertar la foto al inicio de su categoría
    if (firstCategoryIndex === -1) {
      // No hay otras fotos de esta categoría, agregar al final
      photos.push(photo);
    } else {
      // Insertar antes de la primera foto de esta categoría
      photos.splice(firstCategoryIndex, 0, photo);
    }

    await redis.set(PHOTOS_KEY, photos);

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error al reordenar foto:", error);
    return NextResponse.json(
      { error: "Error al reordenar foto" },
      { status: 500 }
    );
  }
}
