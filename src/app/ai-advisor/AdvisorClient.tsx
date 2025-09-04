'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useTransition } from 'react';
import { getStyleAdvice } from './actions';
import type { AIPoweredStyleAdvisorOutput } from '@/ai/flows/ai-powered-style-advisor';
import { Bot, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  hairType: z.string().min(1, 'Por favor, selecciona tu tipo de cabello.'),
  preferences: z.string().min(10, 'Por favor, describe tus preferencias en al menos 10 caracteres.'),
});

export function AdvisorClient() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AIPoweredStyleAdvisorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hairType: '',
      preferences: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const response = await getStyleAdvice(values);
      if (response.success) {
        setResult(response.data!);
      } else {
        setError(response.error!);
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Describe tu Cabello</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="hairType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cabello</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu tipo de cabello..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="straight">Liso</SelectItem>
                      <SelectItem value="wavy">Ondulado</SelectItem>
                      <SelectItem value="curly">Rizado</SelectItem>
                      <SelectItem value="coily">Crespo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilos y Preferencias</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: 'Me gustan los estilos cortos y de bajo mantenimiento', 'Estoy pensando en teñirme rubia', 'Algo para un look profesional'..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Obtener Consejo
            </Button>
          </form>
        </Form>
        
        {isPending && (
            <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Nuestra IA está pensando...</p>
            </div>
        )}

        {error && (
            <Alert variant="destructive" className="mt-8">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-500">
            <h3 className="text-2xl font-headline font-semibold text-center">Tus Recomendaciones Personalizadas</h3>
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Estilo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{result.styleRecommendations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{result.serviceRecommendations}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
