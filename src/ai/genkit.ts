import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkitEval, GenkitEvaluation} from '@genkit-ai/next';

configureGenkit({
  plugins: [
    googleAI(),
    genkitEval({
      judge: 'googleai/gemini-1.5-flash',
      metrics: GenkitEvaluation.ALL_METRICS,
    }),
  ],
  enableTracingAndMetrics: true,
});

export {ai} from 'genkit';
