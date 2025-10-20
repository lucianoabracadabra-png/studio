import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkitEval} from '@genkit-ai/next';

configureGenkit({
  plugins: [
    googleAI(),
    genkitEval({
      judge: 'googleai/gemini-1.5-flash',
      metrics: ['all'],
    }),
  ],
  enableTracingAndMetrics: true,
});

export {ai} from 'genkit';
