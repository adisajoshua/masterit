# Security & AI Protocol (The "Security Expert")

## 1. AI Safety & Guardrails

- **Prompt Injection**: Assume all user input is hostile. Use delimiters (e.g., `"""`) to separate instructions from user content.
- **Output Validation**:
  - **JSON Mode**: Always request structured JSON from the LLM.
  - **Schema Validation**: Parse the JSON with `zod`. If it fails, retry or fallback. Do not trust the AI's raw output.
- **Rate Limiting**: Implement client-side debounce/throttle to prevent API spam.
- **Cost Control**: Token limits on input/output logic.

## 2. Frontend Security

- **XSS Prevention**:
  - Use React's default escaping.
  - For Markdown/HTML rendering, use `dompurify`.
  - Content Security Policy (CSP) headers (configured in deploy settings/meta tags).
- **API Keys**:
  - Store in `.env`.
  - Prefix with `VITE_` only if absolutely necessary for client-side access (prefer server-side proxy).
- **Data Privacy**:
  - Do not send PII (Personally Identifiable Information) to the LLM unless essential.
  - Anonymize user data before processing.

## 3. Deployment Checklist

- [ ] No secrets in `public/` or bundle.
- [ ] Error boundaries catch crashes.
- [ ] 404/500 pages are informative but don't leak stack traces.
- [ ] `robots.txt` configured correctly for this app type.
