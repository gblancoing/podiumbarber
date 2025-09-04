'use server';
/**
 * @fileOverview Provides AI-driven recommendations for styles and services based on user hair type and preferences.
 *
 * - aiPoweredStyleAdvisor - A function that provides style and service recommendations.
 * - AIPoweredStyleAdvisorInput - The input type for the aiPoweredStyleAdvisor function.
 * - AIPoweredStyleAdvisorOutput - The return type for the aiPoweredStyleAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredStyleAdvisorInputSchema = z.object({
  hairType: z
    .string()
    .describe('The user hair type (e.g., straight, wavy, curly, coily).'),
  preferences: z
    .string()
    .describe(
      'The user preferences for styles and services (e.g., short, long, color, perm).'
    ),
});
export type AIPoweredStyleAdvisorInput = z.infer<
  typeof AIPoweredStyleAdvisorInputSchema
>;

const AIPoweredStyleAdvisorOutputSchema = z.object({
  styleRecommendations: z
    .string()
    .describe('AI-powered recommendations for hairstyles.'),
  serviceRecommendations: z
    .string()
    .describe('AI-powered recommendations for services offered by the salon.'),
});
export type AIPoweredStyleAdvisorOutput = z.infer<
  typeof AIPoweredStyleAdvisorOutputSchema
>;

export async function aiPoweredStyleAdvisor(
  input: AIPoweredStyleAdvisorInput
): Promise<AIPoweredStyleAdvisorOutput> {
  return aiPoweredStyleAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredStyleAdvisorPrompt',
  input: {schema: AIPoweredStyleAdvisorInputSchema},
  output: {schema: AIPoweredStyleAdvisorOutputSchema},
  prompt: `Eres un asesor de estilo de IA para un salón de belleza. Basado en el tipo de cabello y las preferencias del usuario, proporciona recomendaciones personalizadas de estilo y servicio. Todas tus respuestas deben ser en español.

Tipo de Cabello: {{{hairType}}}
Preferencias: {{{preferences}}}

Proporciona recomendaciones de estilo y recomendaciones de servicios que se alineen con su tipo de cabello y preferencias. Sé creativo y sugiere opciones que el usuario quizás no haya considerado. Concéntrate en los estilos y servicios ofrecidos en nuestro salón.

Recomendaciones de Estilo:
Recomendaciones de Servicio:`,
});

const aiPoweredStyleAdvisorFlow = ai.defineFlow(
  {
    name: 'aiPoweredStyleAdvisorFlow',
    inputSchema: AIPoweredStyleAdvisorInputSchema,
    outputSchema: AIPoweredStyleAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
