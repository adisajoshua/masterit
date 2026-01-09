import { createContext, useContext, useState, ReactNode } from "react";
import { mockSession, Concept, CycleSummary } from "@/data/mockData";

interface AppState {
  userName: string;
  setUserName: (name: string) => void;
  studyMaterial: string;
  setStudyMaterial: (material: string) => void;
  totalXP: number;
  addXP: (amount: number) => void;
  concepts: Concept[];
  selectedConcept: Concept | null;
  setSelectedConcept: (concept: Concept | null) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  currentCycleSummary: CycleSummary | null;
  setCurrentCycleSummary: (summary: CycleSummary | null) => void;
  completedConcepts: string[];
  markConceptComplete: (conceptId: string) => void;
  resetSession: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState("");
  const [studyMaterial, setStudyMaterial] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const [concepts] = useState<Concept[]>(mockSession.concepts);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentCycleSummary, setCurrentCycleSummary] = useState<CycleSummary | null>(null);
  const [completedConcepts, setCompletedConcepts] = useState<string[]>([]);

  const addXP = (amount: number) => {
    setTotalXP((prev) => prev + amount);
  };

  const markConceptComplete = (conceptId: string) => {
    if (!completedConcepts.includes(conceptId)) {
      setCompletedConcepts((prev) => [...prev, conceptId]);
    }
  };

  const resetSession = () => {
    setUserName("");
    setStudyMaterial("");
    setTotalXP(0);
    setSelectedConcept(null);
    setCurrentQuestionIndex(0);
    setCurrentCycleSummary(null);
    setCompletedConcepts([]);
  };

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        studyMaterial,
        setStudyMaterial,
        totalXP,
        addXP,
        concepts,
        selectedConcept,
        setSelectedConcept,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentCycleSummary,
        setCurrentCycleSummary,
        completedConcepts,
        markConceptComplete,
        resetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
