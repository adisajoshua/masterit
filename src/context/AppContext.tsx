/**
 * AppContext.tsx
 * Purpose: Global application state provider. Manages user identity, study material,
 *          concept data, session progress, and XP accumulation.
 *
 * Features:
 *  - Persists all state to localStorage for session resilience
 *  - Provides session reset with full cleanup (including per-concept keys)
 *  - Manages concept mastery tracking
 *  - Stores cycle summary for the Review Screen
 *
 * Dependencies: React Context, AdaptiveConcept types, clearConceptSession helper.
 */

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CycleSummary } from "@/data/mockData";
import { AdaptiveConcept } from "@/types/adaptive";
import { clearConceptSession } from "@/hooks/useAdaptiveSession";

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
  updateConceptMastery: (conceptId: string, mastery: number) => void;
  resetSession: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [studyMaterial, setStudyMaterial] = useState(() => localStorage.getItem("studyMaterial") || "");
  const [totalXP, setTotalXP] = useState(() => Number(localStorage.getItem("totalXP")) || 0);

  // BUG 8 FIX: Don't fall back to mock data — start with empty array for fresh users
  const [concepts, setConcepts] = useState<AdaptiveConcept[]>(() => {
    const saved = localStorage.getItem("concepts");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedConcept, setSelectedConcept] = useState<AdaptiveConcept | null>(() => {
    const saved = localStorage.getItem("selectedConcept");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // BUG 2 FIX: Persist currentCycleSummary to localStorage
  const [currentCycleSummary, setCurrentCycleSummary] = useState<CycleSummary | null>(() => {
    const saved = localStorage.getItem("currentCycleSummary");
    return saved ? JSON.parse(saved) : null;
  });

  const [completedConcepts, setCompletedConcepts] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedConcepts");
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem("userName", userName); }, [userName]);
  useEffect(() => { localStorage.setItem("studyMaterial", studyMaterial); }, [studyMaterial]);
  useEffect(() => { localStorage.setItem("totalXP", totalXP.toString()); }, [totalXP]);
  useEffect(() => { localStorage.setItem("concepts", JSON.stringify(concepts)); }, [concepts]);
  useEffect(() => { localStorage.setItem("selectedConcept", JSON.stringify(selectedConcept)); }, [selectedConcept]);
  useEffect(() => { localStorage.setItem("completedConcepts", JSON.stringify(completedConcepts)); }, [completedConcepts]);

  // BUG 2 FIX: Persist cycle summary
  useEffect(() => {
    if (currentCycleSummary) {
      localStorage.setItem("currentCycleSummary", JSON.stringify(currentCycleSummary));
    } else {
      localStorage.removeItem("currentCycleSummary");
    }
  }, [currentCycleSummary]);

  const addXP = (amount: number) => {
    setTotalXP((prev) => prev + amount);
  };

  const markConceptComplete = (conceptId: string) => {
    if (!completedConcepts.includes(conceptId)) {
      setCompletedConcepts((prev) => [...prev, conceptId]);
    }
  };

  const updateConceptMastery = (conceptId: string, mastery: number) => {
    setConcepts((prev) =>
      prev.map((c) => (c.id === conceptId ? { ...c, mastery } : c))
    );
  };

  const resetSession = () => {
    // BUG 7 FIX: Clear all per-concept session localStorage keys
    concepts.forEach(c => clearConceptSession(c.id));

    setUserName("");
    setStudyMaterial("");
    setTotalXP(0);
    setConcepts([]);
    setSelectedConcept(null);
    setCurrentQuestionIndex(0);
    setCurrentCycleSummary(null);
    setCompletedConcepts([]);

    // Clean up all session-related localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("studyMaterial");
    localStorage.removeItem("totalXP");
    localStorage.removeItem("concepts");
    localStorage.removeItem("selectedConcept");
    localStorage.removeItem("completedConcepts");
    localStorage.removeItem("currentCycleSummary");
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
        setConcepts,
        selectedConcept,
        setSelectedConcept,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        currentCycleSummary,
        setCurrentCycleSummary,
        completedConcepts,
        markConceptComplete,
        updateConceptMastery,
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
