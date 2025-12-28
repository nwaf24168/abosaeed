
import { StockData } from '../types';

const API_URL = 'http://localhost:8000/api';

export const fetchLiveStocks = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_URL}/stocks`);
    if (!response.ok) throw new Error('Backend not running');
    return await response.json();
  } catch (error) {
    console.warn("MT5 Backend not detected, using simulation mode.");
    throw error;
  }
};

export const fetchStockHistory = async (symbol: string, timeframe: string = '1h') => {
  try {
    const response = await fetch(`${API_URL}/history/${symbol}?timeframe=${timeframe}`);
    return await response.json();
  } catch (error) {
    return [];
  }
};
