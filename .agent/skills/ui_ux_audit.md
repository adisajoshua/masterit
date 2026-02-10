# UI/UX Audit Skill (The "Soul" Checker)

## 1. Visual heuristic Review

- [ ] **Consistency**: Are all colors from the HSL variables? Are borders hard (1px/2px)?
- [ ] **Grid**: Is every spacing logic a multiple of 4px?
- [ ] **Typography**: Are fonts used correctly? (Inter for UI, Poppins for Headings, Caveat for Notes).
- [ ] **Hierarchy**: Is variable sizing used effectively? (H1 > H2 > H3).

## 2. Interaction Design

- [ ] **Feedback**: Does every interaction have a visual state change (hover, active, focus)?
- [ ] **Animation**: Are transitions smooth (< 300ms) and purposeful?
- [ ] **Error States**: Are errors clear and helpful? ("Try again" vs "Error 500").
- [ ] **Loading**: Are skeletons or spinners used to mask latency?

## 3. Accessibility Audit (WCAG)

- [ ] **Contrast**: Check text color against background (4.5:1 minimum).
- [ ] **Keyboard**: Can you navigate the entire flow using only Tab/Enter/Space?
- [ ] **Screen Reader**: Do images have `alt` text? Do inputs have `<label>`?
- [ ] **Reduced Motion**: Respect `prefers-reduced-motion` media query.
