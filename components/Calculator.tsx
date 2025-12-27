
import React, { useState } from 'react';
import { StockData } from '../types';

interface CalculatorProps {
  stocks: StockData[];
}

const Calculator: React.FC<CalculatorProps> = ({ stocks }) => {
  const [activeTab, setActiveTab] = useState<'PROFIT' | 'AVERAGE'>('PROFIT');
  
  // Searchable Dropdown States
  const [profitSearch, setProfitSearch] = useState('');
  const [isProfitDropdownOpen, setIsProfitDropdownOpen] = useState(false);
  
  const [avgSearch, setAvgSearch] = useState('');
  const [isAvgDropdownOpen, setIsAvgDropdownOpen] = useState(false);

  // Profit Calc State
  const [profitData, setProfitData] = useState({
    symbol: '',
    name: '',
    currentPrice: 0,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0
  });

  // Average Calc State
  const [averageData, setAverageData] = useState({
    symbol: '',
    name: '',
    currentPrice: 0,
    currentAvg: 0,
    currentQty: 0,
    newQty: 0,
    newPrice: 0
  });

  const calculateProfit = () => {
    const totalBuy = (profitData.quantity || 0) * (profitData.buyPrice || 0);
    const totalSell = (profitData.quantity || 0) * (profitData.sellPrice || 0);
    const profit = totalSell - totalBuy;
    const percentage = profitData.buyPrice > 0 ? (profit / totalBuy) * 100 : 0;
    return { profit, percentage, totalBuy, totalSell };
  };

  const calculateNewAverage = () => {
    const currentTotal = (averageData.currentAvg || 0) * (averageData.currentQty || 0);
    const newTotal = (averageData.newPrice || 0) * (averageData.newQty || 0);
    const totalQty = (averageData.currentQty || 0) + (averageData.newQty || 0);
    const newAvg = totalQty > 0 ? (currentTotal + newTotal) / totalQty : 0;
    
    // ربح/خسارة بناءً على السعر الحالي والمتوسط الجديد
    const potentialProfit = (averageData.currentPrice - newAvg) * totalQty;
    const potentialPercentage = newAvg > 0 ? ((averageData.currentPrice - newAvg) / newAvg) * 100 : 0;

    return { newAvg, totalQty, totalCost: currentTotal + newTotal, potentialProfit, potentialPercentage };
  };

  const pResults = calculateProfit();
  const aResults = calculateNewAverage();

  const filteredProfitStocks = stocks.filter(s => 
    s.name.includes(profitSearch) || s.symbol.includes(profitSearch)
  );

  const filteredAvgStocks = stocks.filter(s => 
    s.name.includes(avgSearch) || s.symbol.includes(avgSearch)
  );

  // دالة مساعدة لتقريب الأرقام لخانين عشريين فقط لتجنب الأرقام الطويلة الغريبة
  const round = (num: number) => Math.round(num * 100) / 100;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTab('PROFIT')}
            className={`flex-1 py-6 text-sm font-black transition-all ${activeTab === 'PROFIT' ? 'bg-emerald-500/10 text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-white/5'}`}
          >
            حساب الأرباح والخسائر
          </button>
          <button
            onClick={() => setActiveTab('AVERAGE')}
            className={`flex-1 py-6 text-sm font-black transition-all ${activeTab === 'AVERAGE' ? 'bg-blue-500/10 text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/5'}`}
          >
            حساب المتوسط السعري الجديد
          </button>
        </div>

        <div className="p-8 md:p-12">
          {activeTab === 'PROFIT' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {/* Searchable Stock Selector for Profit */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ابحث عن السهم</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={profitData.name ? `${profitData.name} (${profitData.symbol})` : profitSearch}
                      onFocus={() => { setIsProfitDropdownOpen(true); }}
                      onChange={(e) => {
                        setProfitSearch(e.target.value);
                        setProfitData({...profitData, name: '', symbol: ''});
                      }}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      placeholder="اكتب اسم السهم أو الرمز..."
                    />
                    {isProfitDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[60]">
                        {filteredProfitStocks.length > 0 ? filteredProfitStocks.map(s => (
                          <div
                            key={s.symbol}
                            onClick={() => {
                              const cleanPrice = round(s.price);
                              setProfitData({ 
                                ...profitData, 
                                symbol: s.symbol, 
                                name: s.name, 
                                currentPrice: s.price,
                                sellPrice: cleanPrice // وضع السعر نظيف بدون كسور طويلة
                              });
                              setIsProfitDropdownOpen(false);
                              setProfitSearch('');
                            }}
                            className="p-4 hover:bg-emerald-500/10 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0"
                          >
                            <span className="text-sm font-bold">{s.name}</span>
                            <span className="text-xs font-mono text-emerald-500">{s.symbol}</span>
                          </div>
                        )) : (
                          <div className="p-4 text-slate-500 text-center text-xs">لا توجد نتائج</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {profitData.currentPrice > 0 && (
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-500">سعر السهم الحالي:</span>
                    <span className="text-lg font-mono font-black text-white">{profitData.currentPrice.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">سعر الشراء</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={profitData.buyPrice || ''}
                      onChange={(e) => setProfitData({ ...profitData, buyPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">سعر البيع (المستهدف)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={profitData.sellPrice || ''}
                      onChange={(e) => setProfitData({ ...profitData, sellPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الكمية</label>
                  <input 
                    type="number" 
                    value={profitData.quantity || ''}
                    onChange={(e) => setProfitData({ ...profitData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Results View */}
              <div className="bg-emerald-500/5 rounded-3xl border border-emerald-500/10 p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">نتيجة العملية</p>
                  <div className="space-y-6">
                    <div>
                      <span className="text-slate-400 text-xs block mb-1">الربح / الخسارة الصافي</span>
                      <h4 className={`text-4xl font-black font-mono tracking-tighter ${pResults.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {pResults.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small className="text-sm">ر.س</small>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <span className="text-slate-500 text-[9px] block mb-1">النسبة المئوية</span>
                        <span className={`text-lg font-black font-mono ${pResults.percentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {pResults.percentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <span className="text-slate-500 text-[9px] block mb-1">إجمالي البيع</span>
                        <span className="text-lg font-black font-mono text-white">
                          {pResults.totalSell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mt-6 text-center leading-relaxed">
                  * الحسابات تقريبية ولا تشمل عمولة الوسيط أو ضريبة القيمة المضافة.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                {/* Searchable Stock Selector for Average */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ابحث عن السهم</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={averageData.name ? `${averageData.name} (${averageData.symbol})` : avgSearch}
                      onFocus={() => { setIsAvgDropdownOpen(true); }}
                      onChange={(e) => {
                        setAvgSearch(e.target.value);
                        setAverageData({...averageData, name: '', symbol: ''});
                      }}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      placeholder="اكتب اسم السهم أو الرمز..."
                    />
                    {isAvgDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[60]">
                        {filteredAvgStocks.length > 0 ? filteredAvgStocks.map(s => (
                          <div
                            key={s.symbol}
                            onClick={() => {
                              const cleanPrice = round(s.price);
                              setAverageData({ 
                                ...averageData, 
                                symbol: s.symbol, 
                                name: s.name, 
                                currentPrice: s.price,
                                newPrice: cleanPrice // وضع السعر نظيف بدون كسور طويلة
                              });
                              setIsAvgDropdownOpen(false);
                              setAvgSearch('');
                            }}
                            className="p-4 hover:bg-blue-500/10 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0"
                          >
                            <span className="text-sm font-bold">{s.name}</span>
                            <span className="text-xs font-mono text-blue-500">{s.symbol}</span>
                          </div>
                        )) : (
                          <div className="p-4 text-slate-500 text-center text-xs">لا توجد نتائج</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {averageData.currentPrice > 0 && (
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <span className="text-xs font-bold text-blue-500">سعر السهم الحالي:</span>
                    <span className="text-lg font-mono font-black text-white">{averageData.currentPrice.toFixed(2)} ر.س</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">المتوسط الحالي</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={averageData.currentAvg || ''}
                      onChange={(e) => setAverageData({ ...averageData, currentAvg: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الكمية الحالية</label>
                    <input 
                      type="number" 
                      value={averageData.currentQty || ''}
                      onChange={(e) => setAverageData({ ...averageData, currentQty: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-mono"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">سعر الدخول الجديد</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={averageData.newPrice || ''}
                      onChange={(e) => setAverageData({ ...averageData, newPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-blue-500/20 rounded-2xl px-5 py-4 text-white font-mono focus:ring-2 focus:ring-blue-500/40"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">الكمية الجديدة</label>
                    <input 
                      type="number" 
                      value={averageData.newQty || ''}
                      onChange={(e) => setAverageData({ ...averageData, newQty: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900/50 border border-blue-500/20 rounded-2xl px-5 py-4 text-white font-mono focus:ring-2 focus:ring-blue-500/40"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Results View */}
              <div className="bg-blue-500/5 rounded-3xl border border-blue-500/10 p-8 flex flex-col justify-between">
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">المتوسط الجديد المتوقع</p>
                    <div className="space-y-2">
                      <span className="text-slate-400 text-xs block">سعر التكلفة المعدل</span>
                      <h4 className="text-4xl font-black font-mono tracking-tighter text-blue-400">
                        {aResults.newAvg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small className="text-sm">ر.س</small>
                      </h4>
                    </div>
                  </div>

                  {averageData.currentPrice > 0 && (
                    <div className={`p-5 rounded-2xl border ${aResults.potentialProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-70">الربح/الخسارة بالمتوسط الجديد</p>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-black font-mono text-white">
                          {aResults.potentialProfit >= 0 ? '+' : ''}{aResults.potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm font-black font-mono ${aResults.potentialProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {aResults.potentialPercentage >= 0 ? '+' : ''}{aResults.potentialPercentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <span className="text-slate-500 text-[9px] block mb-1">إجمالي الأسهم</span>
                      <span className="text-lg font-black font-mono text-white">
                        {aResults.totalQty.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <span className="text-slate-500 text-[9px] block mb-1">إجمالي التكلفة</span>
                      <span className="text-lg font-black font-mono text-white">
                        {aResults.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <p className="text-[11px] text-blue-200 text-center font-bold">
                    {averageData.currentAvg > 0 ? (
                      <>سيتحسن متوسطك من <span className="text-white">{averageData.currentAvg.toFixed(2)}</span> إلى <span className="text-white">{aResults.newAvg.toFixed(2)}</span></>
                    ) : (
                      <>أدخل بياناتك الحالية لحساب تحسن المتوسط</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
