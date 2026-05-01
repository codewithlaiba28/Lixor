import Cerebras from '@cerebras/cerebras_cloud_sdk';

if (!process.env.CEREBRAS_API_KEY) {
  throw new Error("Missing CEREBRAS_API_KEY environment variable");
}

export const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});
