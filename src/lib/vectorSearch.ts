import prisma from "./prisma";

export interface RetrievedDocument {
  content: string;
  metadata: any;
  similarity: number;
}

/**
 * Searches the vector database for documents similar to the query embedding.
 * Uses Cosine Similarity (<=>) for the comparison.
 */
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  limit: number = 5
): Promise<RetrievedDocument[]> {
  try {
    // Format the array into a vector string format required by pgvector: '[0.1, 0.2, ...]'
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    // Perform raw SQL query using Prisma
    // The <=> operator calculates the cosine distance between the vectors.
    // 1 - cosine distance = cosine similarity
    const results = await prisma.$queryRaw`
      SELECT 
        content, 
        metadata, 
        1 - (embedding <=> ${embeddingString}::vector) AS similarity
      FROM "Document"
      ORDER BY embedding <=> ${embeddingString}::vector
      LIMIT ${limit};
    `;

    return results as RetrievedDocument[];
  } catch (error) {
    console.error("Vector search error:", error);
    return [];
  }
}
