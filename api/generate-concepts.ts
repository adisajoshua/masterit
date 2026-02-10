
import OpenAI from 'openai';

// Use Edge Runtime
export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CURRICULUM_PROMPT = `
You are an expert Curriculum Designer.
Analyze the provided study material and break it down into teachable **Concepts**.

**Pedagogy Standard (Design Rubric):**
1. **Concept First:** Focus on the "Big Idea" before details.
2. **Cognitive Load:** Break complex topics into 3 distinct layers:
   - **Basic:** "What is it?" (Definitions, Analogies)
   - **Intermediate:** "How does it work?" (Mechanisms, Relationships)
   - **Advanced:** "Why does it matter?" (Implications, Synthesis)
3. **Socratic Questions:** Questions should provoke thought, not just recall.

**Output Structure:**
Return valid JSON with this EXACT structure (ensure all fields are present):
{
  "concepts": [
    {
      "id": "slug-id",
      "title": "Clear Concept Title",
      "snippet": "Short definition/summary (max 200 chars)",
      "confidence": 3, 
      "mastery": 0, 
      "source_text_snippet": "Relevant source text...",
      "core_statements": ["Statement 1", "Statement 2"],
      "questions": [
        // GENERATE AT LEAST 6 QUESTIONS PER CONCEPT (2 Basic, 2 Int, 2 Adv)
        {
          "id": "q_conn_basic_1",
          "text": "Question text...",
          "type": "connection", // or "application"
          "difficulty": "basic", // or "intermediate" or "advanced"
          "cognitive_level": "understand", 
          "remediation": { 
             "hint": "A helpful nugget without giving the answer", 
             "simplified_text": "Rephrased simpler version of the question",
             "example_answer": "A perfect model answer" 
          }
        }
      ]
    }
  ]
}
`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CURRICULUM_PROMPT },
        { role: 'user', content: `Analyze this material:\n\n${text.substring(0, 15000)}` } // Limit text
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return new Response(response.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Curriculum Gen Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate curriculum' }), { status: 500 });
  }
}
