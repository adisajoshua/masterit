// Mock data for the Evolution unit

export const evolutionInputText = `EVOLUTION: THEORY AND EVIDENCE

Evolution is the process of change in all forms of life over generations. Charles Darwin proposed the theory of natural selection, which states that organisms with traits better suited to their environment tend to survive and reproduce more successfully. Over time, this leads to the accumulation of advantageous traits in a population.

KEY EVIDENCE:
1. Fossil records show transitional forms between species
2. Comparative anatomy reveals homologous structures (same origin, different function)
3. Embryological similarities across different species
4. Molecular biology shows DNA sequence similarities
5. Biogeography - distribution of species matches evolutionary history

MECHANISMS OF EVOLUTION:
- Natural Selection: Directional, stabilizing, and disruptive selection
- Genetic Drift: Bottleneck effect and founder effect
- Gene Flow: Movement of genes between populations
- Mutations: Random changes in DNA that provide raw material

CLASSIC EXAMPLE: Peppered moths in England. Before industrialization, light-colored moths were common on lichen-covered trees. After pollution darkened the trees, dark-colored moths had better camouflage and became more common.`;

export interface Question {
  id: string;
  text: string;
  expectedAnswer: string;
}

export interface Concept {
  id: string;
  title: string;
  snippet: string;
  confidence: number;
  mastery: number;
  questions: Question[];
}

export interface CycleSummary {
  masteryPercentage: number;
  xpEarned: number;
  strengths: string[];
  gaps: string[];
}

export const concepts: Concept[] = [
  {
    id: "natural-selection",
    title: "Natural Selection",
    snippet: "Organisms with advantageous traits survive and reproduce more successfully, leading to gradual changes in populations over generations.",
    confidence: 5,
    mastery: 85,
    questions: [
      { id: "q1", text: "What is natural selection in simple terms?", expectedAnswer: "It's when organisms with helpful traits survive better and have more offspring, so those traits become more common over time." },
      { id: "q2", text: "How does this cause species to change?", expectedAnswer: "Over many generations, helpful traits keep getting passed on while harmful ones disappear, so the whole population slowly changes." },
      { id: "q3", text: "Can you give me a real example?", expectedAnswer: "The peppered moths in England - when pollution darkened the trees, dark moths survived better because birds couldn't see them." }
    ]
  },
  {
    id: "evidence-evolution",
    title: "Evidence for Evolution",
    snippet: "Multiple lines of evidence support evolution: fossils, comparative anatomy, embryology, DNA, and biogeography.",
    confidence: 4,
    mastery: 72,
    questions: [
      { id: "q1", text: "What proof do we have that evolution happened?", expectedAnswer: "Fossil records, similar bone structures in different animals, similar embryos, matching DNA sequences, and species distribution patterns." },
      { id: "q2", text: "What are transitional forms?", expectedAnswer: "Fossils that show features of both ancestor and descendant species, like Archaeopteryx with bird feathers but dinosaur teeth." },
      { id: "q3", text: "How does DNA prove evolution?", expectedAnswer: "Closely related species have more similar DNA - humans and chimps share 98% of their DNA." }
    ]
  },
  {
    id: "genetic-drift",
    title: "Genetic Drift",
    snippet: "Random changes in allele frequencies, especially in small populations. Includes bottleneck and founder effects.",
    confidence: 3,
    mastery: 40,
    questions: [
      { id: "q1", text: "What is genetic drift?", expectedAnswer: "Random changes in gene frequencies that aren't based on survival advantage - any trait can increase or decrease by chance." },
      { id: "q2", text: "What is the bottleneck effect?", expectedAnswer: "When a population is drastically reduced, survivors have only a fraction of original genetic diversity." },
      { id: "q3", text: "What is the founder effect?", expectedAnswer: "When a small group starts a new population, they only carry a sample of the original gene pool." }
    ]
  }
];

export const mockCycleSummaries: Record<string, CycleSummary> = {
  "natural-selection": { masteryPercentage: 85, xpEarned: 75, strengths: ["Clear definitions", "Great examples"], gaps: ["Types of selection"] },
  "evidence-evolution": { masteryPercentage: 72, xpEarned: 60, strengths: ["Comprehensive overview"], gaps: ["Homologous structures detail"] },
  "genetic-drift": { masteryPercentage: 40, xpEarned: 30, strengths: ["Basic understanding"], gaps: ["Real-world examples", "Population size impact"] }
};

export const mockSession = {
  sourceText: evolutionInputText,
  concepts,
  sessionStats: { timeSpent: "22:30", questionsAnswered: 9, gapsToReview: ["Genetic drift mechanisms", "Types of selection"] }
};

export const mockAchievements = [
  { id: "first-lesson", title: "First Lesson", description: "Complete your first teaching cycle", xp: 100, icon: "🎓" },
  { id: "clear-teacher", title: "Clear Teacher", description: "Score above 80% on any cycle", xp: 50, icon: "✨" }
];
