
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/lib/data";
import { Service } from "@/lib/types";
import { DollarSign, Timer } from "lucide-react";

export default function ServicesPage() {
  const categories = services.reduce((acc, service) => {
    (acc[service.category] = acc[service.category] || []).push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const categoryOrder: Service['category'][] = ['Corte y Peinado', 'Coloración', 'Tratamientos', 'Otros'];
  const sortedCategories = Object.keys(categories).sort((a, b) => categoryOrder.indexOf(a as any) - categoryOrder.indexOf(b as any));

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Nuestros Servicios</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Encuentra el tratamiento perfecto para elevar tu estilo.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full" defaultValue="Corte y Peinado">
        {sortedCategories.map((category) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-2xl font-headline">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
                {categories[category].map((service) => (
                  <div key={service.id} className="p-4 rounded-lg border bg-card">
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <p className="text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-primary" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>${service.price.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

    