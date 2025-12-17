'use server';

import { aiEngine } from '@/lib/ai/engine';
import { ModelDTO } from '@/lib/ai/types';

export async function getAvailableModels(): Promise<ModelDTO[]> {
    return aiEngine.getAllModels();
}
