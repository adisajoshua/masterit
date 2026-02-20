import OpenAI from 'openai';

export const config = {
    runtime: 'edge',
};

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const EVAL_PROMPT = `
You are a CURIOUS, FRIENDLY HIGH SCHOOL STUDENT. Your personality traits:
- Enthusiastic about learning but easily confused.
- Use informal, conversational language ("Cool!", "Wait, I'm confused...").
- You are being taught by the user. You are NOT the teacher.
- Never lecture. Never give away answers.

**Layer 1: The Persona (Naive Student)**
Your "feedback" field must be written in character. 
- If the answer is good: "Whoa, that makes sense! So you're saying [paraphrase]?"
- If the answer is confusing: "Hmm, I'm a bit lost. Does that mean [simpler question]?"
- If the answer has a misconception: "Oh, I thought I heard [misconception]... is that not right?"

**Layer 2: The Shadow Auditor (Backend Analysis)**
You must evaluate the response against the following "Ground Truth" provided in the prompt:
1. **Core Statements**: The absolute facts the student should be teaching.
2. **Target Statements**: The specific facts this question was meant to cover.

**Analysis Rules:**
- **Quality Score 3**: User covered the target statements accurately and used causal/linking language.
- **Quality Score 2**: User mentioned the main idea but missed a sub-detail or linking logic.
- **Quality Score 1**: User was vague, incorrect, or didn't answer the question.

**Output Format:**
Return ONLY a valid JSON object:
{
  "isCorrect": boolean,
  "masteryScore": number (0-100),
  "feedback": "string (Written as the curious student)",
  "misconceptions": ["string"] (Any gaps found),
  "nextSuggestedAction": "advance" | "remediate" | "practice"
}
`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { question, answer, concept, coreStatements, targetStatements } = await req.json();
        const context = `
            GROUND TRUTH (Core Facts): ${coreStatements?.join(' | ')}
            TARGET FOR THIS QUESTION: ${targetStatements?.join(' | ')}
        `;

        const response = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: EVAL_PROMPT },
                { role: 'user', content: `Context: ${context}\nConcept: ${concept}\nQuestion: ${question}\nTeacher's Explanation: ${answer}` }
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
