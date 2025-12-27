
import { StockData, TechnicalAnalysis } from '../types';

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

export const getScannerResults = (stocks: StockData[]): StockData[] => {
  return stocks.filter(s => {
    const ta = calculateTechnicalAnalysis(s);
    // Scanning criteria: RSI > 50, Price > EMA20 and EMA50, Trend is UP
    return ta.rsi > 50 && s.price > ta.ema20 && s.price > ta.ema50 && ta.trend === 'UP';
  });
};
