import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { stylists } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function StylistsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="relative text-center mb-12 rounded-lg overflow-hidden">
            <Image
                src="/img/barberia_v1.jpg"
                alt="Estilista trabajando"
                data-ai-hint="stylist working"
                fill
                className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gray-900/80" />
            <div className="relative z-10 py-20 px-4">
                <h1 className="text-4xl font-headline font-bold text-white">Conoce a Nuestros Estilistas</h1>
                <p className="mt-2 text-lg text-slate-300">
                    Los talentosos artistas que darán vida a tu visión.
                </p>
                {/* URGENT: Solo Stiven Vargas y Kamilo Fonseca - Andres Leyton eliminado */}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((stylist) => (
            <Card key={stylist.id} className="flex flex-col text-center items-center p-6 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={stylist.avatarUrl} alt={stylist.name} />
                <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardHeader className="pb-2">
                <CardTitle className="font-headline text-2xl">{stylist.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap justify-center gap-2 my-2">
                    {stylist.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                </div>
                <p className="text-muted-foreground mt-4">{stylist.bio}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild>
                    <Link href={`/book?stylist=${stylist.id}`}>Reservar con {stylist.name.split(' ')[0]}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
