
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { fetchMarketNews } from '../services/newsService';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchMarketNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  const filteredNews = news.filter(item => {
    if (filter === 'ALL') return true;
    return item.category === filter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'URGENT': return 'bg-rose-500 text-white animate-pulse';
      case 'COMPANY': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'MARKET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'URGENT': return 'خبر عاجل';
      case 'COMPANY': return 'أخبار الشركات';
      case 'MARKET': return 'أخبار السوق';
      case 'ECONOMY': return 'اقتصاد';
      default: return 'عام';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* News Detail Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-[#0f172a] border border-white/10 p-10 rounded-[3rem] max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-600 to-emerald-500"></div>
            
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 left-6 text-slate-500 hover:text-white bg-white/5 p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getCategoryBadge(selectedNews.category)}`}>
                  {getCategoryName(selectedNews.category)}
                </span>
                <span className="text-slate-500 text-xs font-bold">{selectedNews.time}</span>
              </div>

              <h3 className="text-3xl font-black text-white leading-tight">
                {selectedNews.title}
              </h3>

              <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                <p className="text-slate-300 text-lg leading-relaxed font-bold text-justify whitespace-pre-wrap">
                  {selectedNews.content}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <span className="text-slate-500 text-xs font-black uppercase tracking-widest">المصدر: {selectedNews.source}</span>
                </div>
                {selectedNews.relatedStocks && (
                  <div className="flex gap-2">
                    {selectedNews.relatedStocks.map(s => (
                      <span key={s} className="bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-xl border border-blue-500/20 text-xs font-black">
                        #{s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 p-8 glass rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-600/20 text-3xl">📰</div>
          <div>
            <h2 className="text-3xl font-black text-white">مركز أخبار أبو سعيد</h2>
            <p className="text-slate-500 font-bold text-sm">رصد حي وشامل لكل ما يهم المستثمر في السوق السعودي</p>
          </div>
        </div>
        
        <div className="flex p-2 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">
          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'URGENT', label: 'عاجل' },
            { id: 'COMPANY', label: 'شركات' },
            { id: 'MARKET', label: 'السوق' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${filter === f.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-500 font-black animate-pulse">جاري جمع الأخبار من المصادر...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredNews.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getCategoryBadge(item.category)}`}>
                    {getCategoryName(item.category)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item.time}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-relaxed line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed font-bold line-clamp-2">
                  {item.content}
                </p>

                {item.relatedStocks && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.relatedStocks.map(stock => (
                      <span key={stock} className="bg-slate-900 border border-white/5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold text-blue-400">
                        {stock}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">المصدر: {item.source}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedNews(item); }}
                  className="text-blue-500 font-black text-xs hover:text-blue-400 flex items-center gap-2"
                >
                  قراءة المزيد
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;
