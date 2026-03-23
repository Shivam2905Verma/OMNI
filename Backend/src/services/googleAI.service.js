const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

const OMNI_SCHEMA = {
  type: "object",
  properties: {
    pillar: {
      type: "string",
      description: "The high-level category (e.g., Coding, Movies, Finance).",
    },
    subtopic: {
      type: "string",
      description:
        "The specific niche or folder (e.g., React, Marvel, Crypto).",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "5 highly specific keywords for searching.",
    },
    summary: {
      type: "string",
      description: "A concise 1-sentence summary of the content.",
    },
  },
  required: ["pillar", "subtopic", "tags", "summary"],
};


const SEARCH_SCHEMA = {
  type: "object",
  properties: {
    searchPillar: {
      type: "string",
      description:
        "The high-level category inferred from the query (e.g., Coding, Movies, Finance, Music).",
    },
    searchSubtopic: {
      type: "string",
      description:
        "The specific niche or topic inferred from the query (e.g., React Hooks, Marvel Movies, Afrobeats).",
    },
    searchTags: {
      type: "array",
      items: { type: "string" },
      description:
        "3 to 5 highly relevant keywords extracted from the query.",
    },
    searchSummary: {
      type: "string",
      description:
        "A short 1-sentence description explaining the user’s search intent.",
    },
  },
  required: [
    "searchPillar",
    "searchSubtopic",
    "searchTags",
    "searchSummary",
  ],
};


const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: OMNI_SCHEMA,
  },
});

const searchModel = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
   generationConfig: {
    responseMimeType: "application/json",
    responseSchema: SEARCH_SCHEMA,
  },
});

const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});


const systemPrompt = (existingPillars) => `
You are a Knowledge Architect. Categorize this content into a "Second Brain" hierarchy.

CURRENT USER PILLARS: [${existingPillars.join(", ")}]

STRICT CATEGORIZATION LOGIC:
1. PREFER EXISTING: If the content fits an existing pillar (e.g., "Music"), use it exactly.
2. SUGGEST BETTER: If an existing pillar is a partial match but a DIFFERENT name would be significantly more accurate for the long-term (e.g., the user has "Songs" but the content is a Music Theory PDF, suggest "Music Theory" instead), you may suggest the new name.
3. CREATE NEW: If the content is 100% unrelated to existing pillars, create a new, broad Pillar (1-2 words).

REFINEMENT RULE:
- If you suggest a NEW pillar that is very similar to an EXISTING one (e.g., suggesting "Finances" when "Money" exists), STOP. Use the existing one ("Money") to avoid duplicates.

OUTPUT REQUIREMENTS:
- Format: Strictly JSON.
{
  "pillar": "Chosen or New Pillar Name",
  "subtopic": "Specific Sub-category",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "summary": "One sentence summary."
}
`;
module.exports = { model, embeddingModel, systemPrompt , searchModel };
