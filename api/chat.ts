import OpenAI from 'openai';

// Use Edge Runtime for fastest localized response and streaming support
export const config = {
    runtime: 'edge',
};

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `
You are MasterIt, an adaptive and empathetic tutor. 
Your goal is to help the student understand concepts through Socratic questioning and clear metaphors.

**Personality:**
- Encouraging, patient, and knowledgeable.
- You use emojis occasionally to keep the vibe friendly 🦊.
- You NEVER give the direct answer to a diagnostic question; you guide them.

**Rules:**
1. Keep responses concise (max 2-3 sentences unless explaining a complex topic).
2. Use bolding to highlight key terms.
3. If the user is struggling, offer a hint.
4. If the user gets it right, celebrate briefly and move to the next logical step.
`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { messages } = await req.json();

        const response = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            stream: true,
            temperature: 0.7,
        });

        // Stream the response back to the client
        return new Response(response.toReadableStream());
    } catch (error) {
        console.error('AI Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
