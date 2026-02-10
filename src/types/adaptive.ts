
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';
export type QuestionType = 'diagnostic' | 'connection' | 'application';

export interface AdaptiveQuestion {
    id: string;
    text: string;
    type: QuestionType;
    difficulty: DifficultyLevel;
    target_statements: number[]; // Indices of core statements this question targets
    cognitive_level: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
    expected_response_characteristics?: {
        length_range: [number, number]; // [min, max] words
        key_terms: string[];
    };
    remediation?: {
        hint: string;
        simplified_text?: string;
        example_answer?: string;
    };
}

export interface QuestionPools {
    connection: Record<DifficultyLevel, AdaptiveQuestion>;
    application: Record<DifficultyLevel, AdaptiveQuestion>;
}

export interface AdaptiveConcept {
    id: string;
    title: string;
    source_text_snippet: string;
    core_statements: string[];
    question_pools: QuestionPools;
    diagnostic_prompt: string;
    estimated_difficulty: DifficultyLevel;
    parsing_confidence: 'high' | 'medium' | 'low';
    sub_concepts?: {
        id: string;
        title: string;
        completed: boolean;
        difficulty?: DifficultyLevel;
    }[];
    metadata?: {
        text_complexity_score: number;
        concept_density: number;
        subject_area: string;
    };
    // UI Support Fields
    mastery?: number; // 0-100
    snippet?: string; // Legacy support or short summary
}

export interface AdaptiveSession {
    id: string;
    original_text: string;
    concepts: AdaptiveConcept[];
    created_at: string;
    trajectory?: {
        startDifficulty: DifficultyLevel;
        endDifficulty: DifficultyLevel;
        path: DifficultyLevel[]; // e.g. ['basic', 'basic', 'intermediate']
    };
    metrics?: {
        coverage: number; // 0-100
        consistency: number; // 0-100
        depth: number; // 0-100
    };
}
