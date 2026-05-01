import { pipeline, env } from "@xenova/transformers";

// Disable local models directory since we are using Xenova's HuggingFace models
env.allowLocalModels = false;

// We use the singleton pattern to ensure the pipeline is only loaded once in production
class PipelineSingleton {
  static task = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

/**
 * Generates an embedding vector for the given text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return new Array(384).fill(0); // Return empty vector if no text
  }
  try {
    const extractor = await PipelineSingleton.getInstance();
    
    // Generate the embedding
    // The pooling='mean' and normalize=true parameters are standard for all-MiniLM models
    const output = await extractor(text, { pooling: "mean", normalize: true });
    
    // Convert Float32Array to standard array
    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}
