
import React from 'react';
import { MarketStats } from '../types';
import { calculateTechnicalAnalysis } from '../services/taService';

interface TasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: MarketStats;
}

const TasiModal: React.FC<TasiModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  // دالة تنسيق السيولة
  const formatLiquidity = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + ' مليار';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + ' مليون';
    return val.toLocaleString() + ' ر.س';
  };

  // محاكاة بيانات تقنية للمؤشر بناءً على حالته الحالية
  const mockTasiData = {
    symbol: 'TASI',
    name: 'تاسي',
    price: stats.tasiIndex,
    change: stats.tasiChange,
    open: stats.tasiIndex - 15,
    high: stats.tasiIndex + 30,
    low: stats.tasiIndex - 20,
    close: stats.tasiIndex,
    volume: stats.totalLiquidity / 100,
    timestamp: ''
  };

  const ta = calculateTechnicalAnalysis(mockTasiData as any);
  
  const getLiquidityStatus = () => {
    if (stats.totalLiquidity > 6000000000) return { label: 'سيولة عالية جداً', color: 'text-emerald-400', icon: '💎' };
    if (stats.totalLiquidity > 4000000000) return { label: 'سيولة نشطة', color: 'text-emerald-400', icon: '🔥' };
    if (stats.totalLiquidity > 2500000000) return { label: 'سيولة متوسطة', color: 'text-amber-400', icon: '⚖️' };
    return { label: 'سيولة ضعيفة', color: 'text-rose-400', icon: '⚠️' };
  };

  const liq = getLiquidityStatus();

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#070b14]/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg glass rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر إغلاق علوي ذكي */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-20 text-slate-400 hover:text-white transition-all p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 shadow-xl active:scale-90"
          aria-label="إغلاق"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600/20 via-blue-600/5 to-transparent p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-none">موجز مؤشر تاسي</h2>
              <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                رصد فني لحظي
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Main Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-3">
               <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">المسار والسعر</span>
               <div className="space-y-1">
                 <div className="text-xl font-mono font-black text-white tracking-tighter">
                   {stats.tasiIndex.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </div>
                 <div className={`text-[10px] font-black px-3 py-1 rounded-full inline-block ${ta.status === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500' : ta.status === 'NEGATIVE' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                   {ta.status === 'POSITIVE' ? 'صاعد إيجابي' : ta.status === 'NEGATIVE' ? 'هابط سلبي' : 'عرضي محايد'}
                 </div>
               </div>
            </div>
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-3">
               <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">السيولة والحالة</span>
               <div className="space-y-1">
                 <div className="text-lg font-mono font-black text-blue-400 tracking-tighter">
                   {formatLiquidity(stats.totalLiquidity)}
                 </div>
                 <div className={`text-[10px] font-black flex items-center justify-center gap-1 ${liq.color}`}>
                   <span>{liq.icon}</span>
                   {liq.label}
                 </div>
               </div>
            </div>
          </div>

          {/* S&R Levels */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] flex-1 bg-gradient-to-l from-emerald-500/30 to-transparent"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">أهم المستويات السعرية</span>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-rose-500/30 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {ta.support.map((s, i) => (
                  <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex justify-between items-center group hover:bg-emerald-500/10 transition-all">
                    <span className="text-[10px] text-emerald-500/70 font-black">دعم {i+1}</span>
                    <span className="text-white font-mono font-black">{s.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {ta.resistance.map((r, i) => (
                  <div key={i} className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl flex justify-between items-center group hover:bg-rose-500/10 transition-all">
                    <span className="text-[10px] text-rose-500/70 font-black">مقاومة {i+1}</span>
                    <span className="text-white font-mono font-black">{r.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Strategy Note */}
          <div className="p-5 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 relative group">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-black text-xs block mb-1">توجيه أبو سعيد اللحظي:</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  المؤشر في منطقة {ta.trend === 'UP' ? 'ممتازة لزيادة الكميات' : 'حرجة تتطلب مراقبة السيولة'}. {ta.status === 'POSITIVE' ? 'ننصح بمراقبة اختراق المقاومة الأولى للهدف القادم.' : 'يفضل التريث حتى الثبات فوق مستوى الدعم الأول.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
          >
            فهمت، العودة للسوق
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasiModal;
