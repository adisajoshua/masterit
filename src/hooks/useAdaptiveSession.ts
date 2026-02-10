
import { useState, useCallback } from 'react';
import { AdaptiveConcept, AdaptiveQuestion, DifficultyLevel, QuestionType } from '../types/adaptive';
import { mockAdaptiveConcepts } from '../data/mockAdaptiveData';
import { adaptiveService as simulatedService } from '@/services/ai/SimulatedAdaptiveService';
import { RealAdaptiveService, USE_REAL_AI } from '@/services/ai/RealAdaptiveService';
import { useApp } from "@/context/AppContext";

// Select the service based on the Feature Flag
const adaptiveService = USE_REAL_AI ? RealAdaptiveService : simulatedService;

export interface AdaptiveState {
    currentConcept: AdaptiveConcept;
    currentQuestion: AdaptiveQuestion;
    currentDifficulty: DifficultyLevel;
    questionHistory: AdaptiveQuestion[];
    adaptationHistory: { from: DifficultyLevel; to: DifficultyLevel; reason: string }[];
    isRecovering: boolean;
    progress: number;
}

export function useAdaptiveSession(conceptId: string = 'natural-selection-adaptive') {
    const { concepts } = useApp();

    // Find concept in Context (Real AI data) OR fallback to Mock Data
    const [concept] = useState<AdaptiveConcept>(() =>
        concepts.find(c => c.id === conceptId) || mockAdaptiveConcepts.find(c => c.id === conceptId) || mockAdaptiveConcepts[0]
    );

    const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('intermediate');
    const [questionType, setQuestionType] = useState<QuestionType>('diagnostic');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [adaptationMessage, setAdaptationMessage] = useState<{ type: string; reason: string; from?: DifficultyLevel; to?: DifficultyLevel } | null>(null);

    // Helper to get next question based on current state
    const getNextQuestion = (type: QuestionType, difficulty: DifficultyLevel): AdaptiveQuestion => {
        if (type === 'diagnostic') {
            return {
                id: 'diagnostic',
                text: concept.diagnostic_prompt,
                type: 'diagnostic',
                difficulty: 'intermediate', // Diagnostic is neutral/open
                target_statements: [],
                cognitive_level: 'analyze',
                remediation: {
                    hint: "There's no right or wrong answer here. Just tell me what stands out to you most about this topic.",
                    simplified_text: "In simple terms, what is the main idea of this topic?",
                    example_answer: "For example, you could say: 'The most important thing is that nature selects the strongest animals.'"
                }
            };
        }

        // HYBRID: If using Real AI, we might want to ask the service for a question from the pool
        // But for minimal friction, we can keep using the local pool logic here IF RealAdaptiveService 
        // doesn't override it. 
        // Actually, RealAdaptiveService has `generateNextQuestion` as well.
        // Let's use the local logic here for simplicity unless we refactor completely.
        const pool = concept.question_pools[type === 'connection' ? 'connection' : 'application'];
        return pool[difficulty];
    };

    const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion>(() =>
        getNextQuestion('diagnostic', 'intermediate')
    );

    const submitAnswer = useCallback(async (answer: string) => {
        let nextDifficulty = currentDifficulty;
        let nextType = questionType;
        let adaptation = null;
        let analysisResult = null;

        if (questionType === 'diagnostic') {
            // New AI-driven Diagnostic Analysis
            analysisResult = await adaptiveService.analyzeDiagnostic(answer, concept.id);

            // Set initial difficulty based on analysis
            nextType = 'connection';
            // Default to intermediate if no recommendation
            nextDifficulty = (analysisResult.recommendedDifficulty as DifficultyLevel) || 'intermediate';

            // Generate adaptation message
            if (nextDifficulty !== 'intermediate') {
                adaptation = {
                    type: nextDifficulty === 'basic' ? 'difficulty_decrease' : 'difficulty_increase',
                    reason: nextDifficulty === 'basic'
                        ? "Starting with foundational concepts based on your explanation."
                        : "Strong start! Jumping straight to advanced connections.",
                    from: 'intermediate',
                    to: nextDifficulty
                };
            }

        } else if (questionType === 'connection' || questionType === 'application') {
            // New AI-driven Response Analysis
            analysisResult = await adaptiveService.analyzeResponse({
                sessionId: 'sim-session',
                conceptId: concept.id,
                response: answer,
                questionType,
                currentDifficulty,
                expectedKeyTerms: currentQuestion.expected_response_characteristics?.key_terms
            });

            // Logic to determine next step based on score (1-3)
            const score = analysisResult.score;

            if (questionType === 'connection') {
                nextType = 'application';

                // Adaptive Logic from Spec:
                // Score 1 -> Decrease Difficulty (if possible)
                // Score 2 -> Maintain Difficulty
                // Score 3 -> Increase Difficulty (if possible)
                if (score === 1 && currentDifficulty !== 'basic') {
                    nextDifficulty = 'basic';
                    adaptation = {
                        type: 'difficulty_decrease',
                        reason: analysisResult.feedback || "Let's review the basics before moving on.",
                        from: currentDifficulty,
                        to: 'basic'
                    };
                } else if (score === 3 && currentDifficulty !== 'advanced') {
                    nextDifficulty = 'advanced';
                    adaptation = {
                        type: 'difficulty_increase',
                        reason: analysisResult.feedback || "Great insight! Let's try a harder application.",
                        from: currentDifficulty,
                        to: 'advanced'
                    };
                }
            } else { // Application
                // Finish session
                return { isComplete: true, finalScore: score };
            }
        }

        setAdaptationMessage(adaptation);
        setCurrentDifficulty(nextDifficulty);
        setQuestionType(nextType);
        setCurrentQuestion(getNextQuestion(nextType, nextDifficulty));
        setQuestionIndex(prev => prev + 1);

        return { isComplete: false };
    }, [currentDifficulty, questionType, concept, currentQuestion]);

    return {
        currentQuestion,
        currentDifficulty,
        questionType,
        submitAnswer,
        adaptationMessage,
        clearAdaptationMessage: () => setAdaptationMessage(null),
        concept,
        conceptTitle: concept.title,
        progress: Math.min((questionIndex / 3) * 100, 100),
        remediationData: currentQuestion.remediation,
        triggerAdaptation: (type: string, reason: string) => {
            setAdaptationMessage({ type, reason, from: currentDifficulty, to: currentDifficulty });
        }
    };
}
