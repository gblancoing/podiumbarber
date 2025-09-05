'use client';

import { Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();

  // No renderizar el footer en las rutas de admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
              <Image src="/img/logo.png" alt="PodiumBarber Logo" width={32} height={32} />
              PodiumBarber
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Experimenta tu mejor look.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Navegación</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Servicios</Link></li>
              <li><Link href="/stylists" className="text-muted-foreground hover:text-primary">Estilistas</Link></li>
              <li><Link href="/book" className="text-muted-foreground hover:text-primary">Reservar Ahora</Link></li>
               <li><Link href="/admin/dashboard" className="text-muted-foreground hover:text-primary">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Términos y Condiciones</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Redes Sociales</h3>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PodiumBarber. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
