
import React, { useState } from 'react';
import { LiveRoom, RoomType } from '../types';

interface CommunityHubProps {
  onJoinRoom: (room: LiveRoom) => void;
}

const MOCK_ROOMS: LiveRoom[] = [
  { id: '1', title: 'تحليل افتتاح السوق - تاسي مباشر', host: 'أبو سعيد', type: 'ANALYSIS', status: 'LIVE', participantsCount: 1250, isPrivate: false, isPaid: false, tags: ['تاسي', 'افتتاح'] },
  { id: '2', title: 'أسرار تداول الفوليوم والسيولة', host: 'خبير مالي', type: 'EDUCATION', status: 'LIVE', participantsCount: 420, isPrivate: false, isPaid: true, price: 50, tags: ['تعليم', 'سيولة'] },
  { id: '3', title: 'متابعة سهم أرامكو والقطاع النفطي', host: 'أبو ناصر', type: 'STOCK', status: 'LIVE', participantsCount: 85, isPrivate: false, isPaid: false, tags: ['أرامكو', 'طاقة'] },
  { id: '4', title: 'جلسة مغلقة للعملاء المميزين VIP', host: 'إدارة المنصة', type: 'VIP', status: 'SCHEDULED', participantsCount: 0, isPrivate: true, isPaid: false, tags: ['VIP', 'خاص'] },
];

const CommunityHub: React.FC<CommunityHubProps> = ({ onJoinRoom }) => {
  const [activeFilter, setActiveFilter] = useState<RoomType | 'ALL'>('ALL');

  const getRoomIcon = (type: RoomType) => {
    switch (type) {
      case 'ANALYSIS': return '📈';
      case 'STOCK': return '🏢';
      case 'EDUCATION': return '🎓';
      case 'DEMO': return '🎮';
      case 'VIP': return '💎';
      default: return '💬';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Section */}
      <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-right">
            <h2 className="text-4xl font-black text-white leading-tight">مجتمعات أبو سعيد الحية</h2>
            <p className="text-slate-400 text-lg font-bold max-w-xl">
              ناقش السوق، تابع الشارت، واستمع لأفضل المحللين في غرف صوتية وتفاعلية مباشرة.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-4">
            <span className="text-2xl">🎙️</span>
            إنشاء غرفة جديدة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: 'ALL', label: 'الكل', icon: '🌐' },
          { id: 'ANALYSIS', label: 'تحليل السوق', icon: '📈' },
          { id: 'STOCK', label: 'غرف الأسهم', icon: '🏢' },
          { id: 'EDUCATION', label: 'دروس تعليمية', icon: '🎓' },
          { id: 'VIP', label: 'غرف VIP', icon: '💎' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border flex items-center gap-3 ${
              activeFilter === f.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                : 'bg-slate-900/50 text-slate-500 border-white/5 hover:border-blue-500/30'
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_ROOMS.filter(r => activeFilter === 'ALL' || r.type === activeFilter).map((room) => (
          <div 
            key={room.id} 
            className="glass group rounded-[2.5rem] border border-white/5 p-8 flex flex-col justify-between hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden cursor-pointer"
            onClick={() => onJoinRoom(room)}
          >
            {room.status === 'LIVE' && (
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-rose-500 px-3 py-1 rounded-full animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="text-[10px] font-black text-white">مباشر</span>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-blue-600/10 transition-colors">
                  <span className="text-3xl">{getRoomIcon(room.type)}</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white leading-tight group-hover:text-blue-400 transition-colors">{room.title}</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1">المضيف: {room.host}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg text-slate-400">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#070b14] bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-500 mr-2">+{room.participantsCount} يحضرون</span>
              </div>
              
              <button className="bg-slate-900 group-hover:bg-blue-600 text-white font-black px-6 py-3 rounded-xl text-xs transition-all border border-white/5 group-hover:border-blue-500">
                {room.status === 'LIVE' ? 'دخول الغرفة' : 'تنبيهي بالبدء'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;
