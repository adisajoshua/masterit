# How the System Determines Sub-Concept Difficulty (Before You Start)

You asked valid question: **"How does the system know the difficulty of 'Genetic Variation' vs 'Adaptation' before I have even answered a single question?"**

The badges you see on the Sub-Concept Modal (🟢 Basic, 🟡 Intermediate, 🔴 Advanced) represent the **inherent complexity of the topic itself**, not your personal skill level (yet).

## 1. The Logic (Theoretical Flow)

When you upload your source material, the system performs a **Complexity Analysis** during the "Processing" phase. This happens *before* the selection screen appears.

The system evaluates each extracted sub-concept based on **Cognitive Load Theory**:

* **🟢 BASIC ("Foundational")**
  * **Criteria:** Concepts that are primarily **Definitions**, **Facts**, or **Single Components**.
  * **Example:** *"Genetic Variation"* (What is it? A definition.)
  * **Goal:** To establish the vocabulary.

* **🟡 INTERMEDIATE ("Mechanistic")**
  * **Criteria:** Concepts that involve **Processes**, **Mechanisms**, or **Cause-and-Effect**.
  * **Example:** *"Selective Pressure"* (How does nature filter traits? A process.)
  * **Goal:** To understand how the parts work together.

* **🔴 ADVANCED ("Systemic")**
  * **Criteria:** Concepts that require **Synthesis**, **Evaluation**, or **System-Wide Impact**.
  * **Example:** *"Adaptation"* (How does the population change over time? A complex outcome of variation + selection.)
  * **Goal:** To apply the understanding to new contexts.

## 2. The Implementation (Visualized in Code)

Since we are currently simulating the AI backend, this analysis is **pre-calculated** and stored in our data structure.

In **`src/data/mockData.ts`**, we explicitly map these difficulties to the sub-concepts:

```typescript
sub_concepts: [
  // "Basic" because it is the starting point/definition
  { 
    id: "sc_variation", 
    title: "Genetic Variation", 
    difficulty: "basic" 
  },

  // "Intermediate" because it describes the active mechanism
  { 
    id: "sc_selection", 
    title: "Selective Pressure", 
    difficulty: "intermediate" 
  },

  // "Advanced" because it is the cumulative result of the previous two
  { 
    id: "sc_adaptation", 
    title: "Adaptation", 
    difficulty: "advanced" 
  }
]
```

## Summary

The system is guiding you through a **Pedagogical Arc**:

1. **Start Green:** Learn the parts.
2. **Go Yellow:** Learn how they move.
3. **Finish Red:** Understand what they create.
