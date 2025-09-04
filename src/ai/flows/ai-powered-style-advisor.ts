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
  prompt: `You are an AI style advisor for a hair salon. Based on the user's hair type and preferences, provide personalized style and service recommendations.

Hair Type: {{{hairType}}}
Preferences: {{{preferences}}}

Provide style recommendations and service recommendations that align with their hair type and preferences. Be creative and suggest options the user may not have considered. Focus on styles and services offered at our salon.

Style Recommendations:
Service Recommendations: `,
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
