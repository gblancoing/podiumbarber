import { AdvisorClient } from './AdvisorClient';
import { Sparkles } from 'lucide-react';

export default function AIAdvisorPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
            <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold mt-4">AI-Powered Style Advisor</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Not sure what you're looking for? Let our AI help you find the perfect style and services for your hair.
        </p>
      </div>
      <AdvisorClient />
    </div>
  );
}
