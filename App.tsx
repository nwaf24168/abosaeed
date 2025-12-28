
import React, { useState, useEffect } from 'react';
import { AUTH_PASSWORD } from './constants';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

const App: React.FC = () => {
  // ملاحظة للمطور: تم تعطيل التحقق الإجباري مؤقتاً بناءً على طلب المستخدم
  // الحالة الأصلية للمصادقة محفوظة هنا
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
    // في الوضع المؤقت، لا نحتاج لإعادة التوجيه لصفحة الدخول
  };

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('abosaeed_auth', 'true');
    }
  }, [isAuthenticated]);

  /**
   * تم إلغاء حجب الصفحة مؤقتاً.
   * للعودة لنظام الحماية، قم بإعادة تفعيل الشرط أدناه:
   * 
   * if (!isAuthenticated) {
   *   return <Auth onLogin={handleLogin} />;
   * }
   */

  // عرض لوحة التحكم مباشرة
  return <Dashboard onLogout={handleLogout} />;
};

export default App;
