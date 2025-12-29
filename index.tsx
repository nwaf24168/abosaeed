
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // الانتظار قليلاً لضمان أن المكونات بدأت في الرسم قبل إخفاء اللودر
    setTimeout(() => {
      if ((window as any).hideLoader) {
        (window as any).hideLoader();
      }
    }, 100);
  } catch (error: any) {
    console.error("App: Render crash:", error);
  }
}
