
import { StockData, TechnicalAnalysis, AIAnalysis } from '../types';

/**
 * simulated technical analysis calculations based on price action
 */
export const calculateTechnicalAnalysis = (data: StockData): TechnicalAnalysis => {
  // Simple deterministic randomization based on symbol for demo purposes
  const seed = parseInt(data.symbol) || 1000;
  
  const rsi = (seed % 40) + 35; // Random RSI between 35 and 75
  const ema20 = data.price * 0.98;
  const ema50 = data.price * 0.95;
  const ema200 = data.price * 0.90;
  
  const support = [data.price * 0.97, data.price * 0.94];
  const resistance = [data.price * 1.03, data.price * 1.06];
  
  let trend: 'UP' | 'DOWN' | 'SIDEWAYS' = 'SIDEWAYS';
  if (data.price > ema50 && rsi > 50) trend = 'UP';
  else if (data.price < ema50 && rsi < 50) trend = 'DOWN';

  let status: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
  if (trend === 'UP' && rsi > 55) status = 'POSITIVE';
  if (trend === 'DOWN' || rsi < 40) status = 'NEGATIVE';

  return {
    rsi,
    ema20,
    ema50,
    ema200,
    macd: { macd: 0.5, signal: 0.2, hist: 0.3 },
    vwap: data.price * 0.99,
    support,
    resistance,
    trend,
    status
  };
};

/**
 * محرك الاستراتيجية الفنية (بديل الذكاء الاصطناعي)
 * يقوم ببناء خطة تداول بناءً على المعادلات الفنية الصرفة
 */
export const calculateTechnicalStrategy = (stock: StockData, ta: TechnicalAnalysis): AIAnalysis => {
  let recommendation: 'دخول' | 'انتظار' | 'خروج' = 'انتظار';
  let note = "";
  
  // منطق التوصية
  if (ta.status === 'POSITIVE' && ta.trend === 'UP') {
    recommendation = 'دخول';
    note = `السهم يتداول في اتجاه صاعد فوق المتوسطات المتحركة مع زخم إيجابي (RSI: ${ta.rsi.toFixed(0)}). يتوقع استهداف مستويات المقاومة القريبة.`;
  } else if (ta.status === 'NEGATIVE' || ta.trend === 'DOWN') {
    recommendation = 'خروج';
    note = `يلاحظ ضعف في الزخم وكسر للمتوسطات السعرية. يفضل الخروج أو تخفيف المراكز لتفادي استمرار الهبوط نحو مستويات الدعم.`;
  } else {
    recommendation = 'انتظار';
    note = `السهم يتحرك في نطاق عرضي محايد. يفضل الانتظار حتى اختراق المقاومة ${ta.resistance[0].toFixed(2)} أو الارتداد من الدعم ${ta.support[0].toFixed(2)}.`;
  }

  return {
    status: ta.status === 'POSITIVE' ? 'إيجابي' : ta.status === 'NEGATIVE' ? 'سلبي' : 'محايد',
    recommendation,
    targets: [ta.resistance[0], ta.resistance[1]],
    stopLoss: ta.support[0] * 0.98, // وقف الخسارة تحت الدعم الأول بـ 2%
    note
  };
};

export const getScannerResults = (stocks: StockData[]): StockData[] => {
  return stocks.filter(s => {
    const ta = calculateTechnicalAnalysis(s);
    // Scanning criteria: RSI > 50, Price > EMA20 and EMA50, Trend is UP
    return ta.rsi > 50 && s.price > ta.ema20 && s.price > ta.ema50 && ta.trend === 'UP';
  });
};
