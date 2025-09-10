
import { services } from "@/lib/data";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Timer, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  const categories = services.reduce((acc, service) => {
    (acc[service.category] = acc[service.category] || []).push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const categoryOrder: Service['category'][] = ['Corte y Peinado', 'Barba', 'Otros Servicios'];
  const sortedCategories = Object.keys(categories).sort((a, b) => categoryOrder.indexOf(a as Service['category']) - categoryOrder.indexOf(b as Service['category']));

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="relative text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/img/barberia_v2.jpg"
          alt="Herramientas de barbería"
          data-ai-hint="barber tools"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 py-20 px-4">
            <h1 className="text-4xl font-headline font-bold text-white">Nuestros Servicios</h1>
            <p className="mt-2 text-lg text-slate-300">
                Encuentra el tratamiento perfecto para elevar tu estilo.
            </p>
        </div>
      </div>
      
      <div className="space-y-12">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h2 className="text-3xl font-headline font-semibold mb-8 border-b-2 border-primary pb-2">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories[category].map((service) => (
                <Card key={service.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="flex items-center justify-between text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-primary" />
                            <span>{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span>{service.price.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/book?service=${service.id}`}>
                        Reservar ahora <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
