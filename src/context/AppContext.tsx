import { createContext, useContext, useState, ReactNode } from "react";
import { CycleSummary } from "@/data/mockData";
import { AdaptiveConcept } from "@/types/adaptive";
import { mockAdaptiveConcepts } from "@/data/mockAdaptiveData";

interface AppState {
  userName: string;
  setUserName: (name: string) => void;
  studyMaterial: string;
  setStudyMaterial: (material: string) => void;
  totalXP: number;
  addXP: (amount: number) => void;
  concepts: AdaptiveConcept[];
  setConcepts: (concepts: AdaptiveConcept[]) => void;
  selectedConcept: AdaptiveConcept | null;
  setSelectedConcept: (concept: AdaptiveConcept | null) => void;
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
  const [concepts, setConcepts] = useState<AdaptiveConcept[]>(mockAdaptiveConcepts);
  const [selectedConcept, setSelectedConcept] = useState<AdaptiveConcept | null>(null);
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
        setConcepts, // Added setter
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
