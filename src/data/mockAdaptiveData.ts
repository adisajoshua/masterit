
import { AdaptiveConcept, AdaptiveSession } from '../types/adaptive';

export const mockAdaptiveConcepts: AdaptiveConcept[] = [
    {
        id: "natural-selection-adaptive",
        title: "Natural Selection",
        source_text_snippet: "Evolution is the process of change... proposed the theory of natural selection... organisms with traits better suited to their environment tend to survive and reproduce more successfully.",
        core_statements: [
            "Natural selection is the process where organisms with advantageous traits are more likely to survive and reproduce.",
            "Over generations, this leads to the accumulation of beneficial traits within a population.",
            "The environment acts as the selective pressure driving this change."
        ],
        estimated_difficulty: "intermediate",
        parsing_confidence: "high",
        sub_concepts: [
            { id: "sc_variation", title: "Genetic Variation", completed: true, difficulty: "basic" },
            { id: "sc_selection", title: "Selective Pressure", completed: false, difficulty: "intermediate" },
            { id: "sc_adaptation", title: "Adaptation", completed: false, difficulty: "advanced" },
            { id: "sc_inheritance", title: "Heritability", completed: false, difficulty: "intermediate" }
        ],
        diagnostic_prompt: "Thinking about how nature 'selects' traits, what is the most important thing to understand about how this process works?",
        question_pools: {
            connection: {
                basic: {
                    id: "q_conn_basic_1",
                    text: "In your own words, how is natural selection similar to a filter?",
                    type: "connection",
                    difficulty: "basic",
                    target_statements: [0, 2],
                    cognitive_level: "understand",
                    expected_response_characteristics: {
                        length_range: [15, 30],
                        key_terms: ["filter", "traits", "survive", "environment"]
                    },
                    remediation: {
                        hint: "Think about what a filter does - it keeps some things and lets others pass through. In nature, what 'passes through' to the next generation?",
                        simplified_text: "Imagine nature is like a sieve. How does it decide which animals survive?",
                        example_answer: "Natural selection is like a filter because the environment 'filters out' animals with bad traits, so only the ones with good traits survive and reproduce."
                    }
                },
                intermediate: {
                    id: "q_conn_int_1",
                    text: "Explain the causal link between an organism's traits and its reproductive success in a specific environment.",
                    type: "connection",
                    difficulty: "intermediate",
                    target_statements: [0, 1],
                    cognitive_level: "analyze",
                    expected_response_characteristics: {
                        length_range: [30, 60],
                        key_terms: ["advantageous", "reproduce", "offspring", "generations"]
                    },
                    remediation: {
                        hint: "Focus on 'advantage'. If a trait helps an animal survive longer, what does that mean for its ability to have babies?",
                        simplified_text: "How does having a helpful trait (like sharp claws) actually lead to having more babies?",
                        example_answer: "If an organism has a helpful trait for its environment, it lives longer and is healthier. This means it has more time and energy to reproduce, passing that trait on."
                    }
                },
                advanced: {
                    id: "q_conn_adv_1",
                    text: "Critique the phrase 'survival of the fittest' based on your understanding of natural selection. What nuance does it miss?",
                    type: "connection",
                    difficulty: "advanced",
                    target_statements: [0, 1, 2],
                    cognitive_level: "evaluate",
                    expected_response_characteristics: {
                        length_range: [50, 100],
                        key_terms: ["reproduction", "context", "environment", "population"]
                    },
                    remediation: {
                        hint: "Survival is only half the battle. If a 'fit' animal survives but doesn't have offspring, did it win the evolutionary game?",
                        simplified_text: "Why is 'survival of the fittest' not completely accurate? What is more important than just surviving?",
                        example_answer: "The phrase is misleading because evolution isn't just about being strong or surviving. It's about reproduction. A 'fit' animal that doesn't reproduce contributes nothing to the next generation."
                    }
                }
            },
            application: {
                basic: {
                    id: "q_app_basic_1",
                    text: "Imagine a population of beetles where some are green and some are brown. If birds can see the green ones more easily on brown bark, what will happen to the population over time?",
                    type: "application",
                    difficulty: "basic",
                    target_statements: [0, 2],
                    cognitive_level: "apply",
                    expected_response_characteristics: {
                        length_range: [20, 40],
                        key_terms: ["brown", "survive", "more common", "green eaten"]
                    },
                    remediation: {
                        hint: "If the green beetles get eaten, they can't have babies. Who is left to have babies?",
                        simplified_text: "Birds eat the green beetles because they stand out. What color will most beetles be in the future?",
                        example_answer: "Since the birds eat the green beetles, mostly brown beetles will survive. They will have brown beetle babies, so the population will become mostly brown."
                    }
                },
                intermediate: {
                    id: "q_app_int_1",
                    text: "A new predator is introduced that hunts only at night. How might this environmental change affect the traits of a prey population over several generations?",
                    type: "application",
                    difficulty: "intermediate",
                    target_statements: [1, 2],
                    cognitive_level: "apply",
                    expected_response_characteristics: {
                        length_range: [40, 70],
                        key_terms: ["night vision", "camouflage", "behavior", "selection pressure"]
                    },
                    remediation: {
                        hint: "The environment changed (night danger). What traits would help an animal survive in the dark?",
                        simplified_text: "A predator now hunts at night. What changes might we see in the prey animals after many years?",
                        example_answer: "The prey might evolve better night vision, darker colors for camouflage at night, or they might start sleeping at night and being active during the day to avoid the predator."
                    }
                },
                advanced: {
                    id: "q_app_adv_1",
                    text: "Consider a species that reproduces asexually versus one that reproduces sexually. Evaluate how natural selection would operate differently on these two populations during a rapid environmental change.",
                    type: "application",
                    difficulty: "advanced",
                    target_statements: [1, 2],
                    cognitive_level: "evaluate",
                    expected_response_characteristics: {
                        length_range: [60, 120],
                        key_terms: ["variation", "adaptation rate", "mutation", "risk"]
                    },
                    remediation: {
                        hint: "Think about genetic variation. Sexual reproduction mixes genes (creating variety). Asexual creates clones. Which group can adapt faster?",
                        simplified_text: "Which group can change faster to survive a new danger: clones (asexual) or mixed-gene families (sexual)? Why?",
                        example_answer: "Sexual reproduction creates more variation, so there's a higher chance some individuals will have the right traits to survive the change. Asexual populations are clones, so if one is vulnerable, they all might be."
                    }
                }
            }
        },
        metadata: {
            text_complexity_score: 0.6,
            concept_density: 0.7,
            subject_area: "science"
        }
    }
];

export const mockAdaptiveSession: AdaptiveSession = {
    id: "session-adaptive-001",
    original_text: "EVOLUTION: THEORY AND EVIDENCE...",
    concepts: mockAdaptiveConcepts,
    created_at: new Date().toISOString()
};
