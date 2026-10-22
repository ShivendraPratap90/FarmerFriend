import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizes = { sm: 16, md: 24, lg: 40, xl: 56 };
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 size={sizes[size] || 24} className="animate-spin text-primary-600" />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-gray-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center animate-pulse-green">
        <span className="text-2xl text-white font-bold">FF</span>
      </div>
      <LoadingSpinner size="lg" text="Loading FarmerFriend..." />
    </div>
  </div>
);

export default LoadingSpinner;
