---
description: Process for creating a new feature with AI, Design, and Pedagogy checks
---

# Feature Creation Workflow

This workflow ensures every new feature adheres to our high standards for Design, Code, Security, and Pedagogy.

## 1. Kickoff & Definition

- [ ] **Goal**: What problem does this solve?
- [ ] **Pedagogy Check**: Does this align with Feynman/Socratic principles? (Refer to `.agent/rules/pedagogy_principles.md`)
- [ ] **AI Role**: How does the AI enhance this? (Not just a chatbot).

## 2. Design Specs (The "Soul")

- [ ] **Lo-Fi**: Sketch the flow.
- [ ] **Components**: Identify existing `Retro*` components or define new ones.
- [ ] **Micro-Interactions**: Define hover/active states and transitions (Framer Motion).
- [ ] **Mobile First**: Verify layout on 375px width.

## 3. Technical Architecture (The "Brain")

- [ ] **State**: Local vs. Global (Context). Prefer Local.
- [ ] **Data**: Define Zod schemas for external/AI data.
- [ ] **Security**: Review input handling and API calls. (Refer to `.agent/rules/security_protocol.md`)

## 4. Implementation

- [ ] Create/Update Components in `src/components/retro-ui/`.
- [ ] Implement Business Logic (Hooks/Utils).
- [ ] Integrate AI (mock first, then real API).
- [ ] **Comment**: Add "Why" comments for complex logic.

## 5. Review & Polish

- [ ] **Audit**:
  - [ ] Accessibility (Keyboard nav, Contrast).
  - [ ] Performance (Unnecessary re-renders?).
  - [ ] Security (Secrets, Sanitization).
- [ ] **Tests**: Add unit/integration tests for critical paths.
