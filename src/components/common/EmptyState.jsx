import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description = '', action = null, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={36} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 max-w-sm">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
