import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, trend, trendUp, className = '' }) => {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg || 'bg-primary-100'}`}>
            <Icon size={22} className="text-primary-700" />
          </div>
        )}
      </div>
    </div>
  );
};

export const ChartCard = ({ title, subtitle, children, actions, className = '' }) => {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

export const DashboardCard = ({ title, icon: Icon, children, actions, className = '', badge }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          {Icon && <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center"><Icon size={16} className="text-primary-700 dark:text-primary-400" /></div>}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {badge}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default StatCard;
