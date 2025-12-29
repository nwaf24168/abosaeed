
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("App: Initialization started...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("App: Root element #root not found in HTML!");
} else {
  try {
    console.log("App: Creating React root...");
    const root = ReactDOM.createRoot(rootElement);
    
    console.log("App: Rendering application...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("App: Successfully mounted.");
    
    // إخفاء شاشة التحميل بعد نجاح العملية
    if ((window as any).hideLoader) {
      (window as any).hideLoader();
    }
  } catch (error: any) {
    console.error("App: Render crash detected:", error);
    if ((window as any).onerror) {
      (window as any).onerror(error.message, "index.tsx", 0, 0, error);
    }
  }
}
