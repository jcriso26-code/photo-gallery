import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jose Jimenez | Explorador Visual",
  description: "Luz. Detalle. Intención. Portfolio visual de Jose Jimenez. Explorando la belleza a través de la fotografía.",
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
