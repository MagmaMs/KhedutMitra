export class AiService {
  static async getCropAdvice(query: string, context?: any) {
    // Adapter for Gemini/OpenAI. 
    // In demo mode, return a structured mock.
    await new Promise(r => setTimeout(r, 1500));

    return {
      recommendation: "Apply a balanced NPK fertilizer and ensure proper irrigation.",
      reasoning: "Based on the crop stage and weather conditions, this will maximize yield.",
      actions: [
        "Apply 50kg/acre NPK (19:19:19)",
        "Irrigate field within 48 hours",
        "Monitor for aphids"
      ],
      cautions: [
        "Do not apply fertilizer if heavy rain is expected",
        "Avoid spraying during high winds"
      ],
      sources: ["ICAR Guidelines", "Local Agronomist Data"]
    };
  }

  static async analyzeDisease(fileBuffer: Buffer) {
    // Adapter for ML Model
    await new Promise(r => setTimeout(r, 2000));

    return {
      diagnosis: "Leaf Blight",
      confidence: 89,
      severity: "medium",
      explanation: "Brown, necrotic spots with yellow halos are characteristic of early blight.",
      recommendations: [
        "Apply Mancozeb 75% WP @ 2g/litre of water",
        "Remove and destroy severely affected lower leaves"
      ],
      prevention: [
        "Ensure proper crop rotation",
        "Maintain adequate plant spacing for airflow"
      ],
      crop: "Unknown"
    };
  }
}
