import { type LanguageModel } from 'ai';

export interface EvalResult {
  accuracy: number;
  completeness: number;
  relevance: number;
  clarity: number;
  reasoning: number;
  overall_comments: string;
}

export interface EvalFunction {
  name: string;
  description: string;
  run: (model: LanguageModel) => Promise<EvalResult>;
}

export interface EvalConfig {
  model: LanguageModel;
  evals: EvalFunction[];
} 