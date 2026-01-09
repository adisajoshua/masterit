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

export interface Concept {
  id: string;
  title: string;
  snippet: string;
  confidence: number;
  stars: number;
  source: string;
  estimatedTime: string;
}

export const concepts: Concept[] = [
  {
    id: "EVO-001",
    title: "Natural Selection",
    snippet: "Organisms with advantageous traits survive and reproduce more",
    confidence: 0.95,
    stars: 5,
    source: "Charles Darwin proposed... survive and reproduce more successfully.",
    estimatedTime: "8-10 minutes"
  },
  {
    id: "EVO-002",
    title: "Evidence for Evolution",
    snippet: "Fossils, anatomy, embryology, DNA, biogeography",
    confidence: 0.88,
    stars: 4,
    source: "KEY EVIDENCE: 1. Fossil records... matches evolutionary history",
    estimatedTime: "12-15 minutes"
  },
  {
    id: "EVO-003",
    title: "Genetic Drift",
    snippet: "Random changes in allele frequencies in small populations",
    confidence: 0.75,
    stars: 3,
    source: "Genetic Drift: Bottleneck effect and founder effect",
    estimatedTime: "6-8 minutes"
  }
];

export interface Question {
  id: string;
  conceptId: string;
  text: string;
  expectedAnswer: string;
  aiProcessing: string;
}

export const questions: Record<string, Question[]> = {
  "EVO-001": [
    {
      id: "Q1",
      conceptId: "EVO-001",
      text: "I keep hearing about 'natural selection' but I'm confused. What's the basic idea in simple terms?",
      expectedAnswer: "It's the process where organisms with traits that help them survive in their environment are more likely to live and have offspring. Those helpful traits become more common over time.",
      aiProcessing: "Hmm, so it's like nature 'selecting' the best traits..."
    },
    {
      id: "Q2",
      conceptId: "EVO-001",
      text: "Okay, but how does this actually make species change? Like, what happens over many generations?",
      expectedAnswer: "Because only organisms with helpful traits keep reproducing, those traits get passed on more. After hundreds or thousands of generations, the whole population can look really different.",
      aiProcessing: "So it's a slow filtering process... got it!"
    },
    {
      id: "Q3",
      conceptId: "EVO-001",
      text: "Can you give me a real example? Something with actual evidence?",
      expectedAnswer: "The peppered moths in England are a classic example. When pollution darkened the trees during the industrial revolution, dark moths survived better because birds couldn't see them. Within about 50 years, almost all the moths in polluted areas were dark colored.",
      aiProcessing: "Wow, that's clear evidence! The environment changed what was 'advantageous'..."
    }
  ],
  "EVO-002": [
    {
      id: "Q1",
      conceptId: "EVO-002",
      text: "How do we actually know evolution happened? What's the proof?",
      expectedAnswer: "There are multiple lines of evidence: fossil records show transitional forms, comparative anatomy shows similar bone structures across different species, embryos look similar in early stages, DNA sequences match up between related species, and species distribution around the world matches evolutionary predictions.",
      aiProcessing: "So many different types of evidence all pointing to the same conclusion..."
    },
    {
      id: "Q2",
      conceptId: "EVO-002",
      text: "What are these 'transitional forms' you mentioned? Can you explain?",
      expectedAnswer: "Transitional forms are fossils that show features of both ancestral and descendant groups. Like Archaeopteryx, which had features of both dinosaurs and birds - it had feathers but also teeth and a bony tail.",
      aiProcessing: "Oh, so we can literally see the in-between stages in the fossil record!"
    },
    {
      id: "Q3",
      conceptId: "EVO-002",
      text: "How does DNA evidence work? Why does that prove evolution?",
      expectedAnswer: "When we compare DNA sequences between species, closely related species have more similar DNA. Humans and chimps share about 98% of their DNA. The more distantly related organisms are, the more different their DNA is.",
      aiProcessing: "It's like a family tree written in our genes..."
    }
  ],
  "EVO-003": [
    {
      id: "Q1",
      conceptId: "EVO-003",
      text: "What exactly is genetic drift? How is it different from natural selection?",
      expectedAnswer: "Genetic drift is random changes in allele frequencies, not based on fitness. Unlike natural selection where helpful traits spread, in drift any trait can increase or decrease just by chance. It's especially strong in small populations.",
      aiProcessing: "So it's like luck rather than survival of the fittest..."
    },
    {
      id: "Q2",
      conceptId: "EVO-003",
      text: "Can you explain the bottleneck effect?",
      expectedAnswer: "The bottleneck effect happens when a population is drastically reduced, like by a disaster. The survivors have only a fraction of the original gene pool, so some alleles may be lost completely just by chance.",
      aiProcessing: "Like if only a few survive, their genes become the whole population's genes..."
    },
    {
      id: "Q3",
      conceptId: "EVO-003",
      text: "What about the founder effect? How does that work?",
      expectedAnswer: "The founder effect happens when a small group starts a new population, like colonizing an island. They carry only a sample of the original population's genetic diversity, so the new population has different allele frequencies.",
      aiProcessing: "So the founding group determines the gene pool for everyone after..."
    }
  ]
};

