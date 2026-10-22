import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Star, GitCompare, Search, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mandiService } from '../services/mockServices';
import { MANDI_PRICES, MANDI_PRICE_TRENDS, STATES_DISTRICTS } from '../data/demoData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const ALL_CROPS = [...new Set(MANDI_PRICES.map(p => p.crop))];
const ALL_STATES = [...new Set(MANDI_PRICES.map(p => p.state))];

export const MandiPricesPage = () => {
  const { showToast } = useApp();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('modal-desc');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_mandi_favs') || '[]'); } catch { return []; }
  });
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await mandiService.getPrices({ crop: cropFilter, state: stateFilter, search: searchInput });
      setPrices(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, [cropFilter, stateFilter]);

  const sorted = [...prices].sort((a, b) => {
    if (sortBy === 'modal-desc') return b.modal - a.modal;
    if (sortBy === 'modal-asc') return a.modal - b.modal;
    if (sortBy === 'min-asc') return a.min - b.min;
    if (sortBy === 'max-desc') return b.max - a.max;
    return 0;
  }).filter(p => {
    if (!searchInput) return true;
    return p.market.toLowerCase().includes(searchInput.toLowerCase()) || p.crop.toLowerCase().includes(searchInput.toLowerCase());
  });

  const toggleFav = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('ff_mandi_favs', JSON.stringify(updated));
    showToast(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites!', 'success');
  };

  const toggleCompare = (item) => {
    if (compareList.find(c => c.id === item.id)) {
      setCompareList(prev => prev.filter(c => c.id !== item.id));
    } else if (compareList.length >= 3) {
      showToast('You can compare up to 3 markets at once', 'warning');
    } else {
      setCompareList(prev => [...prev, item]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShoppingCart className="text-primary-600" size={26} />
            Mandi Price Comparison
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Compare prices across mandis to maximize your earnings</p>
        </div>
        <span className="demo-label flex-shrink-0">⚠️ Sample Demo Data</span>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchPrices()}
              placeholder="Search crop or mandi name..." className="input pl-9"
            />
          </div>
          <select className="input w-auto" value={cropFilter} onChange={e => setCropFilter(e.target.value)}>
            <option value="all">All Crops</option>
            {ALL_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input w-auto" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            <option value="all">All States</option>
            {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="modal-desc">Modal ↓</option>
            <option value="modal-asc">Modal ↑</option>
            <option value="min-asc">Min ↑</option>
            <option value="max-desc">Max ↓</option>
          </select>
        </div>
        {compareList.length > 0 && (
          <div className="flex items-center gap-3 mt-3 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <GitCompare size={15} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">{compareList.length} selected for comparison</span>
            <button onClick={() => setShowCompare(true)} className="btn-primary text-xs py-1">Compare</button>
            <button onClick={() => setCompareList([])} className="btn-ghost text-xs text-red-500">Clear</button>
          </div>
        )}
      </div>

      {/* Compare panel */}
      {showCompare && compareList.length > 0 && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2"><GitCompare size={18} className="text-primary-600" />Market Comparison</h2>
            <button onClick={() => setShowCompare(false)} className="btn-ghost text-sm">Close</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-2 font-semibold">Mandi / Market</th>
                  <th className="pb-2 font-semibold text-right">Min (₹/qtl)</th>
                  <th className="pb-2 font-semibold text-right">Modal (₹/qtl)</th>
                  <th className="pb-2 font-semibold text-right">Max (₹/qtl)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {compareList.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-2.5">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{m.crop}</p>
                      <p className="text-xs text-gray-400">{m.market}, {m.state}</p>
                    </td>
                    <td className="py-2.5 text-right text-gray-700 dark:text-gray-300">₹{m.min.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-primary-700 dark:text-primary-400">₹{m.modal.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-gray-700 dark:text-gray-300">₹{m.max.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-center text-gray-400 mt-3">Best modal price: <strong className="text-primary-600">₹{Math.max(...compareList.map(c => c.modal)).toLocaleString()}</strong> — {compareList.find(c => c.modal === Math.max(...compareList.map(x => x.modal)))?.market}</p>
        </div>
      )}

      {loading ? (
        <div className="card p-12"><LoadingSpinner size="lg" text="Loading mandi prices..." /></div>
      ) : (
        <>
          {/* Price table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Crop & Market</th>
                    <th className="px-4 py-3 text-right">Min</th>
                    <th className="px-4 py-3 text-right">Modal</th>
                    <th className="px-4 py-3 text-right">Max</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {sorted.map(price => (
                    <tr key={price.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${compareList.find(c => c.id === price.id) ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{price.crop} <span className="text-gray-400 font-normal">— {price.variety}</span></p>
                          <p className="text-xs text-gray-400 mt-0.5">{price.market}, {price.district}, {price.state}</p>
                          <p className="text-xs text-gray-300 dark:text-gray-600">Sample date: {price.date}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">₹{price.min.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-base font-bold text-primary-700 dark:text-primary-400">₹{price.modal.toLocaleString()}</span>
                        <p className="text-xs text-gray-400">/qtl</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">₹{price.max.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => toggleFav(price.id)} className={`p-1.5 rounded-lg transition-colors ${favorites.includes(price.id) ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'}`}>
                            <Star size={15} className={favorites.includes(price.id) ? 'fill-current' : ''} />
                          </button>
                          <button onClick={() => toggleCompare(price)}
                            className={`p-1.5 rounded-lg transition-colors ${compareList.find(c => c.id === price.id) ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-300 hover:text-primary-600 hover:bg-primary-50'}`}
                            title="Add to comparison"
                          >
                            <GitCompare size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sorted.length === 0 && (
                <EmptyState icon={ShoppingCart} title="No prices found" description="Try adjusting your filters or search term." className="py-12" />
              )}
            </div>
          </div>

          {/* Trend chart */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Price Trends — Last 6 Months</h2>
            <p className="text-xs text-gray-400 mb-4">Illustrative price trends for major crops (₹/quintal) — demo data only</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MANDI_PRICE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₹${v}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Wheat" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Rice" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Tomato" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <p className="text-xs text-center text-gray-400">⚠️ All prices shown are illustrative demo data as of {MANDI_PRICES[0]?.date}. Do not use for actual trading decisions.</p>
    </div>
  );
};

export default MandiPricesPage;
