import React, { useState, useCallback } from 'react';
import { Upload, X, Microscope, AlertCircle, CheckCircle, Clock, Trash2, Image, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { diseaseService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Potato', 'Maize', 'Cotton', 'Mustard', 'Soybean', 'Gram'];
const SEVERITY_COLOR = { Low: 'badge-green', Medium: 'badge-yellow', High: 'badge-red' };

export const DiseaseDetectionPage = () => {
  const { showToast } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_disease_history') || '[]'); }
    catch { return []; }
  });

  const handleFile = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) { showToast('Please upload a JPEG, PNG, or WebP image', 'error'); return; }
    if (file.size > 10 * 1024 * 1024) { showToast('File size must be under 10 MB', 'error'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) { showToast('Please upload a crop image first', 'warning'); return; }
    if (!selectedCrop) { showToast('Please select the crop type', 'warning'); return; }
    setAnalyzing(true);
    try {
      const res = await diseaseService.analyzeImage(selectedCrop, imageFile);
      setResult(res.data);
      const entry = { ...res.data, id: Date.now(), imageName: imageFile.name, cropAnalyzed: selectedCrop, analyzedAt: new Date().toISOString() };
      const updated = [entry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('ff_disease_history', JSON.stringify(updated));
      showToast('Analysis complete! (Simulated demo result)', 'success');
    } catch {
      showToast('Analysis failed. Please try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeImage = () => { setImageFile(null); setImagePreview(null); setResult(null); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem('ff_disease_history'); showToast('History cleared', 'info'); };
  const deleteHistoryItem = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('ff_disease_history', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Microscope className="text-primary-600" size={26} />
            AI Crop Disease Detection
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Upload a crop photo for simulated disease analysis</p>
        </div>
        <span className="demo-label flex-shrink-0">⚠️ Demo Simulation Only</span>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex gap-3">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          <strong>Demo Notice:</strong> This feature uses predefined sample results — it does not perform real AI image analysis. Results are illustrative only. Always consult a certified agriculture expert for actual crop diagnosis.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upload & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Upload Crop Image</h2>

            {/* Upload area */}
            {!imagePreview ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'}`}
              >
                <Upload size={36} className={`mx-auto mb-3 ${dragging ? 'text-primary-600' : 'text-gray-300 dark:text-gray-600'}`} />
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Max 10 MB</p>
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={imagePreview} alt="Crop preview" className="w-full h-48 object-cover" />
                <button onClick={removeImage} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                  <p className="text-white text-xs truncate">{imageFile?.name}</p>
                </div>
              </div>
            )}

            {/* Crop selector */}
            <div>
              <label className="label">Select Crop Type <span className="text-red-500">*</span></label>
              <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)} className="input">
                <option value="">-- Select crop --</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Analyze button */}
            <button onClick={handleAnalyze} disabled={analyzing || !imageFile || !selectedCrop} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60">
              {analyzing ? (
                <><LoadingSpinner size="sm" /> Analyzing... (2-3s)</>
              ) : (
                <><Microscope size={18} /> Analyze Crop</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {analyzing && (
            <div className="card p-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center animate-pulse">
                <Microscope size={32} className="text-primary-600" />
              </div>
              <LoadingSpinner size="md" text="Running simulated AI analysis on your crop image..." />
              <p className="text-xs text-gray-400 text-center max-w-xs">Checking for disease patterns, severity, and generating treatment recommendations...</p>
            </div>
          )}

          {!analyzing && result && (
            <div className="card p-5 space-y-5 animate-fade-in">
              {/* Result header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${SEVERITY_COLOR[result.severity] || 'badge-yellow'}`}>{result.severity} Severity</span>
                    <span className="badge badge-blue">{result.type}</span>
                    <span className="demo-label">Simulated Result</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Crop: {result.cropAnalyzed}</p>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Demo Confidence Score</span>
                  <span className="font-bold text-primary-600">{result.confidence}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${result.confidence > 85 ? 'bg-green-500' : result.confidence > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* Symptoms, Treatments, Prevention */}
              {[
                { title: 'Observed Symptoms', items: result.symptoms, icon: AlertCircle, iconColor: 'text-red-500' },
                { title: 'Suggested Treatments', items: result.treatments, icon: CheckCircle, iconColor: 'text-green-500' },
                { title: 'Prevention Measures', items: result.prevention, icon: CheckCircle, iconColor: 'text-blue-500' },
              ].map(({ title, items, icon: Icon, iconColor }) => (
                <div key={title}>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm">{title}</h4>
                  <ul className="space-y-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Icon size={14} className={`${iconColor} flex-shrink-0 mt-0.5`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
                {result.disclaimer}
              </div>
            </div>
          )}

          {!analyzing && !result && (
            <div className="card">
              <EmptyState icon={Image} title="No analysis yet" description="Upload a crop image and select the crop type, then click Analyze to see simulated results." />
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clock size={18} className="text-primary-600" />
            Analysis History ({history.length})
          </h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-ghost text-xs text-red-500 hover:bg-red-50">
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <EmptyState icon={Microscope} title="No history yet" description="Your recent analyses will appear here." className="py-8" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {history.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${SEVERITY_COLOR[item.severity] || 'badge-yellow'} text-xs`}>{item.severity}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.cropAnalyzed}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{new Date(item.analyzedAt).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={() => deleteHistoryItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
