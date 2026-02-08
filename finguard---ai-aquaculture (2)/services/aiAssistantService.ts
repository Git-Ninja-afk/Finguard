
import { GoogleGenAI } from "@google/genai";
import { PondConfig } from "../types";

const ELEVEN_LABS_API_KEY = 'sk_d4ed41a77c069da3da3289e901897b314d382f6ef1845c8d';
const VOICE_ID = 'Z1mjfzamgmGKi9c390rc';

export const getGeminiAnalysis = async (query: string, pond: PondConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are FinGuard AI, a helpful aquaculture expert for a farm in India. 
    CURRENT POND DATA:
    - Name: ${pond.name}
    - Tank Size: ${pond.tankSize}
    - Fish: ${pond.fishCount} (${pond.fishType})
    - Temp: ${pond.metrics.temp}°C
    - pH: ${pond.metrics.ph}
    - Oxygen: ${pond.metrics.oxygen} mg/L
    - Ammonia: ${pond.metrics.ammonia} mg/L
    - Health Score: ${pond.healthScore}/100

    Answer questions based on this data. If metrics are bad, give advice. 
    Keep responses conversational but concise for a voicebot.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI system is temporarily unavailable. Please check your connection.";
  }
};

export const speakWithElevenLabs = async (text: string): Promise<HTMLAudioElement | null> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!response.ok) throw new Error("ElevenLabs API failure");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    return audio;
  } catch (error) {
    console.error("ElevenLabs Error:", error);
    return null;
  }
};
