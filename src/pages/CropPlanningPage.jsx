import React, { useState } from 'react';
import { Sprout, Filter, ArrowUpDown, Bookmark, Check, AlertCircle, Info } from 'lucide-react';
import { cropPlanningService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { STATES_DISTRICTS } from '../data/demoData';
import { useApp } from '../context/AppContext';

const SOIL_TYPES = ['Alluvial', 'Clay', 'Loam', 'Sandy', 'Black Cotton', 'Red Laterite'];
const SEASONS = ['Kharif (Jun-Oct)', 'Rabi (Oct-Mar)', 'Zaid (Mar-Jun)'];
const WATER_OPTIONS = ['Abundant', 'Moderate', 'Limited', 'Very Limited'];
const IRRIGATION_METHODS = ['Flood', 'Drip', 'Sprinkler', 'Rain-fed'];
const BUDGET_RANGES = [
  { value: 'low', label: 'Low (< ₹15,000/acre)' },
  { value: 'medium', label: 'Medium (₹15,000-35,000/acre)' },
  { value: 'high', label: 'High (> ₹35,000/acre)' },
];
const SUITABILITY_COLOR = (score) => score >= 85 ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : score >= 70 ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20';
const RISK_COLOR = { Low: 'badge-green', Medium: 'badge-yellow', 'Medium-High': 'badge-yellow', High: 'badge-red' };

export const CropPlanningPage = () => {
  const { showToast, profile } = useApp();
  const [form, setForm] = useState({
    state: profile?.state || '', district: profile?.district || '',
    soilType: profile?.soilType || '', soilPH: '6.5',
    waterAvailability: 'Moderate', season: 'Rabi (Oct-Mar)',
    landArea: profile?.landSize || '5', irrigationMethod: 'Flood',
    budget: 'medium', previousCrop: '',
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('suitability');
  const [savedCrops, setSavedCrops] = useState([]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cropPlanningService.getRecommendations(form);
      setResults(res.data);
      showToast('Crop recommendations generated! (Demo data)', 'success');
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = results ? [...results].sort((a, b) => {
    if (sortBy === 'suitability') return b.suitability - a.suitability;
    if (sortBy === 'cost') return a.cost.localeCompare(b.cost);
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    return 0;
  }) : [];

  const toggleSave = (cropId) => {
    if (savedCrops.includes(cropId)) {
      setSavedCrops(p => p.filter(id => id !== cropId));
      showToast('Recommendation removed from saved', 'info');
    } else {
      setSavedCrops(p => [...p, cropId]);
      showToast('Crop recommendation saved!', 'success');
    }
  };

  const districts = form.state ? STATES_DISTRICTS[form.state] || [] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sprout className="text-primary-600" size={26} />
            Smart Crop Planning
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Get personalized crop recommendations based on your land conditions</p>
        </div>
        <span className="demo-label flex-shrink-0">⚠️ Demo Recommendations</span>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 flex gap-3">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-400">Recommendations are generated using demo frontend rules — not verified agricultural science. Consult your local Krishi Vigyan Kendra (KVK) for expert advice.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Enter Farm Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">State</label>
                <select className="input" value={form.state} onChange={e => set('state', e.target.value)}>
                  <option value="">Select</option>
                  {Object.keys(STATES_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">District</label>
                <select className="input" value={form.district} onChange={e => set('district', e.target.value)} disabled={!form.state}>
                  <option value="">Select</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Soil Type</label>
              <select className="input" value={form.soilType} onChange={e => set('soilType', e.target.value)}>
                <option value="">Select soil type</option>
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Soil pH</label>
                <input className="input" type="number" min="4" max="10" step="0.1" value={form.soilPH} onChange={e => set('soilPH', e.target.value)} />
              </div>
              <div>
                <label className="label">Land Area (acres)</label>
                <input className="input" type="number" min="0.1" step="0.5" value={form.landArea} onChange={e => set('landArea', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Season</label>
              <select className="input" value={form.season} onChange={e => set('season', e.target.value)}>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Water Availability</label>
              <select className="input" value={form.waterAvailability} onChange={e => set('waterAvailability', e.target.value)}>
                {WATER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Irrigation Method</label>
              <select className="input" value={form.irrigationMethod} onChange={e => set('irrigationMethod', e.target.value)}>
                {IRRIGATION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Budget Range</label>
              <select className="input" value={form.budget} onChange={e => set('budget', e.target.value)}>
                {BUDGET_RANGES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Previous Crop (optional)</label>
              <input className="input" placeholder="e.g. Rice, Soybean..." value={form.previousCrop} onChange={e => set('previousCrop', e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? <><LoadingSpinner size="sm" /> Generating...</> : <><Sprout size={16} /> Get Recommendations</>}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {loading && <div className="card p-12"><LoadingSpinner size="lg" text="Analyzing your farm conditions..." /></div>}

          {!loading && results && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">{results.length} Recommended Crops</h2>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input py-1.5 text-sm w-auto">
                    <option value="suitability">Sort: Suitability</option>
                    <option value="duration">Sort: Duration</option>
                    <option value="cost">Sort: Cost</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {sortedResults.map(crop => (
                  <div key={crop.id} className="card p-5 hover:shadow-card-hover transition-all">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{crop.name}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">• {crop.variety}</span>
                          <span className={`badge ${RISK_COLOR[crop.risk] || 'badge-yellow'}`}>{crop.risk} Risk</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{crop.explanation}</p>
                      </div>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${SUITABILITY_COLOR(crop.suitability)}`}>
                          <span className="text-lg leading-none">{crop.suitability}</span>
                          <span className="text-xs">score</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {[
                        { label: 'Duration', value: crop.duration },
                        { label: 'Water Need', value: crop.waterReq },
                        { label: 'Est. Cost', value: crop.cost },
                        { label: 'Exp. Yield', value: crop.expectedYield },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-blue">{crop.season}</span>
                      <div className="flex-1" />
                      <button onClick={() => toggleSave(crop.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${savedCrops.includes(crop.id) ? 'bg-primary-700 text-white' : 'btn-ghost'}`}
                      >
                        {savedCrops.includes(crop.id) ? <><Check size={14} /> Saved</> : <><Bookmark size={14} /> Save</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                All cost estimates and yield projections are illustrative demo figures. Actual results depend on weather, market conditions, and farming practices.
              </div>
            </>
          )}

          {!loading && !results && (
            <div className="card">
              <EmptyState icon={Sprout} title="Fill in your farm details" description="Enter your land information and click 'Get Recommendations' to see personalized crop suggestions." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropPlanningPage;
