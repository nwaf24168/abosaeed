
import React from 'react';
import { MarketStats, ViewMode } from '../types';

interface MarketOverviewProps {
  stats: MarketStats;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAnalyzeTasi: () => void;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stats, onAnalyzeTasi }) => {
  return (
    <div className="space-y-4 pt-4">
      {/* TASI Card - Main Focus */}
      <div 
        onClick={onAnalyzeTasi}
        className="glass p-6 rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-transparent relative overflow-hidden shadow-xl"
      >
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">مؤشر تاسي</span>
            <h2 className="text-3xl font-black text-white font-mono tracking-tighter">
              {stats.tasiIndex.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 ${stats.tasiChange >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
            {stats.tasiChange >= 0 ? '▲' : '▼'} {Math.abs(stats.tasiChange).toFixed(2)}%
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center relative z-10">
           <div className="flex gap-4">
              <div className="text-center">
                 <span className="block text-[8px] text-slate-500 font-bold uppercase">السيولة</span>
                 <span className="block text-xs font-black text-white">4.2 مليار</span>
              </div>
              <div className="text-center">
                 <span className="block text-[8px] text-slate-500 font-bold uppercase">الشركات</span>
                 <span className="block text-xs font-black text-emerald-400">{stats.advancing} ↑</span>
              </div>
           </div>
           <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white active:scale-95 transition-all">تحليل مفصل</button>
        </div>
        
        {/* Background Accent */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 blur-[50px] rounded-full"></div>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-bold uppercase">الأكثر سيولة</span>
          <span className="text-xs font-black text-amber-500 truncate">{stats.topSector}</span>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-bold uppercase">حالة السوق</span>
          <span className={`text-xs font-black ${stats.marketStatus === 'POSITIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {stats.marketStatus === 'POSITIVE' ? 'إيجابية جيدة' : 'تراجع لحظي'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
