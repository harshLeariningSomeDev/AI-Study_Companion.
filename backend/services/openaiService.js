import OpenAI from "openai";

export const generateEmbedding = async (text) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("ENV VALUE:", process.env.OPENAI_API_KEY);
    throw new Error("OPENAI_API_KEY is missing in .env");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return response.data[0].embedding;
};