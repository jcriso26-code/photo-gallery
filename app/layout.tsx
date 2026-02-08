import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tu Nombre | Fotógrafo Profesional",
  description: "Portfolio de fotografía profesional. Especializado en paisajes, retratos y eventos. Capturando momentos únicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
