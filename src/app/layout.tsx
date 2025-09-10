
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
// Se elimina la importación directa del Toaster
// import { Toaster } from "@/components/ui/toaster"; 
// Se importa el nuevo ToasterProvider
import { ToasterProvider } from "@/components/providers/toaster-provider";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Podium Barber - Tu Barbería de Confianza",
  description: "Servicios de barbería premium en un ambiente relajado. Reserva tu cita online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth dark">
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased", 
          inter.variable, 
          playfair.variable
        )}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {/* Se utiliza el ToasterProvider en lugar del Toaster directo */}
        <ToasterProvider />
      </body>
    </html>
  );
}
