I have implemented the **"Story of Adaptation"** on the Review Screen.

## 1. Data Model Updates

* **Original Issue:** The "Session" was essentially a static list of answers.
* **Update:** I added `trajectory` and `metrics` to `AdaptiveSession` types and updated `mockData.ts`.
  * **Trajectory:** Logs the `startDifficulty`, `endDifficulty`, and the exact `path` (e.g., `["basic", "intermediate", "intermediate"]`).
  * **Metrics:** Tracks pedagogical details: `Coverage`, `Consistency`, and `Depth`.

## 2. UI Updates (Review Screen)

I added a new **"Learning Journey" card** immediately below the quick stats section.

* **The "Story" Arc:**
  * Visualizes your path from **Start Difficulty** ➔ **End Difficulty**.
  * Uses a "Connective Arrow" metaphor with dots representing the steps.
  * Color-codes each step (Green/Yellow/Red) so you can instantly see if you "leveled up."

* **Confidence Reveal:**
  * Instead of just "85% Score", it now breaks it down:
    * **Coverage:** 90% (How much you touched)
    * **Consistency:** 85% (How steady you were)
    * **Depth:** 70% (How deep you went)

This explicitly answers the user's question: *"Did the system adapt to me?"* by showing the difficulty level changing over time.
