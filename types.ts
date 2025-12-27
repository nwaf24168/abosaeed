
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export type ViewMode = 'SCANNER' | 'GAINERS' | 'LOSERS' | 'VOLUME' | 'CALCULATOR' | 'FINANCIAL' | 'NEWS' | 'COMMUNITY';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'MARKET' | 'COMPANY' | 'ECONOMY' | 'URGENT';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  content: string;
  relatedStocks?: string[];
}

export interface TechnicalAnalysis {
  rsi: number;
  ema20: number;
  ema50: number;
  ema200: number;
  macd: { macd: number; signal: number; hist: number };
  vwap: number;
  support: number[];
  resistance: number[];
  trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  status: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface AIAnalysis {
  status: 'إيجابي' | 'سلبي' | 'محايد';
  recommendation: 'دخول' | 'انتظار' | 'خروج';
  targets: number[];
  stopLoss: number;
  note: string;
}

export interface SectorLiquidity {
  name: string;
  value: number;
}

export interface MarketStats {
  tasiIndex: number;
  tasiChange: number;
  totalLiquidity: number;
  advancing: number;
  declining: number;
  unchanged: number;
  marketStatus: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  topSector: string;
  topSectorValue: number;
  sectors: SectorLiquidity[];
}

// أنواع بيانات المجتمعات الجديدة
export type RoomType = 'ANALYSIS' | 'STOCK' | 'EDUCATION' | 'DEMO' | 'VIP';
export type RoomStatus = 'LIVE' | 'SCHEDULED';

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  isHost?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  isSpeaking: boolean;
  isHost: boolean;
  avatar?: string;
}

export interface LiveRoom {
  id: string;
  title: string;
  host: string;
  type: RoomType;
  status: RoomStatus;
  participantsCount: number;
  isPrivate: boolean;
  isPaid: boolean;
  price?: number;
  tags: string[];
}

export interface FinancialStatementDeep {
  period: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  sellingGeneralAdmin: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebit: number;
  interestExpense: number;
  preTaxIncome: number;
  zakatProvision: number;
  netIncome: number;
  eps: number;
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  ppe: number;
  intangibleAssets: number;
  totalNonCurrentAssets: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;
  paidInCapital: number;
  retainedEarnings: number;
  totalEquity: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  capex: number;
  financingCashFlow: number;
  dividendsPaid: number;
  netChangeInCash: number;
  freeCashFlow: number;
}

export interface DividendRecord {
  period: string;
  type: 'CASH' | 'BONUS';
  amount: number;
  percentage: number;
  bonusRatio?: string; // مثال: "1:10" (سهم مقابل كل 10 أسهم)
  eligibilityDate: string;
  paymentDate: string;
}

export interface FinancialData {
  peRatio: number;
  pbRatio: number;
  eps: number;
  dividendYield: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  profitMargin: number;
  distributionPolicy: 'سنوية' | 'نصف سنوية' | 'ربع سنوية' | 'متغيرة';
  yearlyStatements: FinancialStatementDeep[];
  quarterlyStatements: FinancialStatementDeep[];
  semiAnnualStatements: FinancialStatementDeep[];
  dividendsHistory: DividendRecord[];
}

export interface AIFinancialHealth {
  status: 'إيجابي' | 'سلبي' | 'محايد';
  rating: number;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
}
