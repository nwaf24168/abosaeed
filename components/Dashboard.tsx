
import React, { useState, useEffect } from 'react';
import { TASI_STOCKS } from '../constants';
import { StockData, MarketStats, ViewMode, NewsItem, LiveRoom } from '../types';
import StockAnalyzer from './StockAnalyzer';
import Scanner from './Scanner';
import MarketOverview from './MarketOverview';
import Calculator from './Calculator';
import FinancialAnalysis from './FinancialAnalysis';
import NewsSection from './NewsSection';
import CommunityHub from './CommunityHub';
import LiveRoomView from './LiveRoomView';
import TasiModal from './TasiModal';
import AiLogo from './AiLogo';
import { fetchLiveStocks } from '../services/dataService';
import { fetchMarketNews } from '../services/newsService';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<LiveRoom | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('SCANNER');
  const [isTasiModalOpen, setIsTasiModalOpen] = useState(false);

  const [marketStats, setMarketStats] = useState<MarketStats>({
    tasiIndex: 12450.32,
    tasiChange: 0.45,
    totalLiquidity: 4.2 * 1000000000,
    advancing: 110,
    declining: 85,
    unchanged: 32,
    marketStatus: 'POSITIVE',
    topSector: 'البنوك',
    topSectorValue: 1200000000,
    sectors: []
  });

  useEffect(() => {
    const updateData = async () => {
      try {
        const liveData = await fetchLiveStocks();
        const currentStocks = liveData.map(ls => ({
          ...ls,
          name: TASI_STOCKS.find(ts => ts.symbol === ls.symbol)?.name || ls.symbol
        }));
        setStocks(currentStocks);
        
        const n = await fetchMarketNews();
        setNews(n);
      } catch (e) {
        setStocks(TASI_STOCKS.map(s => ({
          ...s,
          price: 50 + Math.random() * 10,
          change: (Math.random() * 4 - 2),
          open: 50, high: 55, low: 48, close: 50, volume: 1000000 + Math.random() * 5000000, timestamp: ''
        })));
      }
    };
    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine if we are in any scanner-related mode
  const isScannerView = ['SCANNER', 'GAINERS', 'LOSERS', 'VOLUME'].includes(viewMode);

  const renderContent = () => {
    if (selectedRoom) return <LiveRoomView room={selectedRoom} onExit={() => setSelectedRoom(null)} stocks={stocks} />;
    
    if (selectedStock) {
      return (
        <div className="page-transition px-4 pb-24">
          <button 
            onClick={() => setSelectedStock(null)}
            className="flex items-center gap-2 text-blue-400 font-bold mb-6 pt-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            الرجوع للقائمة
          </button>
          <StockAnalyzer stock={selectedStock} />
        </div>
      );
    }

    return (
      <div className="page-transition px-4 pb-32">
        <MarketOverview stats={marketStats} viewMode={viewMode} setViewMode={setViewMode} onAnalyzeTasi={() => setIsTasiModalOpen(true)} />
        <div className="mt-8">
          {isScannerView && <Scanner stocks={stocks} onSelect={setSelectedStock} viewMode={viewMode} setViewMode={setViewMode} />}
          {viewMode === 'NEWS' && <NewsSection />}
          {viewMode === 'CALCULATOR' && <Calculator stocks={stocks} />}
          {viewMode === 'FINANCIAL' && <FinancialAnalysis stocks={stocks} />}
          {viewMode === 'COMMUNITY' && <CommunityHub onJoinRoom={setSelectedRoom} />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col overflow-x-hidden">
      <TasiModal isOpen={isTasiModalOpen} onClose={() => setIsTasiModalOpen(false)} stats={marketStats} />

      <header className="sticky top-0 z-[100] glass border-b border-white/5 safe-area-top">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AiLogo size="sm" />
            <span className="text-lg font-black text-white tracking-tight">أبو سعيد</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-500/20">
               LIVE MT5
             </div>
             <button onClick={onLogout} className="p-2 text-slate-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {!selectedRoom && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] glass border-t border-white/10 safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-around items-center h-20 px-2">
            {[
              { id: 'SCANNER', label: 'الرئيسية', icon: '🏠' },
              { id: 'NEWS', label: 'الأخبار', icon: '📰' },
              { id: 'COMMUNITY', label: 'المجتمع', icon: '💬' },
              { id: 'FINANCIAL', label: 'المالية', icon: '📊' },
              { id: 'CALCULATOR', label: 'الحاسبة', icon: '🧮' },
            ].map((tab) => {
              const isActive = (tab.id === 'SCANNER' && isScannerView) || viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setViewMode(tab.id as ViewMode); setSelectedStock(null); }}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-full ${isActive ? 'text-blue-500' : 'text-slate-500'}`}
                >
                  <span className={`text-xl transition-transform ${isActive ? 'scale-125 -translate-y-1' : ''}`}>{tab.icon}</span>
                  <span className="text-[10px] font-black">{tab.label}</span>
                  {isActive && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"></div>}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Dashboard;
