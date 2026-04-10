/**
 * useAdaptiveSession.ts
 * Purpose: Core teaching session state machine. Manages the Diagnostic → Connection → Application
 *          flow with real-time difficulty adaptation based on AI evaluation.
 *
 * Features:
 *  - Drives the 3-phase adaptive cycle (Diagnostic → Connection → Application)
 *  - Captures AI persona feedback for display between questions
 *  - Persists session state to localStorage for resilience
 *  - Calculates holistic confidence score (30/40/30 weighting)
 *  - Cleans up session keys on completion
 *
 * Dependencies: AppContext, RealAdaptiveService / SimulatedAdaptiveService, adaptive types.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { AdaptiveConcept, AdaptiveQuestion, DifficultyLevel, QuestionType } from '../types/adaptive';
import { mockAdaptiveConcepts } from '../data/mockAdaptiveData';
import { adaptiveService as simulatedService } from '@/services/ai/SimulatedAdaptiveService';
import { RealAdaptiveService, USE_REAL_AI } from '@/services/ai/RealAdaptiveService';
import { useApp } from "@/context/AppContext";

// Select the service based on the Feature Flag
const adaptiveService = USE_REAL_AI ? RealAdaptiveService : simulatedService;

/** Session storage key helpers */
const sessionKey = (conceptId: string, suffix: string) => `session_${suffix}_${conceptId}`;

/** Clean up all per-concept session keys */
export function clearConceptSession(conceptId: string) {
    localStorage.removeItem(sessionKey(conceptId, 'diff'));
    localStorage.removeItem(sessionKey(conceptId, 'type'));
    localStorage.removeItem(sessionKey(conceptId, 'index'));
    localStorage.removeItem(sessionKey(conceptId, 'history'));
    localStorage.removeItem(sessionKey(conceptId, 'startDiff'));
}

export interface SessionHistoryEntry {
    question: string;
    answer: string;
    score: number;
    type: string;
    difficulty: string;
    target_statements: number[];
    aiFeedback: string; // BUG 1 FIX: Store AI persona feedback
}

