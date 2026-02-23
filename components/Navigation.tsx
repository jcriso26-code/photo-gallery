"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/LogoFotografia.png"
              alt="Jose Jimenez Fotografía"
              width={48}
              height={48}
              className="rounded-full bg-black p-1"
            />
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              Jose Jimenez
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-700 hover:text-slate-900 transition-colors">
              Inicio
            </a>
            <a href="#portfolio" className="text-slate-700 hover:text-slate-900 transition-colors">
              Portfolio
            </a>
            <a href="#about" className="text-slate-700 hover:text-slate-900 transition-colors">
              Sobre Mí
            </a>
            <a
              href="#contact"
              className="px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              Contacto
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#" className="block text-slate-700 hover:text-slate-900">
              Inicio
            </a>
            <a href="#portfolio" className="block text-slate-700 hover:text-slate-900">
              Portfolio
            </a>
            <a href="#about" className="block text-slate-700 hover:text-slate-900">
              Sobre Mí
            </a>
            <a href="#contact" className="block text-slate-700 hover:text-slate-900">
              Contacto
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
