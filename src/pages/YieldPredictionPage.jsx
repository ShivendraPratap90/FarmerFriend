import React, { useState } from 'react';
import { TrendingUp, Info, AlertCircle } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { yieldService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

const CROPS = ['wheat', 'rice', 'maize', 'mustard', 'potato', 'soybean', 'cotton', 'tomato'];
const SOIL_TYPES = ['alluvial', 'clay', 'loam', 'sandy'];
const IRRIGATION = ['flood', 'drip', 'sprinkler', 'rainfed'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const FARMING_METHODS = ['conventional', 'organic', 'precision'];

const IMPACT_COLOR = { Positive: 'text-green-600', Neutral: 'text-gray-500', Negative: 'text-red-500' };

export const YieldPredictionPage = () => {
  const { showToast, profile } = useApp();
  const [form, setForm] = useState({
    crop: 'wheat', landArea: profile?.landSize || '5', landUnit: 'acres',
    soilType: 'alluvial', irrigationMethod: 'flood', season: 'Rabi',
    farmingMethod: 'conventional', fertilizer: '', rainfall: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.landArea || parseFloat(form.landArea) <= 0) { showToast('Please enter valid land area', 'warning'); return; }
    setLoading(true);
    try {
      const res = await yieldService.predictYield(form);
      setResult(res.data);
      showToast('Yield estimate calculated successfully!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const scenarioData = result ? [
    { scenario: 'Unfavorable', yield: parseFloat(result.lowScenario), fill: '#ef4444' },
    { scenario: 'Normal', yield: parseFloat(result.normalScenario), fill: '#22c55e' },
    { scenario: 'Favorable', yield: parseFloat(result.favorableScenario), fill: '#3b82f6' },
  ] : [];

  const gaugeValue = result ? Math.min(100, (parseFloat(result.estimatedPerAcre) / 30) * 100) : 0;
  const gaugeData = [{ value: gaugeValue, fill: '#22c55e' }];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="text-primary-600" size={26} />
            Crop Yield Prediction
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Estimate your harvest with an illustrative demo calculator</p>
        </div>
        <span className="demo-label flex-shrink-0">⚠️ Demo Estimator Only</span>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex gap-3">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          This is a demo yield estimator using a simple formula — not a trained ML model. Actual yields depend on many unmodelled factors. Do not use this for real farming decisions.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-5 space-y-4 h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Enter Crop Details</h2>

          <div>
            <label className="label">Crop</label>
            <select className="input capitalize" value={form.crop} onChange={e => set('crop', e.target.value)}>
              {CROPS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Land Area</label>
              <input className="input" type="number" min="0.1" step="0.1" value={form.landArea} onChange={e => set('landArea', e.target.value)} />
            </div>
            <div>
              <label className="label">Unit</label>
              <select className="input" value={form.landUnit} onChange={e => set('landUnit', e.target.value)}>
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Soil Type</label>
            <select className="input capitalize" value={form.soilType} onChange={e => set('soilType', e.target.value)}>
              {SOIL_TYPES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Irrigation Method</label>
            <select className="input capitalize" value={form.irrigationMethod} onChange={e => set('irrigationMethod', e.target.value)}>
              {IRRIGATION.map(m => <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Season</label>
              <select className="input" value={form.season} onChange={e => set('season', e.target.value)}>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Farming Method</label>
              <select className="input capitalize" value={form.farmingMethod} onChange={e => set('farmingMethod', e.target.value)}>
                {FARMING_METHODS.map(m => <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Fertilizer (kg/acre)</label>
              <input className="input" type="number" placeholder="Optional" value={form.fertilizer} onChange={e => set('fertilizer', e.target.value)} />
            </div>
            <div>
              <label className="label">Expected Rainfall (mm)</label>
              <input className="input" type="number" placeholder="Optional" value={form.rainfall} onChange={e => set('rainfall', e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
            {loading ? <><LoadingSpinner size="sm" /> Calculating...</> : <><TrendingUp size={16} /> Estimate Yield</>}
          </button>
        </form>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {loading && <div className="card p-12"><LoadingSpinner size="lg" text="Running demo yield estimation..." /></div>}

          {!loading && result && (
            <>
              {/* Main results */}
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Estimated Yield — {result.crop?.charAt(0).toUpperCase() + result.crop?.slice(1)}
                </h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-5">
                  <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Estimate</p>
                    <p className="text-3xl font-bold text-primary-700 dark:text-primary-400">{result.totalEstimate}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">quintals</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Per Acre</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">{result.estimatedPerAcre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">quintals/acre</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Yield Range</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{result.lowScenario}–{result.favorableScenario}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">quintals (total)</p>
                  </div>
                </div>

                {/* Gauge visual */}
                <div className="flex justify-center">
                  <div style={{ width: 200, height: 120 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="80%" innerRadius="60%" outerRadius="90%" barSize={12} data={gaugeData} startAngle={180} endAngle={0}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background clockWise dataKey="value" cornerRadius={6} fill="#22c55e" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 -mt-4">Yield Performance Indicator</p>
              </div>

              {/* Scenario comparison */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Scenario Comparison</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={scenarioData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="scenario" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`${v} quintals`, 'Total Yield']} />
                    <Bar dataKey="yield" name="Total Yield" fill="#22c55e" radius={[6, 6, 0, 0]}>
                      {scenarioData.map((entry, i) => (
                        <React.Fragment key={i} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Factors */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Influencing Factors</h3>
                <div className="space-y-2">
                  {result.factors.map(f => (
                    <div key={f.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{f.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${IMPACT_COLOR[f.impact]}`}>{f.impact}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                  {result.disclaimer}
                </div>
              </div>
            </>
          )}

          {!loading && !result && (
            <div className="card">
              <EmptyState icon={TrendingUp} title="Enter crop details to estimate yield" description="Fill in the form on the left and click 'Estimate Yield' to see your illustrative harvest prediction." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPredictionPage;
