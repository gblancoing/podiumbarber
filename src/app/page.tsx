
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { featuredServices, featuredStylists } from "@/lib/data";
import { ArrowRight, Scissors, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const carouselImages = [
        { src: "/img/barberia_v5.jpg", alt: "Interior de la barbería", hint: "barbershop interior" },
        { src: "/img/barberia_v3.jpg", alt: "Barbero atendiendo a un cliente", hint: "barber client" },
        { src: "/img/barberia_v1.jpg", alt: "Cliente con un corte de pelo fresco", hint: "men haircut" },
    ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {carouselImages.map((img, index) => (
              <CarouselItem key={index} className="relative h-full w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  data-ai-hint={img.hint}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg max-w-4xl">
            Experimenta tu Mejor Look
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
            Agenda tu cita online, rápido y sencillo.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-lg">
              <Link href="/book">
                Reservar ahora <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold">Nuestros Servicios</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Calidad y Estilo Garantizado.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Card key={service.id} className="transform hover:scale-105 transition-transform duration-300 shadow-lg rounded-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Scissors className="text-primary h-6 w-6"/>
                    </div>
                    <span className="text-xl">{service.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/services">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stylists Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold">¿Quiénes te Atenderán?</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Conoce a nuestro increíble equipo de estilistas.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStylists.map((stylist) => (
              <div key={stylist.id} className="text-center flex flex-col items-center">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
                  <AvatarImage src={stylist.avatarUrl} alt={stylist.name} />
                  <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-bold text-xl">{stylist.name}</h3>
                <p className="text-primary">{stylist.specialties[0]}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/stylists">Ver Todos los Estilistas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Advisor Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden rounded-2xl shadow-xl">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <Sparkles className="h-10 w-10 text-accent mb-4"/>
                <h2 className="text-3xl md:text-4xl font-headline font-bold">¿Necesitas inspiración para tu estilo?</h2>
                <p className="mt-4 text-lg opacity-90">
                  Nuestro Asesor de Estilo con IA puede ayudarte a encontrar tu look ideal. Responde unas pocas preguntas y recibe recomendaciones personalizadas al instante.
                </p>
                <Button asChild variant="secondary" className="mt-8 rounded-full px-8 py-6 text-lg">
                  <Link href="/ai-advisor">
                    Consultar ahora <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block h-full">
                <Image
                  src="/img/barberia_v3.jpg"
                  alt="Mujer con un peinado elegante"
                  data-ai-hint="elegant hairstyle"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
}
