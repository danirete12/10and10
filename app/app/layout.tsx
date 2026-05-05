import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | 10and10",
    default: "10and10 — Wiki de Relojería",
  },
  description:
    "La referencia definitiva en español para el aficionado a la relojería. Base de datos de relojes, marcas y calibres.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://10and10.es"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", inter.variable, playfair.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
