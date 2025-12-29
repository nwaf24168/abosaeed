
import React, { useState } from 'react';
import { AUTH_PASSWORD } from './constants.ts';
import Dashboard from './components/Dashboard.tsx';
import Auth from './components/Auth.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('abosaeed_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogin = (password: string) => {
    if (password === AUTH_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('abosaeed_auth', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('abosaeed_auth');
  };

  try {
    // إذا كان المستخدم مسجلاً، اظهر لوحة التحكم، وإلا اظهر شاشة الدخول
    if (isAuthenticated) {
      return <Dashboard onLogout={handleLogout} />;
    }
    return <Auth onLogin={handleLogin} />;
  } catch (err) {
    console.error("App: Component render error:", err);
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-6 text-center">
        <div className="glass p-10 rounded-3xl border border-rose-500/20 max-w-md">
          <h1 className="text-white text-xl font-black mb-4">حدث خطأ في عرض الواجهة</h1>
          <p className="text-slate-400 text-sm mb-6">نواجه مشكلة تقنية بسيطة، يرجى تحديث الصفحة.</p>
          <button onClick={() => window.location.reload()} className="bg-emerald-600 px-8 py-3 rounded-xl text-white font-bold">تحديث الصفحة</button>
        </div>
      </div>
    );
  }
};

export default App;
