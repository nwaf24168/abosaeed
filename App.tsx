
import React, { useState, useEffect } from 'react';
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

  // تأكيد عمل التطبيق فوراً
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

export default App;
