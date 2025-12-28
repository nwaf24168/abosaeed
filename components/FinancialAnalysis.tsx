
import React, { useState, useEffect, useMemo, memo } from 'react';
import { StockData, FinancialData, AIFinancialHealth, FinancialStatementDeep } from '../types';
import { getDetailedFinancials, FINANCIAL_GLOSSARY, getImmediateFinancialSummary } from '../services/financialService';
import { getAIFinancialAnalysis } from '../services/geminiService';

interface FinancialAnalysisProps {
  stocks: StockData[];
}

const InfoIcon = memo(({ term, onClick }: { term: string, onClick: (term: string) => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick(term);
    }}
    className="inline-flex items-center justify-center w-5 h-5 mr-3 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20 active:scale-90"
  >
    ؟
  </button>
));

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ stocks }) => {
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [report, setReport] = useState<AIFinancialHealth | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [periodType, setPeriodType] = useState<'YEARLY' | 'QUARTERLY' | 'SEMI' | 'DIVIDENDS'>('YEARLY');
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStock) {
      const data = getDetailedFinancials(selectedStock);
      setFinancials(data);
      
      const instantReport = getImmediateFinancialSummary(data);
      setReport(instantReport);
      setIsAiMode(false);
    }
  }, [selectedStock]);

  const handleRunAiAnalysis = async () => {
    if (!selectedStock || !financials || loadingAi) return;
    
    setLoadingAi(true);
    try {
      const aiReport = await getAIFinancialAnalysis(selectedStock, financials);
      setReport(aiReport);
      setIsAiMode(true);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredStocks = useMemo(() => 
    stocks.filter(s => s.name.includes(search) || s.symbol.includes(search)),
    [stocks, search]
  );

  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000000) return (val / 1000000000).toFixed(2) + ' مليار';
    if (Math.abs(val) >= 1000000) return (val / 1000000).toFixed(1) + ' مليون';
    return val.toLocaleString();
  };

  const getActiveStatements = (): FinancialStatementDeep[] => {
    if (!financials) return [];
    if (periodType === 'YEARLY') return financials.yearlyStatements;
    if (periodType === 'QUARTERLY') return financials.quarterlyStatements;
    if (periodType === 'SEMI') return financials.semiAnnualStatements;
    return [];
  };

  const FinancialRow = ({ label, field, isMain = false, isSmall = false, isNegative = false }: { label: string, field: keyof FinancialStatementDeep, isMain?: boolean, isSmall?: boolean, isNegative?: boolean }) => (
    <tr className={`${isMain ? 'bg-blue-500/5' : ''} ${isSmall ? 'opacity-70' : ''} hover:bg-white/5 transition-colors`}>
      <td className={`p-4 px-8 text-sm font-bold ${isMain ? 'text-white' : 'text-slate-300'} flex items-center min-w-[250px]`}>
        {label} <InfoIcon term={field as string} onClick={setGlossaryTerm} />
      </td>
      {getActiveStatements().map(s => (
        <td key={s.period} className={`p-4 text-sm font-mono font-black text-center ${isMain ? (isNegative ? 'text-rose-400' : 'text-blue-400') : (isNegative ? 'text-rose-500' : 'text-white')}`}>
          {formatMoney(s[field] as number)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Glossary Modal */}
      {glossaryTerm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md" onClick={() => setGlossaryTerm(null)}>
          <div className="bg-[#0f172a] border border-blue-500/40 p-10 rounded-[2.5rem] max-w-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             <h4 className="text-white font-black text-2xl mb-4">{FINANCIAL_GLOSSARY[glossaryTerm]?.title}</h4>
             <p className="text-slate-300 text-lg leading-relaxed font-bold border-r-4 border-blue-500/30 pr-6 py-2">
               {FINANCIAL_GLOSSARY[glossaryTerm]?.definition}
             </p>
             <button onClick={() => setGlossaryTerm(null)} className="mt-10 w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95">فهمت</button>
          </div>
        </div>
      )}

      {/* Header Selection */}
      <div className="glass p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="shrink-0 w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-600/20">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex-1 space-y-2 text-center md:text-right">
          <h2 className="text-3xl font-black text-white tracking-tight">مركز التدقيق المالي المتطور</h2>
          <p className="text-slate-500 text-base font-bold">تحليل مهيكل ومعمق للقوائم والمركز المالي</p>
        </div>
        <div className="w-full md:w-96 relative">
          <input 
            type="text"
            value={selectedStock ? `${selectedStock.name} (${selectedStock.symbol})` : search}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              if (selectedStock) setSelectedStock(null);
            }}
            placeholder="ابحث عن شركة..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-bold"
          />
          {isDropdownOpen && !selectedStock && (
            <div className="absolute top-full left-0 right-0 mt-3 max-h-80 overflow-y-auto bg-slate-900 border border-white/10 rounded-3xl shadow-2xl z-[70]">
              {filteredStocks.map(s => (
                <div 
                  key={s.symbol}
                  onClick={() => { setSelectedStock(s); setIsDropdownOpen(false); }}
                  className="p-5 hover:bg-blue-600/10 cursor-pointer flex justify-between border-b border-white/5 group"
                >
                  <span className="font-bold text-slate-200 group-hover:text-blue-400">{s.name}</span>
                  <span className="font-mono text-slate-500 text-xs">{s.symbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!selectedStock ? (
        <div className="py-32 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto border border-white/5">
             <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">اختر شركة لبدء عملية التدقيق والتحليل المالي المباشر</p>
        </div>
      ) : financials && report && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 p-12 rounded-[3.5rem] border ${report.status === 'إيجابي' ? 'bg-emerald-500/5 border-emerald-500/20' : report.status === 'سلبي' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-900/40 border-white/5'} relative overflow-hidden shadow-2xl flex flex-col`}>
               <div className="relative z-10 space-y-8 flex-1 flex flex-col">
                 <div className="flex justify-between items-center">
                    <span className="px-5 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                      {isAiMode ? 'تقرير التدقيق المتقدم - نظام أبو سعيد' : 'تقرير الحوكمة المالي المباشر'}
                    </span>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-500 uppercase">التقييم الرقمي</span>
                       <span className={`text-3xl font-black ${report.status === 'إيجابي' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {report.rating}/10
                       </span>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-center">
                    <div className="animate-in fade-in duration-500 space-y-6">
                      <h3 className={`text-4xl font-black ${report.status === 'إيجابي' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {report.status === 'إيجابي' ? 'ملاءة مالية صلبة واستقرار تشغيلي' : report.status === 'سلبي' ? 'مركز مالي يتطلب تدقيقاً وحذراً' : 'أداء مالي متزن ومعتدل'}
                      </h3>
                      <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                        <p className="text-slate-200 text-lg leading-relaxed font-bold border-r-8 border-blue-500/40 pr-8 whitespace-pre-wrap text-justify">
                          {report.executiveSummary}
                        </p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="glass p-10 rounded-[3.5rem] border border-white/5 flex flex-col justify-between shadow-2xl">
               <div className="space-y-10">
                 <h4 className="text-white font-black text-base border-r-6 border-blue-500 pr-6 uppercase tracking-widest">المؤشرات المسجلة</h4>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'مكرر الربحية', value: financials.peRatio.toFixed(2), term: 'peRatio' },
                      { label: 'العائد على الحقوق', value: `${financials.roe.toFixed(2)}%`, term: 'roe' },
                      { label: 'نسبة السيولة', value: financials.currentRatio.toFixed(2), term: 'currentRatio' },
                      { label: 'هامش الربح', value: `${financials.profitMargin.toFixed(2)}%`, term: 'profitMargin' },
                      { label: 'عائد التوزيعات', value: `${financials.dividendYield.toFixed(2)}%`, term: 'dividendYield' },
                      { label: 'الديون / الحقوق', value: financials.debtToEquity.toFixed(2), term: 'debtToEquity' }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-900/80 p-5 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all text-center group cursor-help" onClick={() => setGlossaryTerm(item.term)}>
                        <span className="text-[9px] text-slate-500 font-black block mb-2 uppercase tracking-tighter group-hover:text-blue-400">
                          {item.label}
                        </span>
                        <div className="text-2xl font-mono font-black text-white">
                          {item.value}
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 py-6">
            {!isAiMode && (
              <button 
                onClick={handleRunAiAnalysis}
                disabled={loadingAi}
                className="group relative flex items-center gap-6 bg-gradient-to-r from-blue-700 to-slate-800 hover:from-blue-600 hover:to-slate-700 px-16 py-7 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50 border border-white/5"
              >
                {loadingAi ? (
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform border border-blue-500/20">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div className="text-right">
                  <span className="block text-white font-black text-xl">تحليل المركز المالي بنظام أبو سعيد الذكي</span>
                  <span className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">تفعيل خوارزمية التدقيق المعمق لتقييم الملاءة المالية</span>
                </div>
              </button>
            )}
            {isAiMode && (
              <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-8 py-4 rounded-2xl text-blue-400 font-black text-sm animate-in zoom-in-90 duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                تم اكتمال تقرير التدقيق المعمق بنجاح
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-4 h-14 bg-blue-600 rounded-full shadow-lg"></div>
                  <h3 className="text-4xl font-black text-white">البيانات المالية المسجلة</h3>
               </div>
               <div className="flex p-2 bg-slate-900 rounded-3xl border border-white/5">
                  {[
                    { id: 'YEARLY', label: 'سنوي' },
                    { id: 'SEMI', label: 'نصف سنوي' },
                    { id: 'QUARTERLY', label: 'ربع سنوي' },
                    { id: 'DIVIDENDS', label: 'التوزيعات والأرباح' }
                  ].map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setPeriodType(p.id as any)}
                      className={`px-8 py-4 rounded-[1.2rem] text-sm font-black transition-all ${periodType === p.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      {p.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="glass rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                  {periodType === 'DIVIDENDS' ? (
                    <div className="space-y-6">
                      {/* ملخص سياسة التوزيع */}
                      <div className="bg-blue-600/5 p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">📅</div>
                           <div>
                              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">سياسة توزيع الشركة</span>
                              <h4 className="text-white font-black text-xl">توزع الشركة أرباحها بشكل <span className="text-blue-400 font-black">{financials.distributionPolicy}</span></h4>
                              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">بناءً على سجل التوزيعات التاريخي المعتمد</p>
                           </div>
                        </div>
                        <div className="text-left flex flex-col items-end">
                           <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">عائد التوزيعات الحالي</span>
                           <span className="text-emerald-500 font-black text-3xl font-mono leading-none">{financials.dividendYield.toFixed(2)}%</span>
                        </div>
                      </div>

                      <table className="w-full text-right border-collapse">
                        <thead>
                          <tr className="bg-slate-900/95">
                            <th className="p-8 text-xs font-black text-white border-b border-white/5 uppercase px-10">الفترة</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">نوع التوزيع</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">كم التوزيع (ريال)</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">نسبة التوزيع (%)</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">سهم مقابل كل سهم</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">تاريخ الاستحقاق</th>
                            <th className="p-8 text-xs font-black text-white text-center border-b border-white/5">تاريخ التوزيع</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {financials.dividendsHistory.map((div, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors group">
                              <td className="p-6 px-10 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{div.period}</td>
                              <td className="p-6 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${div.type === 'CASH' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                  {div.type === 'CASH' ? 'نقدي' : 'أسهم منحة'}
                                </span>
                              </td>
                              <td className="p-6 text-center font-mono font-black text-white">
                                {div.type === 'CASH' ? `${div.amount.toFixed(2)} ر.س` : '-'}
                              </td>
                              <td className="p-6 text-center font-mono font-black text-emerald-400">
                                {div.percentage}%
                              </td>
                              <td className="p-6 text-center font-mono font-black text-blue-400">
                                {div.bonusRatio || '-'}
                              </td>
                              <td className="p-6 text-center font-mono font-bold text-slate-300">
                                {div.eligibilityDate}
                              </td>
                              <td className="p-6 text-center font-mono font-bold text-slate-400 bg-white/5">
                                {div.paymentDate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-900/95">
                          <th className="p-8 text-xs font-black text-slate-500 border-b border-white/5 uppercase px-10">البند المحاسبي</th>
                          {getActiveStatements().map(s => (
                            <th key={s.period} className="p-8 text-xs font-black text-white text-center border-b border-white/5 min-w-[180px] bg-white/5">{s.period}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr className="bg-blue-600/10"><td colSpan={100} className="p-5 text-[11px] font-black text-blue-400 uppercase px-10 tracking-widest">قائمة الدخل</td></tr>
                        <FinancialRow label="إجمالي الإيرادات" field="revenue" isMain />
                        <FinancialRow label="تكلفة المبيعات" field="cogs" isSmall isNegative />
                        <tr className="bg-emerald-600/15">
                          <td className="p-8 text-base font-black text-emerald-500 px-10">صافي الأرباح النهائية <InfoIcon term="netIncome" onClick={setGlossaryTerm} /></td>
                          {getActiveStatements().map(s => <td key={s.period} className="p-8 text-base font-mono font-black text-emerald-400 text-center">{formatMoney(s.netIncome)}</td>)}
                        </tr>
                        <FinancialRow label="ربحية السهم (EPS)" field="eps" isMain />

                        <tr className="bg-blue-600/10"><td colSpan={100} className="p-5 text-[11px] font-black text-blue-400 uppercase px-10 tracking-widest">المركز المالي</td></tr>
                        <FinancialRow label="إجمالي الأصول" field="totalAssets" isMain />
                        <FinancialRow label="إجمالي الالتزامات" field="totalLiabilities" isMain isNegative />
                        <FinancialRow label="حقوق المساهمين" field="totalEquity" isMain />

                        <tr className="bg-blue-600/10"><td colSpan={100} className="p-5 text-[11px] font-black text-blue-400 uppercase px-10 tracking-widest">التدفقات النقدية</td></tr>
                        <FinancialRow label="التدفق النقدي التشغيلي" field="operatingCashFlow" isMain />
                        <FinancialRow label="التدفق النقدي الحر" field="freeCashFlow" isMain />
                      </tbody>
                    </table>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalysis;