export function useAdaptiveSession(conceptId: string = 'natural-selection-adaptive') {
    const { concepts } = useApp();

    // BUG 11 FIX: Derive concept from concepts array reactively (useMemo, not useState)
    const concept = useMemo(() =>
        concepts.find(c => c.id === conceptId) ||
        mockAdaptiveConcepts.find(c => c.id === conceptId) ||
        mockAdaptiveConcepts[0],
        [concepts, conceptId]
    );

    const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(() =>
        (localStorage.getItem(sessionKey(concept.id, 'diff')) as DifficultyLevel) || 'intermediate'
    );
    const [questionType, setQuestionType] = useState<QuestionType>(() =>
        (localStorage.getItem(sessionKey(concept.id, 'type')) as QuestionType) || 'diagnostic'
    );
    const [questionIndex, setQuestionIndex] = useState(() =>
        Number(localStorage.getItem(sessionKey(concept.id, 'index'))) || 0
    );
    const [history, setHistory] = useState<SessionHistoryEntry[]>(() => {
        const saved = localStorage.getItem(sessionKey(concept.id, 'history'));
        return saved ? JSON.parse(saved) : [];
    });

    // STRUCT 6 FIX: Track actual start difficulty
    const [startDifficulty, setStartDifficulty] = useState<DifficultyLevel>(() =>
        (localStorage.getItem(sessionKey(concept.id, 'startDiff')) as DifficultyLevel) || 'intermediate'
    );

    const [adaptationMessage, setAdaptationMessage] = useState<{
        type: string;
        reason: string;
        from?: DifficultyLevel;
        to?: DifficultyLevel;
    } | null>(null);

    // BUG 12 FIX: Store latest AI feedback for display between questions
    const [latestFeedback, setLatestFeedback] = useState<string | null>(null);

    const [startTime] = useState(Date.now());
    const { setCurrentCycleSummary, addXP, markConceptComplete, updateConceptMastery } = useApp();

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem(sessionKey(concept.id, 'diff'), currentDifficulty);
        localStorage.setItem(sessionKey(concept.id, 'type'), questionType);
        localStorage.setItem(sessionKey(concept.id, 'index'), questionIndex.toString());
        localStorage.setItem(sessionKey(concept.id, 'history'), JSON.stringify(history));
        localStorage.setItem(sessionKey(concept.id, 'startDiff'), startDifficulty);
    }, [currentDifficulty, questionType, questionIndex, history, concept.id, startDifficulty]);

    // Helper to get next question based on current state
    const getNextQuestion = useCallback((type: QuestionType, difficulty: DifficultyLevel): AdaptiveQuestion => {
        if (type === 'diagnostic') {
            return {
                id: 'diagnostic',
                text: concept.diagnostic_prompt,
                type: 'diagnostic',
                difficulty: 'intermediate',
                target_statements: [],
                cognitive_level: 'analyze',
                remediation: {
                    hint: "Don't worry about being perfect! I just want to hear how you'd explain the main idea in your own words so I can start learning.",
                    simplified_text: "Could you just give me the 'big picture' version of what this topic is all about?",
                    example_answer: "You could say something like: 'The most important thing to know is that nature has a way of picking which traits help animals survive better.'"
                }
            };
        }

        const poolType = type === 'connection' ? 'connection' : 'application';
        const pool = concept.question_pools?.[poolType];

        if (pool) {
            const question = pool[difficulty] || Object.values(pool).find(q => q);
            if (question) return question;
        }

        return {
            id: 'emergency_fallback',
            text: `I'm still trying to piece this all together. Could you explain a bit more about how the different parts of ${concept.title} actually work together? I feel like I'm missing a piece of the puzzle.`,
            type: 'diagnostic',
            difficulty: 'intermediate',
            target_statements: [],
            cognitive_level: 'analyze'
        };
    }, [concept]);

    const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion>(() =>
        getNextQuestion('diagnostic', 'intermediate')
    );

    const submitAnswer = useCallback(async (answer: string) => {
        let nextDifficulty = currentDifficulty;
        let nextType = questionType;
        let adaptation = null;
        let analysisResult: any = null;
        let feedbackText = '';

        if (questionType === 'diagnostic') {
            // AI-driven Diagnostic Analysis
            analysisResult = await adaptiveService.analyzeDiagnostic(answer, concept.id, concept);
            feedbackText = analysisResult.feedback || '';

            // Set initial difficulty based on analysis
            nextType = 'connection';
            nextDifficulty = (analysisResult.recommendedDifficulty as DifficultyLevel) || 'intermediate';

            // STRUCT 6 FIX: Track the actual start difficulty
            setStartDifficulty(nextDifficulty);

            // Generate adaptation message
            if (nextDifficulty !== 'intermediate') {
                adaptation = {
                    type: nextDifficulty === 'basic' ? 'difficulty_decrease' : 'difficulty_increase',
                    reason: nextDifficulty === 'basic'
                        ? "I'm still trying to wrap my head around the core ideas here. Could we keep focusing on the fundamental parts for a bit longer?"
                        : "That makes so much sense! I think I'm starting to see the bigger picture—could we explore some of the more complex connections now?",
                    from: 'intermediate' as DifficultyLevel,
                    to: nextDifficulty
                };
            }

        } else if (questionType === 'connection' || questionType === 'application') {
            // AI-driven Response Analysis
            // BUG 6 FIX: Send proper context for evaluation
            const targetStmts = currentQuestion.target_statements
                .map(idx => concept.core_statements[idx])
                .filter(Boolean); // Filter out undefined values

            analysisResult = await adaptiveService.analyzeResponse({
                sessionId: 'sim-session',
                conceptId: concept.id,
                response: answer,
                questionType,
                currentDifficulty,
                questionText: currentQuestion.text,
                coreStatements: concept.core_statements,
                targetStatements: targetStmts
            });

            feedbackText = analysisResult.feedback || '';
            const score = analysisResult.score;

            if (score === 0) {
                // Gibberish / Nonsense Detected
                const confusionFeedback = "Wait, I'm really sorry, but I'm super confused! I didn't quite catch what you meant there. Could you try explaining that again, maybe in a different way so I can follow along?";
                setAdaptationMessage({
                    type: 'confusion',
                    reason: confusionFeedback,
                    from: currentDifficulty,
                    to: currentDifficulty
                });
                setLatestFeedback(confusionFeedback);
                return { isComplete: false, score: 0, feedback: confusionFeedback };
            }

            if (questionType === 'connection') {
                nextType = 'application';

                if (score === 1 && currentDifficulty !== 'basic') {
                    nextDifficulty = 'basic';
                    adaptation = {
                        type: 'difficulty_decrease',
                        reason: "Wait, I think I'm getting a bit lost in the details. Could we go back and look at how the basic process works again? I want to make sure I really 'get' it before we move on.",
                        from: currentDifficulty,
                        to: 'basic' as DifficultyLevel
                    };
                } else if (score === 3 && currentDifficulty !== 'advanced') {
                    nextDifficulty = 'advanced';
                    adaptation = {
                        type: 'difficulty_increase',
                        reason: "Oh, that's a really clear explanation! I think I'm ready to tackle some of the deeper implications of this if you're up for it!",
                        from: currentDifficulty,
                        to: 'advanced' as DifficultyLevel
                    };
                }
            } else {
                // Application phase — finalize session
                // BUG 1 FIX: Capture actual AI feedback in history
                const finalHistory: SessionHistoryEntry[] = [...history, {
                    question: currentQuestion.text,
                    answer,
                    score,
                    type: questionType,
                    difficulty: currentDifficulty,
                    target_statements: currentQuestion.target_statements,
                    aiFeedback: feedbackText
                }];

                const durationMs = Date.now() - startTime;
                const minutes = Math.floor(durationMs / 60000);
                const seconds = Math.floor((durationMs % 60000) / 1000);
                const timeSpent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                // BUG 9 FIX: Use each history entry's own target_statements, not currentQuestion's
                const coveredIndices = new Set(
                    finalHistory.flatMap(h => h.score >= 2 ? h.target_statements : [])
                );
                const coverageScore = concept.core_statements.length > 0
                    ? (coveredIndices.size / concept.core_statements.length)
                    : 1;
                const scores = finalHistory.map(h => h.score);
                const maxScore = Math.max(...scores);
                const minScore = Math.min(...scores);
                const consistencyScore = maxScore > 0 ? 1 - (maxScore - minScore) / 3 : 0;
                const depthScore = maxScore / 3;
                const finalConfidence = (coverageScore * 0.3 + consistencyScore * 0.4 + depthScore * 0.3) * 100;

                // BUG 1 FIX: Use actual AI feedback in the CycleSummary history
                const cycleSummary = {
                    conceptId: concept.id,
                    confidenceScore: Math.round(finalConfidence),
                    masteryLevel: finalConfidence > 80 ? 'Strong' : finalConfidence > 50 ? 'Developing' : 'Starting',
                    history: finalHistory.map((h, i) => ({
                        id: i.toString(),
                        question: h.question,
                        userAnswer: h.answer,
                        aiFeedback: h.aiFeedback || 'Session completed.',
                        status: (h.score === 3 ? 'correct' : h.score === 2 ? 'partial' : 'incorrect') as 'correct' | 'partial' | 'incorrect',
                        score: h.score / 3
                    })),
                    metrics: {
                        coverage: Math.round(coverageScore * 100),
                        consistency: Math.round(consistencyScore * 100),
                        depth: Math.round(depthScore * 100)
                    },
                    trajectory: {
                        startDifficulty: startDifficulty,  // STRUCT 6 FIX: Use actual start
                        endDifficulty: currentDifficulty,
                        path: finalHistory.map(h => h.difficulty)
                    },
                    gapsToReview: concept.core_statements.filter((_, idx) => !coveredIndices.has(idx)),
                    timeSpent
                };

                setCurrentCycleSummary(cycleSummary);
                markConceptComplete(concept.id);
                updateConceptMastery(concept.id, Math.round(finalConfidence));

                // BUG 7 FIX: Clean up session localStorage on completion
                clearConceptSession(concept.id);

                setLatestFeedback(feedbackText);
                return { isComplete: true, finalScore: finalConfidence, feedback: feedbackText, score };
            }
        }

        // BUG 1 FIX: Store AI feedback in history entry
        const newHistory: SessionHistoryEntry[] = [...history, {
            question: currentQuestion.text,
            answer,
            score: analysisResult?.score || 2,
            type: questionType,
            difficulty: currentDifficulty,
            target_statements: currentQuestion.target_statements,
            aiFeedback: feedbackText
        }];
        setHistory(newHistory);

        setAdaptationMessage(adaptation);
        setCurrentDifficulty(nextDifficulty);
        setQuestionType(nextType);
        setCurrentQuestion(getNextQuestion(nextType, nextDifficulty));
        setQuestionIndex(prev => prev + 1);

        // BUG 12 FIX: Expose feedback for display between questions
        setLatestFeedback(feedbackText);

        return { isComplete: false, score: analysisResult?.score || 2, feedback: feedbackText };
    }, [currentDifficulty, questionType, concept, currentQuestion, history, setCurrentCycleSummary, markConceptComplete, startTime, getNextQuestion, startDifficulty, updateConceptMastery]);

    const coveredIndices = Array.from(new Set(history.flatMap(h => h.score >= 2 ? h.target_statements : [])));

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
        coveredIndices,
        // BUG 12 FIX: Expose feedback state for TeachingScreen to display
        latestFeedback,
        clearFeedback: () => setLatestFeedback(null),
        triggerAdaptation: (type: string, reason: string) => {
            setAdaptationMessage({ type, reason, from: currentDifficulty, to: currentDifficulty });
        }
    };
}
