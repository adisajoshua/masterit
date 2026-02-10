
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

**Output Format:**
Return valid JSON with this structure:
{
  "concepts": [
    {
      "id": "slug-id",
      "title": "Clear Concept Title",
      "snippet": "Short definition/summary (max 200 chars)",
      "confidence": 3, // 1-5 difficulty/estimation
      "mastery": 0, // Always start at 0
      "source_text_snippet": "Relevant source text...",
      "core_statements": ["Statement 1", "Statement 2"],
      "sub_concepts": [
        { "id": "sc_1", "title": "Sub-concept Title", "completed": false, "difficulty": "basic" }
      ],
      "questions": [
        {
          "id": "q_conn_basic_1",
          "text": "Question text...",
          "type": "connection",
          "difficulty": "basic",
          "cognitive_level": "understand",
          "remediation": { "hint": "...", "example": "..." }
        }
        // ... generate at least 3 questions (basic, intermediate, advanced)
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
