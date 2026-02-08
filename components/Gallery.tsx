"use client";

import Image from "next/image";

export interface Photo {
  url: string;
  category: string;
  title?: string;
  date: string;
}

interface GalleryProps {
  photos: Photo[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Masonry layout heights
  const getItemHeight = (index: number) => {
    const heights = ["h-64", "h-80", "h-72", "h-96", "h-64", "h-88"];
    return heights[index % heights.length];
  };

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`group relative ${getItemHeight(index)} overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer break-inside-avoid`}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.url}
              alt={photo.title || `Foto ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  🔍
                </div>
              </div>
              {photo.title && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm">{photo.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* Previous button */}
          <button
            className="absolute left-6 text-white text-5xl hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>

          {/* Next button */}
          <button
            className="absolute right-6 text-white text-5xl hover:text-gray-300 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[currentImage].url}
              alt={photos[currentImage].title || `Foto ${currentImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Info */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white text-lg mb-1">
              {currentImage + 1} / {photos.length}
            </p>
            {photos[currentImage].title && (
              <p className="text-white/80 text-sm">{photos[currentImage].title}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
