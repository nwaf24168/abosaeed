
import React, { useState, useEffect } from 'react';
import { AUTH_PASSWORD } from './constants';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

const App: React.FC = () => {
  // استخدام دالة المبادأة لضمان قراءة الجلسة فوراً قبل الرندر الأول
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

  // تأكيد حفظ الجلسة في حال تغيرت الحالة يدوياً
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('abosaeed_auth', 'true');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

export default App;
