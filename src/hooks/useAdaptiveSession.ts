
import { useState, useCallback, useEffect } from 'react';
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

    const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(() =>
        (localStorage.getItem(`session_diff_${concept.id}`) as DifficultyLevel) || 'intermediate'
    );
    const [questionType, setQuestionType] = useState<QuestionType>(() =>
        (localStorage.getItem(`session_type_${concept.id}`) as QuestionType) || 'diagnostic'
    );
    const [questionIndex, setQuestionIndex] = useState(() =>
        Number(localStorage.getItem(`session_index_${concept.id}`)) || 0
    );
    const [history, setHistory] = useState<{ question: string, answer: string, score: number, type: string, difficulty: string }[]>(() => {
        const saved = localStorage.getItem(`session_history_${concept.id}`);
        return saved ? JSON.parse(saved) : [];
    });
    const [adaptationMessage, setAdaptationMessage] = useState<{ type: string; reason: string; from?: DifficultyLevel; to?: DifficultyLevel } | null>(null);
    const { setCurrentCycleSummary, addXP, markConceptComplete } = useApp();

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem(`session_diff_${concept.id}`, currentDifficulty);
        localStorage.setItem(`session_type_${concept.id}`, questionType);
        localStorage.setItem(`session_index_${concept.id}`, questionIndex.toString());
        localStorage.setItem(`session_history_${concept.id}`, JSON.stringify(history));
    }, [currentDifficulty, questionType, questionIndex, history, concept.id]);

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
        const poolType = type === 'connection' ? 'connection' : 'application';
        const pool = concept.question_pools[poolType];

        // Safety Fallback: Use requested difficulty, but fallback to any available question if missing
        const question = pool[difficulty] || Object.values(pool).find(q => q);

        if (question) return question;

        // Emergency Fallback: If the pool is totally empty, return the diagnostic prompt again as a placeholder
        return {
            id: 'emergency_fallback',
            text: `Let's dive deeper into ${concept.title}. Can you explain more about the most important parts as you see them?`,
            type: 'diagnostic',
            difficulty: 'intermediate',
            target_statements: [],
            cognitive_level: 'analyze'
        };
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
                        ? "Okay, I think I'm starting to get the basics. Could we keep it simple for now so I don't get mixed up?"
                        : "Whoa, I think I'm actually following this really well! Do you want to try some of the tricky stuff now?",
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
                questionText: currentQuestion.text,
                coreStatements: concept.core_statements,
                targetStatements: currentQuestion.target_statements.map(idx => concept.core_statements[idx])
            });

            const score = analysisResult.score;

            if (questionType === 'connection') {
                nextType = 'application';

                if (score === 1 && currentDifficulty !== 'basic') {
                    nextDifficulty = 'basic';
                    adaptation = {
                        type: 'difficulty_decrease',
                        reason: "Wait, I'm a bit lost with those big ideas. Could we go back to the basic concepts first? It would really help me catch up!",
                        from: currentDifficulty,
                        to: 'basic'
                    };
                } else if (score === 3 && currentDifficulty !== 'advanced') {
                    nextDifficulty = 'advanced';
                    adaptation = {
                        type: 'difficulty_increase',
                        reason: "Whoa, that's getting really clear! I think I'm ready to try a tougher challenge if you want to push me!",
                        from: currentDifficulty,
                        to: 'advanced'
                    };
                }
            } else { // Application
                // PRIORITY 2: Holistic Analysis Algorithm (30/40/30)
                const finalHistory = [...history, {
                    question: currentQuestion.text,
                    answer,
                    score,
                    type: questionType,
                    difficulty: currentDifficulty
                }];

                const coveredIndices = new Set(finalHistory.flatMap(h => h.score >= 2 ? currentQuestion.target_statements : []));
                const coverageScore = concept.core_statements.length > 0 ? (coveredIndices.size / concept.core_statements.length) : 1;
                const scores = finalHistory.map(h => h.score);
                const consistencyScore = 1 - (Math.max(...scores) - Math.min(...scores)) / 3;
                const depthScore = Math.max(...scores) / 3;
                const finalConfidence = (coverageScore * 0.3 + consistencyScore * 0.4 + depthScore * 0.3) * 100;

                setCurrentCycleSummary({
                    conceptId: concept.id,
                    confidenceScore: Math.round(finalConfidence),
                    masteryLevel: finalConfidence > 80 ? 'Strong' : finalConfidence > 50 ? 'Developing' : 'Starting',
                    history: finalHistory.map((h, i) => ({
                        id: i.toString(),
                        question: h.question,
                        userAnswer: h.answer,
                        aiFeedback: "Great teaching session!",
                        status: h.score === 3 ? 'correct' : h.score === 2 ? 'partial' : 'incorrect',
                        score: h.score / 3
                    })),
                    metrics: {
                        coverage: Math.round(coverageScore * 100),
                        consistency: Math.round(consistencyScore * 100),
                        depth: Math.round(depthScore * 100)
                    },
                    trajectory: {
                        startDifficulty: 'intermediate',
                        endDifficulty: currentDifficulty,
                        path: finalHistory.map(h => h.difficulty as DifficultyLevel)
                    }
                });

                markConceptComplete(concept.id);
                return { isComplete: true, finalScore: finalConfidence };
            }
        }

        const newHistory = [...history, {
            question: currentQuestion.text,
            answer,
            score: analysisResult?.score || 2,
            type: questionType,
            difficulty: currentDifficulty
        }];
        setHistory(newHistory);

        setAdaptationMessage(adaptation);
        setCurrentDifficulty(nextDifficulty);
        setQuestionType(nextType);
        setCurrentQuestion(getNextQuestion(nextType, nextDifficulty));
        setQuestionIndex(prev => prev + 1);

        return { isComplete: false };
    }, [currentDifficulty, questionType, concept, currentQuestion, history, setCurrentCycleSummary, markConceptComplete]);

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
