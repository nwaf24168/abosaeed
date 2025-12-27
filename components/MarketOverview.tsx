
import React from 'react';
import { MarketStats, ViewMode } from '../types';

interface MarketOverviewProps {
  stats: MarketStats;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAnalyzeTasi: () => void;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stats, viewMode, setViewMode, onAnalyzeTasi }) => {
  const formatLiquidity = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + ' مليار';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' مليون';
    if (val >= 1000) return (val / 1000).toFixed(0) + ' ألف';
    return val.toLocaleString() + ' ر.س';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* مؤشر تاسي */}
        <div className="glass p-5 rounded-[1.5rem] border border-white/5 hover:border-emerald-500/20 transition-all group relative overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">مؤشر تاسي</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-mono font-black text-white tracking-tighter">{stats.tasiIndex.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${stats.tasiChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {stats.tasiChange >= 0 ? '▲' : '▼'} {Math.abs(stats.tasiChange).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAnalyzeTasi();
            }}
            className="relative z-10 mt-4 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            تحليل المؤشر
          </button>
        </div>

        {/* سيولة السوق */}
        <div className="glass p-5 rounded-[1.5rem] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden shadow-lg shadow-black/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">سيولة السوق</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-mono font-black text-white tracking-tighter leading-none mt-2">{formatLiquidity(stats.totalLiquidity)}</span>
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* القطاع الأكثر سيولة */}
        <div className="glass p-5 rounded-[1.5rem] border border-white/5 hover:border-amber-500/20 transition-all group relative overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-between h-full min-h-[150px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
          
          <div className="relative z-10">
            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest block mb-2">الأكثر سيولة الآن</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-black text-amber-500 leading-tight">{stats.topSector}</span>
              <span className="text-[10px] font-mono font-bold text-white bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30 shrink-0">
                {formatLiquidity(stats.topSectorValue)}
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-4 border-t border-white/5 overflow-hidden h-10 flex items-center bg-slate-900/20 rounded-b-xl -mx-2">
            <div className="flex gap-12 whitespace-nowrap animate-[ticker_25s_linear_infinite] hover:[animation-play-state:paused] cursor-default items-center px-4">
              {stats.sectors.concat(stats.sectors).map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 h-full">
                  <span className="text-[12px] text-slate-200 font-bold whitespace-nowrap">{s.name}</span>
                  <span className="text-[11px] text-emerald-400 font-mono font-black whitespace-nowrap bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    {formatLiquidity(s.value)}
                  </span>
                  <span className="text-slate-700 font-bold mx-2 opacity-30">/</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* حالة الشركات البصرية */}
        <div className="lg:col-span-2 glass p-5 rounded-[1.5rem] border border-white/5 flex flex-col justify-center gap-3 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stats.marketStatus === 'POSITIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">توزع حركة السوق</span>
            </div>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${stats.marketStatus === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
              {stats.marketStatus === 'POSITIVE' ? 'سوق إيجابي' : 'سوق سلبي'}
            </span>
          </div>

          <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
            <div className="h-full bg-gradient-to-l from-emerald-600 to-emerald-400 transition-all duration-1000" style={{ width: `${(stats.advancing / (stats.advancing + stats.declining + stats.unchanged)) * 100}%` }}></div>
            <div className="h-full bg-slate-700/30 transition-all duration-1000" style={{ width: `${(stats.unchanged / (stats.advancing + stats.declining + stats.unchanged)) * 100}%` }}></div>
            <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000" style={{ width: `${(stats.declining / (stats.advancing + stats.declining + stats.unchanged)) * 100}%` }}></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <span className="text-emerald-500 text-base font-black block leading-none">{stats.advancing}</span>
              <span className="text-[8px] text-slate-600 font-bold uppercase">صاعدة</span>
            </div>
            <div className="text-center border-x border-white/5">
              <span className="text-slate-400 text-base font-black block leading-none">{stats.unchanged}</span>
              <span className="text-[8px] text-slate-600 font-bold uppercase">مستقرة</span>
            </div>
            <div className="text-center">
              <span className="text-rose-500 text-base font-black block leading-none">{stats.declining}</span>
              <span className="text-[8px] text-slate-600 font-bold uppercase">هابطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الفلاتر والتحكم */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 p-2 bg-slate-900/30 rounded-[1.5rem] border border-white/5 backdrop-blur-sm overflow-x-auto">
        <div className="flex flex-nowrap md:flex-wrap items-center justify-start gap-1 min-w-max">
          {[
            { id: 'SCANNER', label: 'الفرص الفنية', icon: '✨' },
            { id: 'COMMUNITY', label: 'المجتمعات والبث', icon: '🎙️' },
            { id: 'NEWS', label: 'مركز الأخبار', icon: '📰' },
            { id: 'GAINERS', label: 'الأكثر ارتفاعاً', icon: '🚀' },
            { id: 'LOSERS', label: 'الأكثر انخفاضاً', icon: '🔻' },
            { id: 'VOLUME', label: 'الأكثر سيولة', icon: '💎' },
            { id: 'FINANCIAL', label: 'التحليل المالي', icon: '📊' },
            { id: 'CALCULATOR', label: 'الحاسبة', icon: '🧮' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as ViewMode)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                viewMode === mode.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="text-base">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