export interface CycleSummary {
  cycleId: string;
  concept: string;
  masteryScore: number;
  xpEarned: number;
  timeSpent: string;
  summaryText: string;
  strengths: {
    title: string;
    description: string;
    sourceSnippet: string;
    timestamp: string;
  }[];
  gaps: {
    title: string;
    description: string;
    sourceSnippet: string;
    suggestion: string;
    priority: "high" | "medium" | "low";
  }[];
  nextRecommendation: string;
}

export const cycleSummaries: Record<string, CycleSummary> = {
  "EVO-001": {
    cycleId: "CYCLE-001",
    concept: "Natural Selection",
    masteryScore: 85,
    xpEarned: 75,
    timeSpent: "4:30",
    summaryText: "Excellent teaching! You clearly explained natural selection's core mechanism and provided a perfect historical example. I now understand how environmental changes drive adaptation over generations.",
    strengths: [
      {
        title: "Clear definition",
        description: "You explained the core concept simply and accurately",
        sourceSnippet: "organisms with traits that help them survive... more likely to live and have offspring",
        timestamp: "Q1, 0:45"
      },
      {
        title: "Great example usage",
        description: "The peppered moth example was perfectly chosen and explained",
        sourceSnippet: "peppered moths in England... dark moths survived better",
        timestamp: "Q3, 2:10"
      }
    ],
    gaps: [
      {
        title: "Types of selection",
        description: "We didn't cover the different patterns of natural selection",
        sourceSnippet: "Natural Selection: Directional, stabilizing, and disruptive selection",
        suggestion: "Could you explain the difference between directional and stabilizing selection?",
        priority: "medium"
      },
      {
        title: "Genetic drift distinction",
        description: "The difference between natural selection and genetic drift",
        sourceSnippet: "Genetic Drift: Bottleneck effect and founder effect",
        suggestion: "How is genetic drift different from natural selection?",
        priority: "low"
      }
    ],
    nextRecommendation: "Deeper dive into selection types"
  },
  "EVO-002": {
    cycleId: "CYCLE-002",
    concept: "Evidence for Evolution",
    masteryScore: 72,
    xpEarned: 60,
    timeSpent: "5:15",
    summaryText: "Good overview of the evidence! You covered the main categories well. DNA evidence explanation was particularly strong.",
    strengths: [
      {
        title: "Comprehensive overview",
        description: "You covered multiple evidence types",
        sourceSnippet: "fossil records, comparative anatomy, embryology, DNA",
        timestamp: "Q1, 1:00"
      }
    ],
    gaps: [
      {
        title: "Homologous structures",
        description: "Could go deeper on comparative anatomy",
        sourceSnippet: "Comparative anatomy reveals homologous structures",
        suggestion: "Can you give examples of homologous structures?",
        priority: "medium"
      }
    ],
    nextRecommendation: "Deep dive on fossil evidence"
  },
  "EVO-003": {
    cycleId: "CYCLE-003",
    concept: "Genetic Drift",
    masteryScore: 40,
    xpEarned: 30,
    timeSpent: "3:25",
    summaryText: "We started exploring genetic drift but there's more to cover. The distinction from natural selection needs clarification.",
    strengths: [
      {
        title: "Basic understanding",
        description: "You grasped the random nature of drift",
        sourceSnippet: "random changes... not based on fitness",
        timestamp: "Q1, 0:30"
      }
    ],
    gaps: [
      {
        title: "Bottleneck examples",
        description: "Need concrete examples of bottleneck effect",
        sourceSnippet: "Bottleneck effect and founder effect",
        suggestion: "Can you give a real-world example of bottleneck effect?",
        priority: "high"
      },
      {
        title: "Mathematical basis",
        description: "Population size impact not fully covered",
        sourceSnippet: "especially strong in small populations",
        suggestion: "Why does population size matter for drift?",
        priority: "high"
      }
    ],
    nextRecommendation: "Review genetic drift fundamentals"
  }
};

