
import React, { useState } from 'react';
import LegalModal from './LegalModal';
import AiLogo from './AiLogo';

interface AuthProps {
  onLogin: (pwd: string) => boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full"></div>
      
      <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />

      <div className="max-w-md w-full glass p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-8">
            <AiLogo size="lg" className="shadow-2xl shadow-emerald-500/20" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">منصة أبو سعيد</h1>
          <p className="text-slate-500 font-bold text-sm">نظام تحليل الأسهم السعودية الذكي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">كلمة المرور للدخول</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full bg-slate-900/50 border ${error ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono placeholder:text-slate-700`}
              placeholder="••••••••••••"
            />
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold px-2 animate-bounce">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                كلمة المرور غير صحيحة، حاول مجدداً
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-600/20 transition-all active:scale-[0.98] text-lg"
            >
              تسجيل الدخول
            </button>

            <div className="text-center space-y-3 pt-2">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                دخولك للمنصة يعتبر موافقة ضمنية كاملة على
                <br />
                <button 
                  type="button"
                  onClick={() => setIsLegalOpen(true)}
                  className="text-emerald-500 font-black hover:text-emerald-400 transition-colors border-b border-emerald-500/30"
                >
                  شروط الاستخدام وسياسة الخصوصية
                </button>
              </p>
            </div>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex items-center justify-center gap-4 text-slate-700">
            <span className="w-8 h-[1px] bg-slate-800"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">SECURE ACCESS ONLY</span>
            <span className="w-8 h-[1px] bg-slate-800"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
