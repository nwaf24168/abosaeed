
import React, { useState, useEffect } from 'react';
import { StockData, TechnicalAnalysis, AIAnalysis } from '../types';
import { calculateTechnicalAnalysis } from '../services/taService';
import { getAIAnalysis } from '../services/geminiService';

interface StockAnalyzerProps {
  stock: StockData;
}

const StockAnalyzer: React.FC<StockAnalyzerProps> = ({ stock }) => {
  const [ta, setTa] = useState<TechnicalAnalysis | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      const technicals = calculateTechnicalAnalysis(stock);
      setTa(technicals);
      const ai = await getAIAnalysis(stock, technicals);
      setAiResult(ai);
      setLoading(false);
    };
    analyze();
  }, [stock.symbol]);

  if (loading || !ta || !aiResult) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        <p>جاري تحليل السهم واستدعاء ذكاء أبو سعيد...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status.includes('إيجابي')) return 'text-emerald-500 bg-emerald-500/10';
    if (status.includes('سلبي')) return 'text-rose-500 bg-rose-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Left Column: Summary & AI */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{stock.name}</h2>
              <p className="text-slate-400 font-mono">{stock.symbol}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-bold ${getStatusColor(aiResult.status)}`}>
              {aiResult.status === 'إيجابي' ? '✅ إيجابي' : aiResult.status === 'سلبي' ? '❌ سلبي' : '⚠️ محايد'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400">السعر الحالي</span>
              <span className="text-white font-mono text-lg">{stock.price.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400">التغير اللحظي</span>
              <span className={`font-mono ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">قرار الذكاء</span>
              <span className={`px-3 py-1 rounded text-sm font-bold ${aiResult.recommendation === 'دخول' ? 'bg-emerald-600' : aiResult.recommendation === 'خروج' ? 'bg-rose-600' : 'bg-slate-700'}`}>
                {aiResult.recommendation}
              </span>
            </div>
          </div>
        </div>

        {/* AI Note */}
        <div className="glass p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L20.15 19H3.85L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
          </div>
          <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            ملاحظة أبو سعيد الذكية
          </h3>
          <p className="text-slate-200 leading-relaxed text-sm">
            {aiResult.note}
          </p>
        </div>

        {/* Local Disclaimer for Analysis */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
           <p className="text-[11px] text-slate-500 leading-normal text-justify">
             <span className="text-amber-500/70 font-bold">تنبيه:</span> لا تعتبر خطة التداول المقترحة أعلاه (أهداف/وقف خسارة) نصيحة مالية ملزمة. السوق السعودي متقلب، والنتائج التاريخية لا تضمن الأرباح المستقبلية. استشر مستشارك المالي قبل اتخاذ أي قرار استثماري.
           </p>
        </div>
      </div>

      {/* Middle Column: Targets & Technicals */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trading Plan */}
        <div className="glass p-6 rounded-2xl border border-slate-700 h-fit">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            خطة التداول
          </h3>
          <div className="space-y-4">
            {aiResult.targets.map((target, idx) => (
              <div key={idx} className="bg-slate-900/50 p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="text-slate-400">هدف {idx + 1}</span>
                <span className="text-emerald-400 font-bold">{target.toFixed(2)}</span>
              </div>
            ))}
            <div className="bg-rose-500/10 p-3 rounded-xl flex justify-between items-center border border-rose-500/30">
              <span className="text-rose-400">وقف الخسارة</span>
              <span className="text-rose-500 font-bold">{aiResult.stopLoss.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">مبني على كسر الدعم وتغير هيكل السعر</p>
          </div>
        </div>

        {/* Technical Zones */}
        <div className="glass p-6 rounded-2xl border border-slate-700 h-fit">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
            المناطق الفنية
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-1">RSI (14)</p>
                <p className={`font-bold ${ta.rsi > 70 ? 'text-rose-500' : ta.rsi < 30 ? 'text-emerald-500' : 'text-slate-200'}`}>
                  {ta.rsi.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-1">الاتجاه</p>
                <p className="text-emerald-400 font-bold">{ta.trend === 'UP' ? 'صاعد' : ta.trend === 'DOWN' ? 'هابط' : 'عرضي'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-emerald-500 font-bold">مستويات الدعم</p>
              <div className="flex gap-2">
                {ta.support.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">{s.toFixed(2)}</span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-rose-500 font-bold">مستويات المقاومة</p>
              <div className="flex gap-2">
                {ta.resistance.map((r, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">{r.toFixed(2)}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Simulation Area */}
        <div className="md:col-span-2 glass p-4 rounded-2xl border border-slate-700 h-64 flex items-center justify-center bg-slate-900/30">
          <div className="text-center">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
            <p className="text-slate-500 text-xs">مساحة الرسم البياني (TradingView Lightweight Charts)</p>
            <p className="text-slate-600 text-[10px] mt-1">يتم الربط برمجياً مع MetaTrader 5 للحصول على شموع دقيقة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalyzer;
