
import React from 'react';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  try {
    // فتح لوحة التحكم مباشرة دون الحاجة لتسجيل دخول
    return <Dashboard />;
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
