'use server';
import { aiPoweredStyleAdvisor, AIPoweredStyleAdvisorInput } from '@/ai/flows/ai-powered-style-advisor';

export async function getStyleAdvice(input: AIPoweredStyleAdvisorInput) {
    try {
        const result = await aiPoweredStyleAdvisor(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('AI Style Advisor Error:', error);
        return { success: false, error: 'Failed to get style advice. The model may be unavailable. Please try again later.' };
    }
}
