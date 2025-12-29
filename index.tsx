
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // إبلاغ index.html بنجاح التحميل لإخفاء الشاشة الخضراء
  if ((window as any).hideLoader) {
    (window as any).hideLoader();
  }
} catch (error) {
  console.error("React Render Error:", error);
  if ((window as any).showError) {
    (window as any).showError(error);
  }
}
