import { AdvisorClient } from './AdvisorClient';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function AIAdvisorPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="relative text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/img/barberia_v6.png"
          alt="Asesor de Estilo con IA"
          data-ai-hint="AI style advisor"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 py-20 px-4">
          <div className="inline-block p-4 bg-primary/10 rounded-full">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-white mt-4">Asesor de Estilo con IA</h1>
          <p className="mt-2 text-lg text-slate-300">
            ¿No sabes qué estás buscando? Deja que nuestra IA te ayude a encontrar el estilo y los servicios perfectos para tu cabello.
          </p>
        </div>
      </div>
      <AdvisorClient />
    </div>
  );
}