export interface SessionReview {
  sessionId: string;
  studentName: string;
  date: string;
  totalTime: string;
  overallMastery: number;
  totalXpEarned: number;
  conceptsCovered: {
    name: string;
    cyclesCompleted: number;
    masteryScore: number;
    timeSpent: string;
  }[];
  achievementsEarned: {
    id: string;
    name: string;
    description: string;
    xpValue: number;
    icon: string;
  }[];
  gapsToReview: string[];
  streakStatus: {
    currentStreak: number;
    longestStreak: number;
    nextMilestone: number;
  };
}

export const sessionReview: SessionReview = {
  sessionId: "SESS-2025-001",
  studentName: "Alex",
  date: "2025-01-08",
  totalTime: "22:30",
  overallMastery: 78,
  totalXpEarned: 225,
  conceptsCovered: [
    {
      name: "Natural Selection",
      cyclesCompleted: 1,
      masteryScore: 85,
      timeSpent: "8:45"
    },
    {
      name: "Evidence for Evolution",
      cyclesCompleted: 1,
      masteryScore: 72,
      timeSpent: "10:20"
    },
    {
      name: "Genetic Drift",
      cyclesCompleted: 1,
      masteryScore: 40,
      timeSpent: "3:25"
    }
  ],
  achievementsEarned: [
    {
      id: "ACH-001",
      name: "First Lesson",
      description: "Complete your first teaching cycle",
      xpValue: 100,
      icon: "🎓"
    },
    {
      id: "ACH-002",
      name: "Clear Teacher",
      description: "Score above 80% on any cycle",
      xpValue: 50,
      icon: "✨"
    }
  ],
  gapsToReview: [
    "Genetic drift mechanisms",
    "Types of natural selection",
    "Molecular evidence specifics"
  ],
  streakStatus: {
    currentStreak: 1,
    longestStreak: 1,
    nextMilestone: 3
  }
};

export const mockAnswers: Record<string, string[]> = {
  "EVO-001": [
    "Natural selection is when organisms with traits that help them survive are more likely to live and have babies. Over time, those helpful traits become more common in the population because they keep getting passed down.",
    "Over many generations, only the organisms with helpful traits keep reproducing. Their traits get passed on more and more. After hundreds of generations, the whole population ends up looking really different from where it started.",
    "The peppered moths in England are a great example! Before factories polluted the air, light-colored moths blended in with the lichen on trees. But when pollution made the trees dark, the dark moths could hide better from birds. So over about 50 years, almost all the moths became dark colored."
  ],
  "EVO-002": [
    "We know evolution happened because we have so much evidence from different sources. Fossil records show species changing over time with transitional forms. Comparative anatomy shows similar bone structures in different animals. Embryos of different species look similar early on. DNA comparison shows related species have similar sequences. And the distribution of species around the world matches what evolution predicts.",
    "Transitional forms are fossils that show features of both an ancestor species and its descendants. Like Archaeopteryx - it had feathers like birds but also had teeth and a bony tail like dinosaurs. It's literally caught in the middle of the transition!",
    "DNA evidence works because all living things use the same genetic code. When we compare DNA sequences, closely related species have more similar DNA - like humans and chimps share about 98% of our DNA. The more distantly related two species are, the more different their DNA sequences are."
  ],
  "EVO-003": [
    "Genetic drift is when allele frequencies change randomly, not because of natural selection. Unlike natural selection where helpful traits spread because they help survival, in genetic drift any trait can become more or less common just by random chance. It's especially powerful in small populations where random events have bigger effects.",
    "The bottleneck effect happens when a population gets drastically reduced, like from a natural disaster or disease. The few survivors only carry a fraction of the original genetic diversity. Some alleles might be completely lost just by bad luck, and the population that grows back has different genetics than before.",
    "The founder effect is when a small group leaves and starts a new population somewhere else, like colonizing an island. Those founders only carry a sample of the original population's genes. So the new population will have different allele frequencies based on whatever genes those few founders happened to have."
  ]
};
