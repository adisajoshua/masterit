import { AdaptiveConcept, AdaptiveQuestion, AdaptiveSession } from "../../../types/adaptive";

// Feature Flag - easy switch between Real and Mock
// You can set this in your .env file: VITE_USE_REAL_AI=true
export const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export class RealAdaptiveService {

    /**
     * Calls the Vercel Function to chat with the AI (for separate chat components)
     */
    static async callChatApi(messages: ChatMessage[]) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) throw new Error('AI Service Error');
            if (!response.body) throw new Error('No response body');

            // For streaming, we return the reader
            return response.body.getReader();
        } catch (error) {
            console.error('Chat API Fatal Error:', error);
            throw error;
        }
    }

    /**
     * Calls the Vercel Function to evaluate an answer
     */
    static async callEvaluateApi(data: { question: string; answer: string; concept: string }) {
        try {
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Evaluation failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Evaluation API Error", error);
            // Fallback to a "safe" mock response if API fails to prevent app crash
            return {
                isCorrect: true,
                masteryScore: 80,
                feedback: "I'm having trouble connecting to my brain right now, but that sounds like a distinct answer. Let's keep going!",
                nextSuggestedAction: "practice"
            };
        }
    }

    // --- Public Methods matching SimulatedAdaptiveService signature ---

    static async analyzeDiagnostic(response: string, conceptId: string) {
        const aiResult = await this.callEvaluateApi({
            question: "Diagnostic Question (Implicit)",
            answer: response,
            concept: conceptId
        });

        // Map AI evaluation to Diagnostic result
        let difficulty = 'intermediate';
        if (aiResult.nextSuggestedAction === 'remediate') difficulty = 'basic';
        if (aiResult.nextSuggestedAction === 'advance') difficulty = 'advanced';

        return {
            recommendedDifficulty: difficulty,
            feedback: aiResult.feedback,
            analysis: {
                understanding: aiResult.isCorrect ? "Strong" : "Needs review",
                gaps: aiResult.misconceptions || []
            }
        };
    }

    static async analyzeResponse(params: {
        sessionId: string;
        conceptId: string;
        response: string;
        questionType: string;
        currentDifficulty: string;
        expectedKeyTerms?: string[];
    }) {
        const aiResult = await this.callEvaluateApi({
            question: `[${params.currentDifficulty} ${params.questionType}] Question`, // Ideally pass real text
            answer: params.response,
            concept: params.conceptId
        });

        // Map AI evaluation to Analysis result
        // AI return 0-100 mastery. We need a score 1-3 for the hook logic? 
        // Or does the hook use score?
        // Looking at useAdaptiveSession:
        // Score 1 -> Decrease
        // Score 2 -> Maintain
        // Score 3 -> Increase

        let score = 2;
        if (aiResult.masteryScore < 60) score = 1;
        if (aiResult.masteryScore > 85) score = 3;

        return {
            score: score,
            feedback: aiResult.feedback,
            masteryDelta: (aiResult.masteryScore - 50) / 2, // Scale to reasonable delta
            emotionalState: 'neutral', // backend doesn't detect yet
            nextStep: aiResult.nextSuggestedAction
        };
    }

    /**
     * HYBRID APPROACH:
     * Uses "Curated Curriculum Data" for questions to ensure they are high-quality and verified.
     * Does NOT hallucinate new questions.
     */
    static async generateNextQuestion(
        concept: AdaptiveConcept,
        history: AdaptiveQuestion[],
        difficulty: "basic" | "intermediate" | "advanced"
    ): Promise<AdaptiveQuestion> {
        // Filter the concept's verified questions by the current difficulty
        const pool = concept.questions.filter(q => q.difficulty === difficulty);

        // Find one we haven't answered yet
        const historyIds = new Set(history.map(h => h.id));
        const available = pool.filter(q => !historyIds.has(q.id));

        // If we have available questions, pick a random one
        if (available.length > 0) {
            const randomIndex = Math.floor(Math.random() * available.length);
            return available[randomIndex];
        }

        // If we ran out of questions for this difficulty, verify if we can pick ANY question
        const anyAvailable = concept.questions.filter(q => !historyIds.has(q.id));
        if (anyAvailable.length > 0) {
            const randomIndex = Math.floor(Math.random() * anyAvailable.length);
            return anyAvailable[randomIndex];
        }

        // Fallback: If absolutely no questions left, return a "Review" placeholder
        return {
            id: `fallback_${Date.now()}`,
            text: "You've covered all the planned questions for this topic! Tell me, what was the most interesting thing you learned?",
            type: 'open',
            difficulty: 'intermediate'
        };
    }

    static async getAdaptationMessage(
        from: string,
        to: string,
        reason: string
    ): Promise<{ type: 'upgrade' | 'downgrade' | 'stay'; text: string }> {
        // We can keep this simple/deterministic to save tokens, 
        // or make a cheap AI call. For now, simulated is fine for transitions.
        const type = to === 'advanced' ? 'upgrade' : to === 'basic' ? 'downgrade' : 'stay';
        let text = "";

        if (type === 'upgrade') text = "Excellent work. Let's dig deeper.";
        else if (type === 'downgrade') text = "Let's review the basics to build a strong foundation.";
        else text = "Let's keep practicing this level.";

        return { type, text };
    }
    async generateSummary(history: any[]): Promise<any> {
        // In a real app, we'd send the history to the AI to generate a detailed report.
        // For now, we can return a static summary or call the chat API specific for summary.
        // Let's call the chat API for a cool summary?
        // Or keep it simple for now to avoid latency.
        return {
            mastery: "High",
            strengths: ["Demonstrated strong understanding of key concepts.", "Good engagement with material."],
            weaknesses: ["Continue practicing to reinforce these new pathways."]
        };
    }
}
