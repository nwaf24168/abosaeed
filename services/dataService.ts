
import { StockData } from '../types';

// نستخدم رابط نسبي أو نتحقق من البيئة
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '';

export const fetchLiveStocks = async (): Promise<StockData[]> => {
  if (!API_URL) throw new Error('No local server');
  try {
    const response = await fetch(`${API_URL}/stocks`);
    if (!response.ok) throw new Error('Backend not running');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchStockHistory = async (symbol: string, timeframe: string = '1h') => {
  if (!API_URL) return [];
  try {
    const response = await fetch(`${API_URL}/history/${symbol}?timeframe=${timeframe}`);
    return await response.json();
  } catch (error) {
    return [];
  }
};
