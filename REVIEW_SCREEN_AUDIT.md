# Audit Report: Review Screen vs. Adaptive Spec v2.0

## Executive Summary

The current **Review Screen** (`src/pages/ReviewScreen.tsx`) functions as a standard "Session Summary" (MVP v1), displaying basic stats like time spent and overall mastery.

However, it **fails to implement the core "Adaptive Features"** defined in **Document 5: Adaptive UI/UX Specification (Section 3.5 & 3.6)**. The screen does not tell the "Story of Adaptation" (how the user grew or struggled) and lacks the intelligent "Next Steps" logic.

---

## 1. Missing Core Logic (Major Updates Required)

### 🚨 Critical Gap: "The Story of Adaptation"

**Spec Requirement (3.6):** The screen must visualize the *trajectory* of the session.

* **Current State:** Static stats only ("Overall Mastery: 85%").
* **Missing:**
  * **Adaptation History:** "Started Basic 🟢 → Moved to Intermediate 🟡".
  * **Growth Metric:** "Improved +25% through session".
  * **Confidence Reveal:** An animated breakdown of *why* the score is 85% (Coverage vs. Consistency vs. Depth).

### 🚨 Critical Gap: Intelligent Next Steps

**Spec Requirement (3.5, E.3):** The system must offer tailored paths based on performance.

* **Current State:** Two generic buttons: `[Download Summary]` and `[Start New Session]`.
* **Missing:**
  * **Contextual Options:**
    * If Mastery < 70%: **[🔄 Remediation Cycle]** ("Let's review the basics of...")
    * If Mastery > 85%: **[➡️ Advanced Challenge]** ("Ready for the next concept?")
  * **Custom Practice:** The ability to select specific weak points (gaps) and generate a micro-session.

---

## 2. Visual & UI Gaps (Minor Updates)

### A. The "Breakdown" Visualization

**Spec Requirement (3.5, E.1):** A holistic analysis splitting the score into 3 dimensions.

* **Missing:**
  * **Coverage:** How much of the concept map was touched?
  * **Consistency:** Did the user stay at the same level?
  * **Depth:** Did they use causal reasoning?

### B. Strengths vs. Weaknesses

**Spec Requirement (3.5, E.2):** Balanced feedback.

* **Current State:** Only shows "Areas to Review" (Negative/Gaps).
* **Missing:**
  * **"Strengths" Section:** "You taught me well about..." (Positive Reinforcement).
  * **Interactive Evidence:** Hovering over a gap should show *why* it's a gap (e.g., "You missed the term 'mitochondria' in Question 2").

### C. Adaptation Events Timeline

**Spec Requirement (3.6):** A timeline or list of adaptation events.

* **Missing:** A visual indicator of when difficulty changed (e.g., "Q1: Basic 🟢 -> Q2: Intermediate 🟡").

---

## 3. Data Model Implications

To support these features, the `AdaptiveSession` type in `src/types/adaptive.ts` is insufficient.

**Current Model:**

```typescript
interface AdaptiveSession {
    id: string;
    original_text: string;
    concepts: AdaptiveConcept[]; // Static list
    created_at: string;
}
```

**Required Model Expansion:**

```typescript
interface AdaptiveSessionResult {
    // ... existing fields
    trajectory: {
        startDifficulty: DifficultyLevel;
        endDifficulty: DifficultyLevel;
        adaptationEvents: AdaptationEvent[]; // [Q1: Increased, Q2: Stable]
    };
    metrics: {
        coverage: number;    // 0-1
        consistency: number; // 0-1
        depth: number;       // 0-1
    };
    nextSteps: {
        recommendedAction: 'remediate' | 'advance' | 'practice';
        reason: string;
    };
}
```

## 4. Recommendations

1. **Immediate:** Add the "Start -> End" difficulty badge to the header.
2. **Short Term:** Implement the **"Confidence Reveal"** component to replace the static progress bar.
3. **Major Feature:** Build the **"Next Steps" Logic** to dynamically generate the buttons based on the `sessionStats`.
