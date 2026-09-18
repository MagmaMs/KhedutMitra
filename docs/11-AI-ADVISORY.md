# AI Advisory Strategy

## 1. Concept
Leverage Large Language Models (LLMs) to provide contextual, hyper-personalized farming advice.

## 2. Architecture
- Frontend sends a payload containing the farmer's primary crops, location, and current weather data to the Express backend.
- Backend constructs a highly specific prompt.
- Backend calls OpenAI GPT-4o-mini or Anthropic Claude 3.5 Haiku API.

## 3. Prompt Engineering
**System Prompt Example:**
> "You are an expert Indian agronomist. The user is a farmer in Gujarat growing Cotton. The current weather is 35°C with no rain expected for 7 days. Provide exactly 3 bullet points of actionable advice regarding irrigation and pest control. Keep language simple and practical. Output in English."

## 4. Post-Processing
- The response is parsed and translated (if necessary) before being sent to the client.
- The UI renders this using the `Notice` or `Card` components with a distinct AI icon to indicate the source of the advice.
