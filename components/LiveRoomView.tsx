
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LiveRoom, ChatMessage, Participant, StockData } from '../types';

interface LiveRoomViewProps {
  room: LiveRoom;
  onExit: () => void;
  stocks: StockData[];
  isHost?: boolean;
}

const LiveRoomView: React.FC<LiveRoomViewProps> = ({ room, onExit, stocks, isHost = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'خالد م.', text: 'أبو سعيد، شارت الراجحي كأنه عطى دخول؟', time: '14:20' },
    { id: '2', user: 'أبو سعيد', text: 'نعم، اختراق 72.50 بسيولة ممتازة يؤكد الإيجابية.', time: '14:21', isHost: true },
    { id: '3', user: 'سارة عبدالله', text: 'ممكن تحليل سريع لسهم لوبريف؟', time: '14:22' },
    { id: '4', user: 'متداول 1', text: 'الله يعطيك العافية يا أبو سعيد مجهود جبار', time: '14:23' },
  ]);
  
  const [speakers] = useState<Participant[]>([
    { id: 'host-1', name: 'أبو سعيد', isSpeaking: true, isHost: true },
    { id: 'sp-1', name: 'المحلل ناصر', isSpeaking: false, isHost: false },
    { id: 'sp-2', name: 'عبدالله السعد', isSpeaking: false, isHost: false },
    { id: 'sp-3', name: 'فهد', isSpeaking: false, isHost: false },
  ]);

  const [selectedStockSymbol, setSelectedStockSymbol] = useState('1120'); 
  const [isStockMenuOpen, setIsStockMenuOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [hearts, setHearts] = useState<{ id: number; left: number; color: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0], 
    [stocks, selectedStockSymbol]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      user: 'أنت',
      text: inputText,
      time: 'الآن'
    }]);
    setInputText('');
  };

  const addHeart = () => {
    const id = Date.now();
    const left = 50 + Math.random() * 40;
    const colors = ['#f43f5e', '#fbbf24', '#3b82f6', '#10b981'];
    setHearts(prev => [...prev, { id, left, color: colors[Math.floor(Math.random() * colors.length)] }]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 2000);
  };

  const formatVolume = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    return (val / 1000).toFixed(0) + 'K';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-sans">
      
      {/* الـ Container الأساسي للجوال */}
      <div className="relative w-full max-w-[500px] h-full lg:h-[95vh] lg:rounded-[3rem] overflow-hidden bg-[#070b14] flex flex-col shadow-2xl border border-white/5">
        
        {/* شريط معلومات السهم العلوي - وضوح تام */}
        <div className="absolute top-[85px] left-0 right-0 z-50 px-4 flex items-center justify-between pointer-events-none">
           <div 
              onClick={() => isHost && setIsStockMenuOpen(!isStockMenuOpen)}
              className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl cursor-pointer active:scale-95 transition-all"
            >
               <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-sm shadow-inner">📊</div>
               <div className="flex flex-col min-w-[100px]">
                  <div className="flex items-center gap-2">
                     <span className="text-white font-black text-[13px] leading-none">{activeStock.name}</span>
                     <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-white/5 ${activeStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                       {activeStock.change >= 0 ? '▲' : '▼'}{Math.abs(activeStock.change).toFixed(2)}%
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                     <span className="text-[10px] text-white/80 font-mono font-black">{activeStock.price.toFixed(2)}</span>
                     <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">SAR</span>
                  </div>
               </div>
           </div>

           <div className="pointer-events-auto bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/20 px-4 py-2 rounded-2xl flex flex-col items-end">
              <span className="text-[8px] text-emerald-400/80 font-black uppercase tracking-widest leading-none mb-1">السيولة اللحظية</span>
              <span className="text-white font-mono font-black text-[12px] leading-none">{formatVolume(activeStock.volume)}</span>
           </div>

           {isStockMenuOpen && (
             <div className="absolute top-full left-4 w-64 bg-slate-900/98 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 mt-2 pointer-events-auto">
                <div className="p-4 bg-white/5 border-b border-white/5">
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">تغيير سهم التحليل</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                   {stocks.map(s => (
                     <button 
                       key={s.symbol}
                       onClick={() => { setSelectedStockSymbol(s.symbol); setIsStockMenuOpen(false); }}
                       className="w-full flex items-center justify-between p-4 hover:bg-blue-600/20 border-b border-white/5 last:border-0 transition-all"
                     >
                        <span className="text-white font-bold text-sm">{s.name}</span>
                        <span className="text-slate-500 text-[10px] font-mono">{s.symbol}</span>
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* معلومات المضيف والمشاهدين */}
        <div className="absolute top-0 left-0 right-0 z-[60] p-4 flex items-center justify-between bg-gradient-to-b from-black/95 via-black/40 to-transparent pt-8">
           <div className="flex items-center gap-2 bg-black/40 backdrop-blur-2xl rounded-full pl-4 pr-1 py-1 border border-white/10 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-sm border-2 border-white/20">👨‍🏫</div>
              <div className="flex flex-col">
                 <span className="text-white text-[11px] font-black leading-tight">أبو سعيد</span>
                 <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-tight">5.2K LIKES</span>
                 </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-full mr-2 transition-all shadow-lg active:scale-95">متابعة</button>
           </div>

           <div className="flex items-center gap-2">
              <div className="bg-black/40 backdrop-blur-2xl px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-black text-white flex items-center gap-2">
                 <span className="text-blue-400">👥</span>
                 <span>125</span>
              </div>
              <button onClick={onExit} className="w-10 h-10 bg-black/40 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-rose-600 transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
        </div>

        {/* منطقة البث والشارت */}
        <div className="flex-1 relative bg-[#0a0f1d] flex items-center justify-center">
           <div className="absolute inset-0 flex items-center justify-center -translate-y-24">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}></div>
              <svg className="w-full h-[55%] text-blue-500/20" preserveAspectRatio="none" viewBox="0 0 200 100">
                 <path d="M0,80 Q50,95 80,65 T140,25 T200,45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3" />
                 <path d="M0,80 Q50,95 80,65 T140,25 T200,45" fill="none" stroke="url(#line-grad)" strokeWidth="2" className="animate-dash" />
                 <defs>
                   <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="transparent" />
                     <stop offset="100%" stopColor="#3b82f6" />
                   </linearGradient>
                 </defs>
              </svg>
           </div>

           {/* شبكة المتحدثين الجانبية */}
           <div className="absolute right-4 top-48 flex flex-col gap-5 z-40">
              {speakers.map(s => (
                <div key={s.id} className="relative">
                   <div className={`w-13 h-13 rounded-full bg-slate-900 border-2 transition-all duration-300 flex items-center justify-center text-xl overflow-hidden ${s.isSpeaking ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110' : 'border-white/10 opacity-70'}`}>
                      {s.isHost ? '👨‍🏫' : '👤'}
                      {s.isSpeaking && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                           <div className="flex gap-[1.5px] items-center">
                             <div className="w-[2px] h-2.5 bg-white animate-audio-pulse-1"></div>
                             <div className="w-[2px] h-1.5 bg-white animate-audio-pulse-2"></div>
                             <div className="w-[2px] h-2.5 bg-white animate-audio-pulse-3"></div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
           
           {/* قلوب طائرة */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden z-[45]">
              {hearts.map(h => (
                <div key={h.id} className="heart-particle" style={{ left: `${h.left}%`, bottom: '100px', color: h.color }}>
                  <svg className="w-8 h-8 filter drop-shadow-xl" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
              ))}
           </div>

           {/* منطقة الشات - توازن ووزنية مثالية */}
           <div className="absolute bottom-20 left-4 right-16 z-[42] h-[35%] flex flex-col justify-end pointer-events-none">
              <div className="space-y-2 overflow-y-auto scrollbar-hide flex flex-col items-start mask-chat-fade-bottom pb-4 pointer-events-auto">
                 {messages.map(msg => (
                   <div key={msg.id} className="flex flex-col items-start animate-in slide-in-from-right-8 duration-500 max-w-full">
                      <div className="bg-black/40 backdrop-blur-3xl px-4 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className={`text-[10px] font-black uppercase tracking-tight ${msg.isHost ? 'text-blue-400' : 'text-emerald-400/80'}`}>
                             {msg.user}
                             {msg.isHost && <span className="mr-1 text-amber-500">★</span>}
                           </span>
                        </div>
                        <p className="text-white text-[13px] font-bold leading-snug tracking-tight drop-shadow-lg">
                          {msg.text}
                        </p>
                      </div>
                   </div>
                 ))}
                 <div ref={chatEndRef} />
              </div>
           </div>
        </div>

        {/* الفوتر التفاعلي - في الأسفل تماماً وبدون شريط تنبيهات */}
        <div className="px-4 pb-8 pt-4 bg-gradient-to-t from-black via-black/80 to-transparent z-[60]">
           <div className="flex items-center gap-3">
              <form onSubmit={handleSendMessage} className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-5 flex items-center gap-2 focus-within:bg-white/10 transition-all shadow-2xl">
                 <input 
                   type="text" 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="تفاعل مع أبو سعيد والجمهور..."
                   className="flex-1 bg-transparent py-4 text-[13px] text-white placeholder:text-white/20 outline-none font-bold"
                 />
                 <button type="submit" className="text-blue-500 p-2 hover:scale-125 transition-transform active:scale-90">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                 </button>
              </form>
              
              <div className="flex items-center gap-2.5">
                 <button onClick={addHeart} className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-600/30 active:scale-90 transition-all border border-white/10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                 </button>
                 <button className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl shadow-2xl shadow-amber-500/30 active:scale-90 transition-all border border-white/10">🎁</button>
                 <button className="w-12 h-12 bg-white/5 backdrop-blur-3xl rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all hover:bg-white/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                 </button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .mask-chat-fade-bottom {
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%);
        }
        @keyframes audio-pulse-1 { 0%, 100% { height: 4px; } 50% { height: 10px; } }
        @keyframes audio-pulse-2 { 0%, 100% { height: 2px; } 50% { height: 6px; } }
        @keyframes audio-pulse-3 { 0%, 100% { height: 6px; } 50% { height: 12px; } }
        .animate-audio-pulse-1 { animation: audio-pulse-1 0.6s ease-in-out infinite; }
        .animate-audio-pulse-2 { animation: audio-pulse-2 0.8s ease-in-out infinite; }
        .animate-audio-pulse-3 { animation: audio-pulse-3 0.7s ease-in-out infinite; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .animate-dash {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: dash 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveRoomView;
