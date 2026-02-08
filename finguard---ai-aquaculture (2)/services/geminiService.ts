
import { GoogleGenAI, Type } from "@google/genai";
import { PondMetrics, DiseaseAnalysis } from "../types";

export const analyzePondHealth = async (metrics: PondMetrics): Promise<string> => {
  // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the following pond water metrics for aquaculture in India. Provide a health score (0-100), detailed feedback, and actionable recommendations.
  Metrics:
  - pH: ${metrics.ph}
  - Temperature: ${metrics.temperature}°C
  - Dissolved Oxygen: ${metrics.dissolvedOxygen} mg/L
  - Ammonia: ${metrics.ammonia} mg/L
  - Turbidity: ${metrics.turbidity} NTU
  - Salinity: ${metrics.salinity} ppt`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  // Access response.text property directly
  return response.text || "Analysis failed. Please try again.";
};

export const detectFishDisease = async (base64Image: string): Promise<DiseaseAnalysis> => {
  // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Identify the fish disease in this image. Provide the disease name, confidence level (0-1), a treatment plan, and prevention tips in JSON format." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseId: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          treatmentPlan: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["diseaseId", "confidence", "treatmentPlan", "recommendations"]
      }
    }
  });

  // Access response.text property directly
  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
};
