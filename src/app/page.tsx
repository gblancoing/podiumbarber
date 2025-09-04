import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { featuredServices, featuredStylists } from "@/lib/data";
import { ArrowRight, Scissors, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Modern hair salon interior"
          data-ai-hint="salon interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
          <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg">
            Experience Your Best Look
          </h1>
          <p className="mt-4 max-w-lg text-lg md:text-xl drop-shadow-md">
            Discover talented stylists, explore trending services, and book your next appointment with ease.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/book">
                Book an Appointment <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold">Our Services</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Tailored treatments to bring out your best.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Card key={service.id} className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scissors className="text-primary"/>
                    {service.name}
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
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stylists Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold">Meet Our Stylists</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              The creative hands behind your perfect style.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredStylists.map((stylist) => (
              <div key={stylist.id} className="text-center flex flex-col items-center">
                <Avatar className="w-32 h-32 border-4 border-primary">
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
              <Link href="/stylists">View All Stylists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Advisor Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <Sparkles className="h-10 w-10 text-accent mb-4"/>
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Unsure About Your Style?</h2>
                <p className="mt-4 text-lg opacity-90">
                  Our AI Style Advisor can help! Get personalized recommendations based on your hair type and preferences. Discover your next favorite look.
                </p>
                <Button asChild variant="secondary" className="mt-8">
                  <Link href="/ai-advisor">
                    Try the AI Advisor <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block h-full">
                <Image
                  src="https://picsum.photos/800/600"
                  alt="AI style abstract"
                  data-ai-hint="futuristic hair"
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
