
import { DifficultyLevel, QuestionType } from "@/types/adaptive";

export interface AnalysisRequest {
    sessionId: string;
    conceptId: string;
    response: string;
    questionType: QuestionType;
    currentDifficulty: DifficultyLevel;
    // Context for accurate grading
    targetStatements?: string[];
    expectedKeyTerms?: string[];
}

export interface AnalysisResult {
    score: number; // 1-3 (Low, Medium, High) or 1-10 (Diagnostic)
    feedback: string;
    recommendedDifficulty?: DifficultyLevel;
    misconception?: string;
    nextQuestionType?: QuestionType;
    // For holistic tracking
    analysisDetails: {
        keyTermsUsed: string[];
        conceptCoverage: number; // 0-1
        complexityScore: number; // 0-1
    };
}

export interface IAdaptiveService {
    analyzeDiagnostic(response: string, conceptId: string): Promise<AnalysisResult>;
    analyzeResponse(request: AnalysisRequest): Promise<AnalysisResult>;
    generateSummary(history: any[]): Promise<any>;
}
