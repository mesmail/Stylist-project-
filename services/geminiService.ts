
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { FashionAnalysis, StyleRecommendations, Outfit } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeImageAndRecommend = async (base64Image: string): Promise<StyleRecommendations> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Analyze this image for fashion styling. Provide gender, age range, body type (Slim, Average, Athletic, Plus), face shape, skin tone, and hair color. Then provide 3 outfit recommendations for Casual, Business, and Night categories. For each outfit, provide a 'visualPrompt' which is a highly detailed description of a person with the user's physical attributes wearing that specific outfit in a high-fashion editorial setting." }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.OBJECT,
            properties: {
              gender: { type: Type.STRING },
              ageRange: { type: Type.STRING },
              bodyType: { type: Type.STRING },
              facialFeatures: {
                type: Type.OBJECT,
                properties: {
                  shape: { type: Type.STRING },
                  skinTone: { type: Type.STRING },
                  hairColor: { type: Type.STRING }
                }
              },
              confidence: { type: Type.NUMBER }
            }
          },
          outfits: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                items: {
                  type: Type.OBJECT,
                  properties: {
                    top: { type: Type.STRING },
                    bottom: { type: Type.STRING },
                    shoes: { type: Type.STRING },
                    accessories: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
                visualPrompt: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  try {
    const result = JSON.parse(response.text || '{}');
    
    // Safety checks for nested objects to prevent UI crashes
    if (result.analysis && !result.analysis.facialFeatures) {
      result.analysis.facialFeatures = { shape: 'Unknown', skinTone: 'Unknown', hairColor: 'Unknown' };
    }
    
    if (result.outfits && Array.isArray(result.outfits)) {
      result.outfits = result.outfits.map((o: any) => ({
        ...o,
        items: o.items || { top: 'N/A', bottom: 'N/A', shoes: 'N/A', accessories: [] }
      }));
    }

    return result as StyleRecommendations;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    throw new Error("Invalid response format from AI");
  }
};

export const generateOutfitImage = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High fashion editorial photography, full body shot, professional studio lighting, 8k resolution: ${prompt}` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const chatWithStylist = async (message: string, history: any[]) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are a world-class fashion stylist and image consultant. Help users with their fashion queries, offer tips on how to dress for their body type, and stay on top of current trends.'
    }
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};

export const searchFashionTrends = async (query: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || []
  };
};

export const saveToHistory = async (analysis: FashionAnalysis, outfits: Outfit[]) => {
  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis, outfits })
    });
    return await response.json();
  } catch (e) {
    console.error("Failed to save to history:", e);
    return null;
  }
};

export const getHistory = async () => {
  try {
    const response = await fetch('/api/history');
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch history:", e);
    return [];
  }
};

export const generateFashionVisual = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `High fashion editorial photography of: ${prompt}. Professional lighting, 8k resolution, cinematic composition.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
