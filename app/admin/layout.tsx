import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Portfolio",
  description: "Panel de administración para gestionar fotos del portfolio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
