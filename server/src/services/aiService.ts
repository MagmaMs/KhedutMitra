import axios from 'axios';
import FormData from 'form-data';

const DISEASE_API_URL = process.env.DISEASE_API_URL || 'http://localhost:5001';

export class AiService {
  static async getCropAdvice(query: string, context?: any) {
    // Mock advisory implementation (could be replaced with a real model later)
    await new Promise(r => setTimeout(r, 1500));
    return {
      recommendation: `Demo Advice for: "${query}". Apply a balanced NPK fertilizer and ensure proper irrigation.`,
      why: 'Based on general crop stages and average weather conditions, this helps maximize yield.',
      actions: ['Apply 50kg/acre NPK (19:19:19)', 'Irrigate field within 48 hours', 'Monitor for common pests'],
      cautions: ['Do not apply fertilizer if heavy rain is expected', 'Avoid spraying during high winds'],
      sources: ['Mock Agricultural Data', 'Fallback Mode'],
    };
  }

  static async analyzeDisease(fileBuffer: Buffer, mimeType: string = 'image/jpeg', filename: string = 'image.jpg') {
    const form = new FormData();
    form.append('image', fileBuffer, { filename, contentType: mimeType });

    const response = await axios.post(`${DISEASE_API_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    const data = response.data;

    return {
      diagnosis: data.prediction?.disease ?? data.disease_name ?? data.diagnosis ?? 'Unknown',
      confidence: data.prediction?.confidence_pct ?? data.confidence_pct ?? (data.confidence != null ? Math.round(data.confidence * 100) : undefined),
      severity: data.severity ?? 'unknown',
      explanation: data.explanation ?? '',
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      prevention: Array.isArray(data.prevention) ? data.prevention : [],
      crop: data.crop ?? 'Tomato',
    };
  }
}
