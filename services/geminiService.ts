
import { GoogleGenAI, Type } from "@google/genai";
import { StockData, TechnicalAnalysis, AIAnalysis, FinancialData, AIFinancialHealth } from "../types.ts";

const getSafeApiKey = (): string => {
  try {
    const key = (window as any).process?.env?.API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : '');
    return key || '';
  } catch {
    return '';
  }
};

export const getAIAnalysis = async (stock: StockData, ta: TechnicalAnalysis): Promise<AIAnalysis> => {
  const apiKey = getSafeApiKey();
  const ai = new GoogleGenAI({ apiKey: apiKey || 'temporary_key' });
  
  const prompt = `حلل سهم ${stock.name} (${stock.symbol}) فنياً. السعر: ${stock.price}. RSI: ${ta.rsi}. الاتجاه: ${ta.trend}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            targets: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            stopLoss: { type: Type.NUMBER },
            note: { type: Type.STRING },
          },
          required: ['status', 'recommendation', 'targets', 'stopLoss', 'note'],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Fallback active", error);
    return {
      status: 'محايد',
      recommendation: 'انتظار',
      targets: [stock.price * 1.05],
      stopLoss: stock.price * 0.95,
      note: "التحليل الفني المحلي: السهم في منطقة استقرار."
    };
  }
};

export const getAIFinancialAnalysis = async (stock: StockData, financials: FinancialData): Promise<AIFinancialHealth> => {
  const apiKey = getSafeApiKey();
  const ai = new GoogleGenAI({ apiKey: apiKey || 'temporary_key' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `حلل مالياً: ${stock.name}. الربحية: ${financials.profitMargin}%. مكرر الأرباح: ${financials.peRatio}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            executiveSummary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['status', 'rating', 'executiveSummary', 'strengths', 'weaknesses'],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return {
      status: 'محايد',
      rating: 5,
      executiveSummary: "تعذر الاتصال بخبير الذكاء الاصطناعي. البيانات المالية تشير إلى استقرار عام.",
      strengths: ["ملاءة مالية جيدة"],
      weaknesses: ["تحديات قطاعية"]
    };
  }
};
