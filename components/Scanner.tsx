
import React, { useMemo } from 'react';
import { StockData, ViewMode } from '../types';
import { getScannerResults } from '../services/taService';

interface ScannerProps {
  stocks: StockData[];
  onSelect: (stock: StockData) => void;
  viewMode: ViewMode;
}

const Scanner: React.FC<ScannerProps> = ({ stocks, onSelect, viewMode }) => {
  const filteredStocks = useMemo(() => {
    switch (viewMode) {
      case 'SCANNER':
        return getScannerResults(stocks);
      case 'GAINERS':
        return [...stocks].sort((a, b) => b.change - a.change).slice(0, 15);
      case 'LOSERS':
        return [...stocks].sort((a, b) => a.change - b.change).slice(0, 15);
      case 'VOLUME':
        return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 15);
      default:
        return stocks;
    }
  }, [stocks, viewMode]);

  const formatVolume = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' مليون';
    if (val >= 1000) return (val / 1000).toFixed(0) + ' ألف';
    return val.toLocaleString();
  };

  const titles = {
    SCANNER: 'الفرص الفنية الإيجابية',
    GAINERS: 'أعلى الشركات ارتفاعاً',
    LOSERS: 'أكثر الشركات انخفاضاً',
    VOLUME: 'الشركات الأكثر سيولة'
  };

  const getThemeColor = () => {
    if (viewMode === 'LOSERS') return 'rose';
    if (viewMode === 'VOLUME') return 'blue';
    return 'emerald';
  };

  const themeColor = getThemeColor();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-1.5 h-10 bg-${themeColor}-500 rounded-full shadow-[0_0_15px_rgba(var(--color-${themeColor}-500),0.5)]`}></div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {titles[viewMode]}
            </h2>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">تحديث لحظي ذكي</p>
          </div>
        </div>
        <div className={`bg-${themeColor}-500/10 text-${themeColor}-500 px-4 py-1.5 rounded-xl text-xs font-black border border-${themeColor}-500/20 shadow-sm`}>
          {filteredStocks.length} شركة في القائمة
        </div>
      </div>

      {filteredStocks.length === 0 ? (
        <div className="glass p-20 rounded-3xl text-center border border-slate-800/50 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-500 font-bold">لا توجد شركات تحقق هذه المعايير حالياً..</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredStocks.map(stock => (
            <div 
              key={stock.symbol}
              className={`glass p-6 rounded-2xl border border-slate-800/50 hover:border-${themeColor}-500/40 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              onClick={() => onSelect(stock)}
            >
              <div className={`absolute top-0 right-0 w-1 h-full bg-${themeColor}-500/0 group-hover:bg-${themeColor}-500/40 transition-all`}></div>
              
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors">{stock.name}</h3>
                  <span className="text-slate-500 text-[10px] font-mono font-bold tracking-widest">{stock.symbol}</span>
                </div>
                <div className={`flex flex-col items-end`}>
                   <div className={`${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'} text-sm font-black font-mono`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">السعر</p>
                  <p className="text-white font-mono font-black text-xl tracking-tighter">{stock.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-slate-500 font-bold mb-1">السيولة: {formatVolume(stock.volume)}</p>
                  <div className={`bg-${themeColor}-600/10 text-${themeColor}-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-${themeColor}-500/20 group-hover:bg-${themeColor}-600 group-hover:text-white transition-all`}>
                    تحليل ذكي
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scanner;
