import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '', onSubmit }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => e.key === 'Enter' && onSubmit && onSubmit()}
        className="input pl-10 pr-4"
      />
    </div>
  );
};

export const FormField = ({ label, error, required, children, hint }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export const Select = ({ value, onChange, options = [], placeholder = 'Select...', className = '' }) => {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={`input ${className}`}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        typeof opt === 'string'
          ? <option key={opt} value={opt}>{opt}</option>
          : <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export const DemoLabel = ({ text = '⚠️ Demo Data' }) => (
  <span className="demo-label">{text}</span>
);

export default FormField;
