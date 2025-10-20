import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

configureGenkit({
  plugins: [
    googleAI(),
  ],
  enableTracingAndMetrics: true,
});

export {ai} from 'genkit';
