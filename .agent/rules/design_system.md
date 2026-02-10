# Design System & Code Quality Rules

## 1. The "Soul" & Aesthetic DNA (Non-Negotiable)

- **Identity**: This is a **Neo-Brutalist** / **Pop** UI.
  - **Colors**: High Saturation (Pink `#FF4D80`, Yellow `#FFD24D`).
  - **Borders**: Hard 1px/2px black borders. No soft shadows; use offset solid shadows (`box-shadow: 6px 6px 0 black`).
  - **Typography**: `Inter` (UI), `Poppins` (Display), `Space Mono` (Data), `Caveat` (Human).
- **Grid**: Strict **4px grid system**. All padding/margin must be multiples of 4 (e.g., `p-4` = 16px).
- **Responsiveness**: "Fluid Layouts". Use `clamp()`, `min()`, `max()`, and percentage-based widths. Test on mobile (375px) first.
- **Micro-Interactions**: Every actionable element must have a `:hover` (lift/color shift) and `:active` (press/scale down).

## 2. Engineering Standards (The "Veteran" Code)

- **Type Safety**: strict `TypeScript`. No `any`. Use `zod` for runtime validation of external data (API/AI).
- **Component Architecture**:
  - Prefer **Composition** over Inheritance.
  - Limit props to < 5 essential configuration items; use `slot` or `children` for content.
  - **State**: Keep state **local** (co-located) unless shared by 3+ disconnected components. Use Context sparingly.
- **Documentation**:
  - **Why > What**: Comments explain *intent*, not mechanics.
  - **JSDoc**: All exported functions/components must have JSDoc descriptions.

## 3. Accessibility (The "Inclusive" Code)

- **Contrast**: Text must meet WCAG AA (4.5:1).
- **Focus**: Visible focus indicators are mandatory for keyboard navigation.
- **Semantic HTML**: Use `<button>`, `<article>`, `<nav>`, not just `<div>`.
- **ARIA**: Use `aria-label` only when visible text is insufficient.

## 4. AI & Data Handling

- **Streaming**: AI responses must stream to the UI for perceived performance.
- **Sanitization**: All AI-generated HTML/Markdown must be sanitized (e.g., `DOMPurify`) before rendering.
- **Graceful Failure**: If the AI API fails, show a helpful error state or fallback content, never a crash.

## 5. Security Protocol (The "Fortress")

- **Secrets**: NEVER commit API keys. Use `.env`.
- **Input Validation**: Validate all user inputs on the client before sending to API.
- **Content Policy**: No execution of user-submitted scripts.
