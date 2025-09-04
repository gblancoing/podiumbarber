import { AdvisorClient } from './AdvisorClient';
import { Sparkles } from 'lucide-react';

export default function AIAdvisorPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
            <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold mt-4">Asesor de Estilo con IA</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          ¿No sabes qué estás buscando? Deja que nuestra IA te ayude a encontrar el estilo y los servicios perfectos para tu cabello.
        </p>
      </div>
      <AdvisorClient />
    </div>
  );
}
