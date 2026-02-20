
import OpenAI from 'openai';

// Use Edge Runtime
export const config = {
  runtime: 'edge',
};

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
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
      "diagnostic_prompt": "A warm, open-ended question to see what the student already knows about this specific concept",
      "confidence": 3, 
      "mastery": 0, 
      "source_text_snippet": "Relevant source text...",
      "core_statements": ["Statement 1", "Statement 2"],
      "sub_concepts": [
        { "id": "sub-1", "title": "Sub-concept Title", "completed": false }
      ],
      "questions": [
        // MANDATORY: Generate EXACTLY 6 Questions for the pool:
        // 1. { type: "connection", difficulty: "basic" }
        // 2. { type: "connection", difficulty: "intermediate" }
        // 3. { type: "connection", difficulty: "advanced" }
        // 4. { type: "application", difficulty: "basic" }
        // 5. { type: "application", difficulty: "intermediate" }
        // 6. { type: "application", difficulty: "advanced" }
        {
          "id": "q1",
          "text": "...",
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
      model: 'llama-3.3-70b-versatile',
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
