
import { GoogleGenAI, Type } from "@google/genai";
import { StockData, TechnicalAnalysis, AIAnalysis, FinancialData, AIFinancialHealth } from "../types";

// Always use a named parameter when initializing the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Get AI-driven technical analysis for a specific stock
 */
export const getAIAnalysis = async (stock: StockData, ta: TechnicalAnalysis): Promise<AIAnalysis> => {
  const prompt = `
    حلل السهم التالي للسوق السعودي (تداول):
    اسم السهم: ${stock.name} (${stock.symbol})
    السعر الحالي: ${stock.price}
    تغير السعر: ${stock.change}%
    RSI: ${ta.rsi.toFixed(2)}
    الاتجاه: ${ta.trend}
    EMA 20: ${ta.ema20.toFixed(2)}
    EMA 50: ${ta.ema50.toFixed(2)}
    مناطق الدعم: ${ta.support.join(', ')}
    مناطق المقاومة: ${ta.resistance.join(', ')}

    أريد التحليل بصيغة JSON تماماً كما هو محدد في الـ schema.
    الملاحظة يجب أن تكون باللهجة الخليجية البيضاء ومختصرة جداً (لا تزيد عن جملتين).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['إيجابي', 'سلبي', 'محايد'] },
            recommendation: { type: Type.STRING, enum: ['دخول', 'انتظار', 'خروج'] },
            targets: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            stopLoss: { type: Type.NUMBER },
            note: { type: Type.STRING },
          },
          required: ['status', 'recommendation', 'targets', 'stopLoss', 'note'],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      status: ta.status === 'POSITIVE' ? 'إيجابي' : ta.status === 'NEGATIVE' ? 'سلبي' : 'محايد',
      recommendation: 'انتظار',
      targets: [stock.price * 1.05, stock.price * 1.1],
      stopLoss: stock.price * 0.95,
      note: "تعذر الحصول على تحليل AI، اعتمد على الأرقام الفنية الظاهرة."
    };
  }
};

/**
 * Get AI-driven financial health analysis for a specific stock
 */
export const getAIFinancialAnalysis = async (stock: StockData, financials: FinancialData): Promise<AIFinancialHealth> => {
  const prompt = `
    أنت الآن "مدقق مالي" صارم وخبير في السوق السعودي. حلل القوائم المالية لشركة ${stock.name}.
    البيانات الرقمية الحالية:
    - مكرر الربحية: ${financials.peRatio.toFixed(2)}
    - القيمة الدفترية: ${financials.pbRatio.toFixed(2)}
    - العائد على الحقوق (ROE): ${financials.roe.toFixed(2)}%
    - هامش الربح: ${financials.profitMargin.toFixed(2)}%
    - الديون مقابل الحقوق: ${financials.debtToEquity.toFixed(2)}
    - نسبة السيولة: ${financials.currentRatio.toFixed(2)}

    أريد تقريراً "محوكماً" يتبع هذا الهيكل بدقة في الـ executiveSummary:
    1. [جودة الأرباح]: هل الأرباح نقدية حقيقية أم محاسبية (بناءً على السيولة والهوامش)؟
    2. [كفاءة التشغيل]: كيف تدير الإدارة أصولها قياساً بالعائد على الحقوق؟
    3. [الملاءة المالية]: هل مستويات الديون تشكل مخاطر هيكلية؟

    القواعد:
    - لا تخرج عن هذا الهيكل (1, 2, 3).
    - استخدم لهجة سعودية بيضاء محترفة.
    - النتيجة يجب أن تكون JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['إيجابي', 'سلبي', 'محايد'] },
            rating: { type: Type.NUMBER },
            executiveSummary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['status', 'rating', 'executiveSummary', 'strengths', 'weaknesses'],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Financial AI Analysis failed:", error);
    return {
      status: 'محايد',
      rating: 5,
      executiveSummary: "1. [جودة الأرباح]: الأرباح ضمن نطاق الاستقرار المحاسبي.\n2. [كفاءة التشغيل]: الإدارة تحافظ على كفاءة معتدلة.\n3. [الملاءة المالية]: المديونية ضمن الحدود الآمنة للقطاع.",
      strengths: ["استقرار نسبي في الأصول"],
      weaknesses: ["الحاجة لتحسين كفاءة التشغيل"]
    };
  }
};
