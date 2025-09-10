
'use client';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { featuredData } from "../lib/data";
import { ArrowRight, Scissors } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white overflow-hidden">
        {/* Image Mosaic Background */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src="/img/barberia_v5.jpg"
              alt="Interior de la barbería"
              data-ai-hint="barbershop interior"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="col-span-1 row-span-1 relative">
            <Image
              src="/img/barberia_v3.jpg"
              alt="Barbero atendiendo a un cliente"
              data-ai-hint="barber client"
              fill
              className="object-cover"
            />
          </div>
          <div className="col-span-1 row-span-1 relative">
            <Image
              src="/img/barberia_v1.jpg"
              alt="Cliente con un corte de pelo fresco"
              data-ai-hint="men haircut"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center text-center h-full p-8">
          <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg max-w-4xl">
            Experimenta tu Mejor Look
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
            Agenda tu cita online, rápido y sencillo.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
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
            {featuredData.services.map((service) => (
              <Card key={service.id} className="transform hover:scale-105 transition-all duration-300 shadow-lg rounded-xl overflow-hidden bg-card border-border hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-primary/20 rounded-full border border-primary/30">
                      <Scissors className="text-primary h-6 w-6"/>
                    </div>
                    <span className="text-xl text-foreground">{service.name}</span>
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
            {featuredData.stylists.map((stylist) => (
              <div key={stylist.id} className="text-center flex flex-col items-center">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-lg hover:shadow-primary/25 transition-shadow duration-300">
                  <AvatarImage src={stylist.avatarUrl} alt={stylist.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{stylist.name.charAt(0)}</AvatarFallback>
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
    </div>
  );
}
