"use client";

import Image from "next/image";

interface GalleryProps {
  photos: string[];
}

export default function Gallery({ photos }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
        >
          <Image
            src={photo}
            alt={`Foto ${index + 1}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium">Foto #{photos.length - index}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
