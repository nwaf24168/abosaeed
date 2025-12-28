
import React, { useMemo } from 'react';
import { StockData, ViewMode } from '../types';
import { getScannerResults } from '../services/taService';

interface ScannerProps {
  stocks: StockData[];
  onSelect: (stock: StockData) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Scanner: React.FC<ScannerProps> = ({ stocks, onSelect, viewMode, setViewMode }) => {
  const filteredStocks = useMemo(() => {
    switch (viewMode) {
      case 'SCANNER': return getScannerResults(stocks);
      case 'GAINERS': return [...stocks].sort((a, b) => b.change - a.change).slice(0, 15);
      case 'LOSERS': return [...stocks].sort((a, b) => a.change - b.change).slice(0, 15);
      case 'VOLUME': return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 15);
      default: return getScannerResults(stocks);
    }
  }, [stocks, viewMode]);

  const tabs = [
    { id: 'SCANNER', label: 'الأسهم الإيجابية', icon: '✨' },
    { id: 'GAINERS', label: 'المرتفع', icon: '📈' },
    { id: 'LOSERS', label: 'المنخفض', icon: '📉' },
    { id: 'VOLUME', label: 'السيولة', icon: '🔥' },
  ];

  return (
    <div className="space-y-4">
      {/* Native-style Segmented Control */}
      <div className="sticky top-16 z-40 bg-[#070b14]/90 backdrop-blur-md py-3 -mx-4 px-4 border-b border-white/5">
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 ${
                viewMode === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-500 active:bg-white/5'
              }`}
            >
              <span className="text-sm font-black">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List Header Info */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
          {tabs.find(t => t.id === viewMode)?.label} اليوم
        </h3>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] text-slate-500 font-bold uppercase">مباشر</span>
        </div>
      </div>

      {/* Stock List - Very Organized and Simple */}
      <div className="space-y-2 animate-in fade-in duration-300">
        {filteredStocks.map((stock, index) => (
          <div 
            key={stock.symbol}
            onClick={() => onSelect(stock)}
            className="bg-slate-900/40 active:bg-slate-800 transition-all rounded-3xl p-4 flex items-center justify-between border border-white/5 group"
          >
            <div className="flex items-center gap-4">
              {/* Index/Rank for Gainers/Losers */}
              {(viewMode === 'GAINERS' || viewMode === 'LOSERS' || viewMode === 'VOLUME') && (
                <span className="text-[10px] font-black text-slate-700 w-4 text-center">
                  {index + 1}
                </span>
              )}
              
              <div className="flex flex-col">
                <span className="text-white font-black text-sm leading-tight">{stock.name}</span>
                <span className="text-[10px] font-mono font-bold text-slate-500">{stock.symbol}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-mono font-black text-white">
                  {stock.price.toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-600 font-bold">ر.س</span>
              </div>

              <div className={`min-w-[70px] py-2 rounded-2xl flex items-center justify-center font-black text-xs ${
                stock.change >= 0 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-rose-500/10 text-rose-500'
              }`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}

        {filteredStocks.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="text-4xl">🔎</div>
            <p className="text-slate-500 text-xs font-bold">لا يوجد نتائج حالياً في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
