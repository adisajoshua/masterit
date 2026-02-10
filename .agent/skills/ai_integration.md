# AI Integration Skill (The "Brain")

## 1. Interaction Patterns

- **Streaming**: Always use streaming for text generation to reduce perceived latency.
- **Micro-tasks**: Break complex requests into smaller, specific prompts (e.g., "Analyze text" -> "Extract concepts" -> "generate questions").
- **Mock Data First**: Develop with mock JSON data first to perfect the UI, *then* wire up the API.

## 2. Prompt Engineering Standards

- **System Instructions**: Clearly define the persona ("You are a strict but encouraging tutor").
- **Constraint Output**: Use "Force JSON Mode" or `response_format: { type: "json_object" }`.
- **Few-Shot Examples**: Provide 1-3 examples of desired input/output pairs in the prompt.
- **Delimiters**: Wrap user input in `"""` or ```` ` ``` to prevent injection attacks.

## 3. Data Validation (Zod)

- **Strict Schema**: Define a Zod schema for *every* AI response.
- **Defensive Parsing**: Use `.safeParse()`. If it fails, log the error and show a generic fallback message or retry.
- **Sanitization**: Run all AI-generated strings through `DOMPurify` before rendering HTML.

## 4. Error Handling

- **Graceful Degradation**: If the API is down/slow, the app should remain usable (e.g., "Offline Mode" with local mock data).
- **Retry Logic**: Implement exponential backoff for 429 (Rate Limit) and 5xx errors.
