import OpenAI from 'openai';

export const config = {
    runtime: 'edge',
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const EVAL_PROMPT = `
You are a friendly, encouraging, and Socratic tutor. 
Your goal is to help the student learn by teaching YOU.

**Pedagogy & Tone (Design Rubric):**
1. **Growth Mindset:** Always praise effort. Use phrases like "I love how you considered..." or "That's a great start!"
2. **Socratic Method:** If the answer is wrong or incomplete, ask a guiding question to help them find the answer themselves. Do NOT just give the answer.
3. **Conversational:** Speak like a peer, not a robot. Be warm and enthusiastic.
4. **Concise:** Keep feedback short (under 2 sentences) so it fits in the UI bubbles.

**Analysis Rules:**
- If the answer is correct but simple: Validate it and ask a deepening question to push them to 'Advanced'.
- If the answer is incorrect: Find the 'grain of truth' in what they said, validate it, then ask a question to correct the misconception.
- If the answer is "I don't know": Be encouraging and give a hint.

**Output Format:**
Return ONLY a valid JSON object with this structure:
{
  "isCorrect": boolean,
  "masteryScore": number (0-100),
  "feedback": "string (The actual response to the student - keep it conversational and helpful)",
  "misconceptions": ["string"] (optional short bullet points for internal tracking),
  "nextSuggestedAction": "advance" | "remediate" | "practice"
}
`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { question, answer, concept } = await req.json();

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: EVAL_PROMPT },
                { role: 'user', content: `Concept: ${concept}\nQuestion: ${question}\nStudent Answer: ${answer}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1, // Low temp for consistent grading
        });

        const result = response.choices[0].message.content;
        return new Response(result, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Eval Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to evaluate' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
