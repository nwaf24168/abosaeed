
import React, { useState, useEffect } from 'react';
import { TASI_STOCKS } from '../constants';
import { StockData, MarketStats, ViewMode, SectorLiquidity, NewsItem, LiveRoom } from '../types';
import StockAnalyzer from './StockAnalyzer';
import Scanner from './Scanner';
import MarketOverview from './MarketOverview';
import Calculator from './Calculator';
import FinancialAnalysis from './FinancialAnalysis';
import NewsSection from './NewsSection';
import CommunityHub from './CommunityHub';
import LiveRoomView from './LiveRoomView';
import TasiModal from './TasiModal';
import LegalModal from './LegalModal';
import AiLogo from './AiLogo';
import { fetchLiveStocks } from '../services/dataService';
import { fetchMarketNews } from '../services/newsService';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<LiveRoom | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('SCANNER');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTasiModalOpen, setIsTasiModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  const [marketStats, setMarketStats] = useState<MarketStats>({
    tasiIndex: 12450.32,
    tasiChange: 0.45,
    totalLiquidity: 4500000000,
    advancing: 0,
    declining: 0,
    unchanged: 0,
    marketStatus: 'NEUTRAL',
    topSector: 'البنوك',
    topSectorValue: 1200000000,
    sectors: []
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchMarketNews();
      setNews(data);
    };
    loadNews();
  }, []);

  useEffect(() => {
    const updatePrices = async () => {
      let currentStocks: StockData[] = [];
      try {
        const liveData = await fetchLiveStocks();
        currentStocks = liveData.map(ls => ({
          ...ls,
          name: TASI_STOCKS.find(ts => ts.symbol === ls.symbol)?.name || ls.symbol
        }));
        setStocks(currentStocks);
        setIsLive(true);
      } catch (e) {
        setIsLive(false);
        currentStocks = TASI_STOCKS.map(s => {
          const basePrice = s.symbol === '2222' ? 30 : s.symbol === '1120' ? 70 : 50;
          const current = basePrice + (Math.random() * 2 - 1);
          return {
            ...s,
            price: current,
            change: (Math.random() * 2 - 1),
            open: current - 0.5,
            high: current + 0.8,
            low: current - 0.7,
            close: current,
            volume: Math.floor(Math.random() * 5000000),
            timestamp: new Date().toLocaleTimeString('ar-SA')
          };
        });
        setStocks(currentStocks);
      }

      const adv = currentStocks.filter(s => s.change > 0).length;
      const dec = currentStocks.filter(s => s.change < 0).length;
      const liq = currentStocks.reduce((acc, s) => acc + (s.price * s.volume), 0);
      
      const allSectors: SectorLiquidity[] = [
        { name: 'البنوك', value: liq * 0.35 },
        { name: 'الطاقة', value: liq * 0.25 },
        { name: 'المواد الأساسية', value: liq * 0.15 },
        { name: 'الاتصالات', value: liq * 0.10 }
      ].sort((a, b) => b.value - a.value);

      setMarketStats({
        tasiIndex: 12450 + (adv - dec) * 2.5,
        tasiChange: ((adv - dec) / currentStocks.length) * 1.8,
        totalLiquidity: liq,
        advancing: adv,
        declining: dec,
        unchanged: currentStocks.length - (adv + dec),
        marketStatus: adv > dec ? 'POSITIVE' : 'NEGATIVE',
        topSector: allSectors[0].name,
        topSectorValue: allSectors[0].value,
        sectors: allSectors.slice(1) 
      });
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return `${days[date.getDay()]}، ${date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  const renderContent = () => {
    if (selectedRoom) {
      return <LiveRoomView room={selectedRoom} onExit={() => setSelectedRoom(null)} stocks={stocks} />;
    }
    if (selectedStock) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <button 
            onClick={() => setSelectedStock(null)}
            className="group flex items-center gap-3 text-slate-400 hover:text-blue-400 transition-all font-black text-xs bg-slate-900/40 px-6 py-3 rounded-xl border border-white/5 shadow-lg"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 12H5M12 19l-7-7 7-7" /></svg>
            العودة للوحة الرئيسية
          </button>
          <StockAnalyzer stock={selectedStock} />
        </div>
      );
    }
    if (viewMode === 'CALCULATOR') return <Calculator stocks={stocks} />;
    if (viewMode === 'FINANCIAL') return <FinancialAnalysis stocks={stocks} />;
    if (viewMode === 'NEWS') return <NewsSection />;
    if (viewMode === 'COMMUNITY') return <CommunityHub onJoinRoom={setSelectedRoom} />;
    return <Scanner stocks={stocks} onSelect={setSelectedStock} viewMode={viewMode} />;
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col text-slate-200">
      <TasiModal isOpen={isTasiModalOpen} onClose={() => setIsTasiModalOpen(false)} stats={marketStats} />
      <LegalModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />

      <header className="sticky top-0 z-50 glass border-b border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => {setSelectedStock(null); setSelectedRoom(null); setViewMode('SCANNER');}}>
              <AiLogo size="md" />
              <div className="hidden md:block">
                <h1 className="text-xl font-black text-white leading-none tracking-tight">منصة أبو سعيد</h1>
                <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">SMART TRADING SYSTEM</p>
              </div>
            </div>
            <div className="relative group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن شركة أو رمز..."
                className="bg-slate-900/60 border border-white/5 rounded-2xl pr-12 pl-6 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64 lg:w-[400px]"
              />
              <svg className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-white/10 pr-6">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{formatDate(currentTime)}</span>
              <span className="text-2xl font-mono font-black text-white tracking-tighter">{currentTime.toLocaleTimeString('ar-SA')}</span>
            </div>
            <button onClick={onLogout} className="p-3 bg-slate-900/60 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-white/5 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 md:p-10 space-y-12">
        {!selectedStock && !selectedRoom && <MarketOverview stats={marketStats} viewMode={viewMode} setViewMode={setViewMode} onAnalyzeTasi={() => setIsTasiModalOpen(true)} />}
        {renderContent()}
      </main>

      <footer className="glass border-t border-white/5 overflow-hidden flex flex-col shadow-2xl relative">
        <div className="h-11 flex items-center border-b border-white/5 bg-slate-900/50 ticker-container">
          <div className="ticker-content flex items-center gap-16">
            {[...stocks, ...stocks].map((s, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 border-l border-white/5 h-full">
                <span className="text-slate-600 font-mono text-[9px] font-black">{s.symbol}</span>
                <span className="text-slate-200 font-black text-xs">{s.name}</span>
                <span className="text-white font-mono font-black text-sm">{s.price.toFixed(2)}</span>
                <span className={`font-black text-[9px] px-1.5 py-0.5 rounded ${s.change >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                  {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-11 flex items-center bg-blue-900/20 ticker-container">
          <div className="bg-blue-600 text-white text-[10px] font-black px-6 h-full flex items-center z-20 shadow-xl uppercase tracking-widest shrink-0">
            أبرز الأخبار
          </div>
          <div className="ticker-content flex items-center gap-32">
            {[...news, ...news].map((n, idx) => (
              <div key={idx} className="flex items-center gap-4 cursor-pointer group">
                <span className={`w-2 h-2 rounded-full ${n.category === 'URGENT' ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-blue-500'}`}></span>
                <span className="text-slate-200 font-bold text-xs group-hover:text-blue-400 transition-colors">
                  {n.title}
                </span>
                <span className="text-slate-600 font-black text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">[{n.source}]</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
