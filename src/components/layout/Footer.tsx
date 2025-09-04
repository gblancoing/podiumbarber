import { Scissors, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
              <Scissors className="h-6 w-6 text-primary" />
              BooksyStyle
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu próximo corte de pelo, a solo un clic de distancia.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Explorar</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Servicios</Link></li>
              <li><Link href="/stylists" className="text-muted-foreground hover:text-primary">Estilistas</Link></li>
              <li><Link href="/book" className="text-muted-foreground hover:text-primary">Reservar Ahora</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Nosotros</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Nuestra Historia</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Trabaja con Nosotros</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contáctanos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Conecta</h3>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BooksyStyle. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
