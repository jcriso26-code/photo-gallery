import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galería Fotográfica | Portfolio Profesional",
  description: "Galería de fotografía profesional. Capturando momentos únicos y creando recuerdos inolvidables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
