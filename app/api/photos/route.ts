import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PHOTOS_KEY = "portfolio:photos";

// GET - Obtener todas las fotos
export async function GET() {
  try {
    const photos = await redis.get<string[]>(PHOTOS_KEY) || [];
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error al obtener fotos:", error);
    return NextResponse.json({ photos: [] });
  }
}

// POST - Agregar nueva foto
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: "URL requerida" },
        { status: 400 }
      );
    }

    const photos = await redis.get<string[]>(PHOTOS_KEY) || [];
    photos.push(url);
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
    const { index } = await request.json();
    
    if (typeof index !== "number") {
      return NextResponse.json(
        { error: "Índice requerido" },
        { status: 400 }
      );
    }

    const photos = await redis.get<string[]>(PHOTOS_KEY) || [];
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
