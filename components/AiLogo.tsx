
import React from 'react';
import { PLATFORM_LOGO_SVG } from '../services/brandingService';

interface AiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AiLogo: React.FC<AiLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-24 h-24'
  };

  return (
    <div 
      className={`${sizeClasses[size]} flex items-center justify-center bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 p-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: PLATFORM_LOGO_SVG }}
    />
  );
};

export default AiLogo;
