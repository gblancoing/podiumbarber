'use server';
import { aiPoweredStyleAdvisor, AIPoweredStyleAdvisorInput } from '@/ai/flows/ai-powered-style-advisor';

export async function getStyleAdvice(input: AIPoweredStyleAdvisorInput) {
    try {
        const result = await aiPoweredStyleAdvisor(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('AI Style Advisor Error:', error);
        return { success: false, error: 'No se pudo obtener el consejo de estilo. Es posible que el modelo no esté disponible. Por favor, inténtalo de nuevo más tarde.' };
    }
}
