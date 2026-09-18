import { GoogleGenAI, Type } from '@google/genai';
import axios from 'axios';

export class AiService {
  static async getCropAdvice(query: string, context?: any) {
    // If we have an API key, use Gemini 2.5 Flash for real-time inference
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const promptContext = context ? `Context: ${JSON.stringify(context)}\n` : '';
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${promptContext}Farmer Question: ${query}\nProvide structured agricultural advice tailored to India. Include practical actions, cautions (especially regarding weather or pesticides), and cite generic trusted sources like 'ICAR Guidelines' if applicable.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendation: { type: Type.STRING },
                why: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                cautions: { type: Type.ARRAY, items: { type: Type.STRING } },
                sources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['recommendation', 'why', 'actions', 'cautions', 'sources']
            }
          }
        });
        
        if (response.text) {
          const result = JSON.parse(response.text);
          // Normalize to match frontend expectations
          return {
            recommendation: result.recommendation,
            why: result.why,
            actions: result.actions,
            cautions: result.cautions,
            sources: result.sources
          };
        } else {
          throw new Error('Gemini API returned empty response');
        }
      } catch (err) {
        console.error('Gemini API Error:', err);
        // Fallthrough to mock
      }
    }

    // Fallback Mock
    await new Promise(r => setTimeout(r, 1500));
    return {
      recommendation: `Demo Advice for: "${query}". Apply a balanced NPK fertilizer and ensure proper irrigation.`,
      why: "Based on general crop stages and average weather conditions, this helps maximize yield.",
      actions: [
        "Apply 50kg/acre NPK (19:19:19)",
        "Irrigate field within 48 hours",
        "Monitor for common pests"
      ],
      cautions: [
        "Do not apply fertilizer if heavy rain is expected",
        "Avoid spraying during high winds"
      ],
      sources: ["Mock Agricultural Data", "Fallback Mode"]
    };
  }

  static async analyzeDisease(fileBuffer: Buffer, mimeType?: string) {
    // If the teammate's ML model is deployed, route to it
    if (process.env.DISEASE_API_URL) {
      try {
        const formData = new FormData();
        formData.append('image', new Blob([new Uint8Array(fileBuffer)], { type: mimeType || 'image/jpeg' }));
        
        const response = await axios.post(process.env.DISEASE_API_URL, formData, {
          headers: {
            'Authorization': process.env.DISEASE_API_KEY ? `Bearer ${process.env.DISEASE_API_KEY}` : ''
          },
          timeout: 10000
        });
        
        return response.data; // Expected to match the normalized contract
      } catch (err) {
        console.error('Disease ML API Error:', err);
        // Fallthrough to mock
      }
    }

    // Fallback Mock
    await new Promise(r => setTimeout(r, 2000));
    return {
      diagnosis: "Leaf Blight (Demo)",
      confidence: 89,
      severity: "medium",
      explanation: "Brown, necrotic spots with yellow halos are characteristic of early blight. This is a demo fallback result.",
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
