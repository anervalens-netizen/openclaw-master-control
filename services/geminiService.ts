
import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent crashing if API key is missing
let ai: any = null;

function getAI() {
  if (ai) return ai;
  
  // Try to get key from Vite env or global process env (for compatibility)
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process.env as any).API_KEY;
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI diagnostics will be disabled.");
    return null;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    return null;
  }
}

export async function analyzeSystemLog(log: string): Promise<string> {
  const instance = getAI();
  if (!instance) {
    return "Error: Gemini API Key not configured. Please set VITE_GEMINI_API_KEY in your .env file.";
  }

  try {
    const response = await instance.models.generateContent({
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
