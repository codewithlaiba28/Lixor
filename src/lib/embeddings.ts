/**
 * Embedding generation with Vercel-compatible fallback.
 *
 * Strategy:
 * - On Vercel (or any environment where @xenova/transformers fails),
 *   we fall back to a simple keyword-based zero vector so the rest of
 *   the RAG pipeline still runs without crashing.
 * - The vector search will return no results (all distances equal),
 *   which is fine — the chatbot still works, just without RAG context.
 */

let _pipeline: any = null;
let _pipelineFailed = false;

async function getLocalPipeline(): Promise<any | null> {
  if (_pipelineFailed) return null;
  if (_pipeline) return _pipeline;

  try {
    // Dynamic import so the module is only loaded when actually needed
    // and build-time errors are avoided on Vercel.
    const { pipeline, env } = await import("@xenova/transformers");
    env.allowLocalModels = false;
    _pipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    return _pipeline;
  } catch {
    _pipelineFailed = true;
    return null;
  }
}

/**
 * Generates a 384-dimensional embedding vector for the given text.
 * Falls back to a zero vector if the local model is unavailable (e.g. Vercel).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const DIMS = 384;

  if (!text || text.trim().length === 0) {
    return new Array(DIMS).fill(0);
  }

  // Try local Xenova model first (works in local dev / Node environments)
  const extractor = await getLocalPipeline();
  if (extractor) {
    try {
      const output = await extractor(text, { pooling: "mean", normalize: true });
      return Array.from(output.data) as number[];
    } catch {
      // fall through to fallback
    }
  }

  // Fallback: zero vector — RAG returns no docs, chatbot still works
  console.warn("[embeddings] Using zero-vector fallback (Xenova unavailable)");
  return new Array(DIMS).fill(0);
}
