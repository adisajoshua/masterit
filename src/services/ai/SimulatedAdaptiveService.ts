
import { mockAdaptiveConcepts } from "@/data/mockAdaptiveData";
import { AdaptiveConcept, AdaptiveQuestion } from "@/types/adaptive";
import { AnalysisRequest, AnalysisResult, IAdaptiveService } from "./types";

/**
 * Simulates a complex NLP analysis pipeline locally.
 * In production, this would be an API call to OpenAI/Gemini.
 */
export class SimulatedAdaptiveService implements IAdaptiveService {

    // Simulated delay to mimic network request
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Diagnostic Analysis:
     * - Scores based on keyword overlap with core statements.
     * - Determines initial difficulty.
     */
    async analyzeDiagnostic(response: string, conceptId: string): Promise<AnalysisResult> {
        await this.delay(1500);

        const concept = mockAdaptiveConcepts.find(c => c.id === conceptId);
        if (!concept) throw new Error("Concept not found");

        const text = response.toLowerCase();

        // 1. Keyword Extraction (Simulated Embeddings)
        // We check for key terms from the concept's core statements
        const keyTerms = this.extractKeyTerms(concept);
        const matchedTerms = keyTerms.filter(term => text.includes(term.toLowerCase()));

        // 2. Coverage Score (0-10)
        const coverage = matchedTerms.length / Math.max(keyTerms.length, 1);
        let score = Math.round(coverage * 10);

        // Boost for length/complexity
        if (text.split(' ').length > 20) score += 1;
        if (text.includes("because") || text.includes("however")) score += 1;

        score = Math.min(score, 10);

        // 3. Difficulty Mapping
        let difficulty: "basic" | "intermediate" | "advanced" = "intermediate";
        if (score <= 3) difficulty = "basic";
        if (score >= 7) difficulty = "advanced";

        return {
            score,
            feedback: this.generateDiagnosticFeedback(score, matchedTerms),
            recommendedDifficulty: difficulty,
            nextQuestionType: "connection",
            analysisDetails: {
                keyTermsUsed: matchedTerms,
                conceptCoverage: coverage,
                complexityScore: score / 10
            }
        };
    }

    /**
     * Question Response Analysis:
     * - Checks against expected key terms.
     * - Evaluates depth (causal/comparative words).
     */
    async analyzeResponse(request: AnalysisRequest): Promise<AnalysisResult> {
        await this.delay(1200);

        const text = request.response.toLowerCase();
        const keyTerms = request.expectedKeyTerms?.map(t => t.toLowerCase()) || [];

        // 1. Keyword Identification
        const matchedTerms = keyTerms.filter(term => text.includes(term));
        const coverage = keyTerms.length > 0 ? matchedTerms.length / keyTerms.length : 0; // 0-1

        // 2. Complexity Analysis
        const hasCausal = ["because", "since", "leads to", "due to"].some(w => text.includes(w));
        const hasComparative = ["however", "unlike", "similar to", "whereas"].some(w => text.includes(w));

        // 3. Scoring (1-3 Scale)
        // 1 = Basic/Incomplete
        // 2 = Adequate/Correct
        // 3 = Advanced/Insightful
        let score = 1;
        if (coverage > 0.4 || (coverage > 0.2 && request.response.length > 30)) score = 2;
        if (coverage > 0.7 && (hasCausal || hasComparative)) score = 3;

        // 4. Adaptation Logic
        // If Diagnostic -> Connection
        // If Connection -> Application
        // We return simple feedback here, logic handled in hook usually

        return {
            score,
            feedback: this.generateResponseFeedback(score, matchedTerms),
            // Difficulty recommendation logic can be handled by the caller or here
            // Here: if strict score is 1 -> maybe downgrade?
            misconception: this.detectMisconception(text),
            analysisDetails: {
                keyTermsUsed: matchedTerms,
                conceptCoverage: coverage,
                complexityScore: (hasCausal ? 0.5 : 0) + (hasComparative ? 0.5 : 0)
            }
        };
    }

    async generateSummary(history: any[]): Promise<any> {
        // Placeholder summary logic
        return {
            mastery: "High",
            strengths: ["Great use of causal reasoning"],
            weaknesses: ["Could elaborate more on connections"]
        };
    }

    // --- Helpers ---

    private extractKeyTerms(concept: AdaptiveConcept): string[] {
        // Extract meaningful nouns/verbs from core statements (Mock NLP)
        const statements = concept.core_statements.join(" ");
        const potentialTerms = ["selection", "traits", "survival", "reproduce", "environment", "advantage", "offspring", "generation", "pressure", "filter"];
        return potentialTerms.filter(t => statements.toLowerCase().includes(t));
    }

    private generateDiagnosticFeedback(score: number, terms: string[]): string {
        if (score >= 7) return `Great job! You identified key concepts like ${terms.slice(0, 2).join(", ")}.`;
        if (score >= 4) return `Good start. You mentioned ${terms[0] || "some ideas"}, but missed a few details.`;
        return "That's a start. Let's build up your understanding from the basics.";
    }

    private generateResponseFeedback(score: number, terms: string[]): string {
        if (score === 3) return "Excellent! You connected the concepts clearly.";
        if (score === 2) return `Good. You correctly used terms like ${terms[0] || "keyword"}.`;
        return "You're on the right track, but try to explain *why* that happens.";
    }

    private detectMisconception(text: string): string | undefined {
        // Mock simple misconceptions
        if (text.includes("strongest")) return "Strength isn't the only factor - it's about fit with the environment.";
        if (text.includes("want to evolve")) return "Evolution isn't a choice - it happens over generations based on survival.";
        return undefined;
    }
}

export const adaptiveService = new SimulatedAdaptiveService();
