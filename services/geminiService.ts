
import { GoogleGenAI } from "@google/genai";

// Fixed: Correctly initialize Gemini API using process.env.API_KEY directly as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeSystemLog(log: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the OpenClaw Master Control Assistant. Analyze the following log and provide a professional, concise diagnosis and solution:
      
      ${log}`,
      config: {
        systemInstruction: "You are a professional Linux systems administrator and OpenClaw expert. Keep responses brief, actionable, and formatted in Markdown.",
        temperature: 0.7,
      },
    });
    // Fixed: Accessed text property directly as it is a getter, not a method call
    return response.text || "Unable to analyze log at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not connect to AI diagnostic services.";
  }
}
