import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galería de Fotos",
  description: "Sube y comparte tus fotografías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
