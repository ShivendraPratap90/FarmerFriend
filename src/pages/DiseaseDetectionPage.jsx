import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, X, Microscope, AlertCircle, CheckCircle, Clock, Trash2,
  Image, Sparkles, Layers, Eye, ShieldAlert, Cpu, Activity,
  Sliders, MessageSquare, ArrowRight, Check, AlertTriangle, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { diseaseService } from '../services/mockServices';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

const CROPS = ['Tomato', 'Potato', 'Wheat', 'Rice', 'Maize', 'Cotton', 'Mustard', 'Soybean', 'Gram', 'Apple', 'Grape'];
const SEVERITY_COLOR = {
  Low: 'badge-green',
  Medium: 'badge-yellow',
  High: 'badge-red',
};

export const DiseaseDetectionPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [identifyingCrop, setIdentifyingCrop] = useState(false);
  const [detectedPlantInfo, setDetectedPlantInfo] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('chemical'); // 'chemical' | 'organic' | 'prevention' | 'symptoms'
  
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_disease_history') || '[]'); }
    catch { return []; }
  });

  const handleFile = async (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a JPEG, PNG, or WebP image', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('File size must be under 20 MB', 'error');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setDetectedPlantInfo(null);

    // Run OpenPlants Vision Transformer to auto-identify plant species
    setIdentifyingCrop(true);
    try {
      const plantData = await diseaseService.identifyCrop(file);
      if (plantData) {
        setDetectedPlantInfo(plantData);
        // By default choose none if the leaf or crop is not in dropdown
        if (plantData.isSupportedInDropdown && plantData.detectedCrop && CROPS.includes(plantData.detectedCrop)) {
          setSelectedCrop(plantData.detectedCrop);
          showToast(`Identified: ${plantData.commonName || plantData.detectedCrop}`, 'success');
        } else {
          setSelectedCrop(''); // Default to none!
          showToast(`Identified: ${plantData.commonName || plantData.scientificName} (Select crop category manually)`, 'info');
        }
      }
    } catch (e) {
      console.warn('Auto crop detection error:', e);
    } finally {
      setIdentifyingCrop(false);
    }
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
      const entry = {
        ...res.data,
        id: Date.now(),
        imageName: imageFile.name,
        cropAnalyzed: selectedCrop,
        analyzedAt: new Date().toISOString()
      };
      const updated = [entry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('ff_disease_history', JSON.stringify(updated));
      showToast('Neural diagnosis complete!', 'success');
    } catch (err) {
      showToast(err.message || 'Analysis failed. Please verify AI backend is running.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setDetectedPlantInfo(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ff_disease_history');
    showToast('Diagnostic history cleared', 'info');
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('ff_disease_history', JSON.stringify(updated));
  };

  const askChatbotAboutDisease = () => {
    if (!result) return;
    const query = `How do I treat ${result.name} on ${result.cropAnalyzed}? What exact chemicals or organic remedies should I spray?`;
    navigate('/ai-assistant', { state: { prefilledQuery: query } });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Microscope className="text-primary-600" size={26} />
            AI Crop Disease Diagnostic Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time EfficientNet-B0 inference with OpenPlants ViT auto-identification & ICAR agricultural protocols
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            <Cpu size={13} className="text-primary-600" /> Dual-Model AI Engine Active
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upload & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Upload Leaf Specimen</h2>
              {imagePreview && (
                <button onClick={removeImage} className="text-xs text-red-500 hover:underline">
                  Change Photo
                </button>
              )}
            </div>

            {/* Upload Area */}
            {!imagePreview ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                }`}
              >
                <Upload size={38} className={`mx-auto mb-3 ${dragging ? 'text-primary-600' : 'text-gray-400 dark:text-gray-500'}`} />
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG, WebP • Auto-detects plant species</p>
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <img src={imagePreview} alt="Crop specimen preview" className="w-full h-52 object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 flex items-center justify-between">
                  <p className="text-white text-xs truncate font-medium">{imageFile?.name}</p>
                  {identifyingCrop && (
                    <span className="text-[11px] text-primary-200 flex items-center gap-1">
                      <LoadingSpinner size="sm" /> Identifying crop...
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Auto-detected Crop Banner */}
            {detectedPlantInfo && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <Sparkles size={17} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                      🌱 {detectedPlantInfo.commonName || detectedPlantInfo.detectedCrop || 'Identified Plant'}
                      {detectedPlantInfo.commonNameHi ? ` (${detectedPlantInfo.commonNameHi})` : ''}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5 text-xs">
                      Botanical Species: <em>{detectedPlantInfo.scientificName}</em>
                    </p>
                    {detectedPlantInfo.isSupportedInDropdown ? (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-medium">
                        ✓ Category automatically selected below. You can change it if you planted a different crop.
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1.5 font-medium bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg border border-amber-200 dark:border-amber-800/60">
                        ⚠️ Note: This specific plant is not in our diagnostic dropdown. Please select the closest crop category below or choose manually.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Crop Selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Target Crop Category <span className="text-red-500">*</span></label>
                {detectedPlantInfo && detectedPlantInfo.isSupportedInDropdown && (
                  <span className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">Auto-Selected</span>
                )}
              </div>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="input"
              >
                <option value="">-- Choose crop category --</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !imageFile || !selectedCrop}
              className="btn-primary w-full justify-center py-3 text-base shadow-sm disabled:opacity-50"
            >
              {analyzing ? (
                <><LoadingSpinner size="sm" /> Computing Neural Diagnosis & Lesions...</>
              ) : (
                <><Microscope size={18} /> Run AI Neural Diagnosis</>
              )}
            </button>
          </div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-3">
          {analyzing && (
            <div className="card p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center animate-pulse">
                <Microscope size={32} className="text-primary-600" />
              </div>
              <LoadingSpinner size="md" text="Running neural disease diagnosis..." />
              <p className="text-xs text-gray-400 max-w-sm">
                Analyzing foliage pathology, verifying against ICAR disease profiles, and generating tailored treatment advice...
              </p>
            </div>
          )}

          {!analyzing && result && (
            <div className="card p-5 space-y-6 animate-fade-in">
              {/* Clean Specimen Image */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center min-h-[220px] max-h-[340px]">
                <img
                  src={imagePreview}
                  alt="Crop Specimen"
                  className="w-full h-full max-h-[340px] object-contain"
                />
              </div>

              {/* Diagnosis Header */}
              <div className="p-4 rounded-2xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`badge ${SEVERITY_COLOR[result.severity] || 'badge-yellow'}`}>
                        {result.severity} Severity
                      </span>
                      <span className="badge badge-blue">{result.type}</span>
                      <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-md border border-primary-200 dark:border-primary-800">
                        {result.cropAnalyzed}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {result.modelMode}
                    </p>
                  </div>

                  <button
                    onClick={askChatbotAboutDisease}
                    className="btn-primary py-2 px-3.5 text-xs whitespace-nowrap shadow-sm"
                  >
                    <MessageSquare size={14} /> Ask AI Treatment Plan
                  </button>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-gray-600 dark:text-gray-400">Diagnostic Model Confidence</span>
                  <span className="font-bold text-primary-600">{result.confidence}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.confidence > 80 ? 'bg-green-500' : result.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* Actionable Recommendations Tabs */}
              <div>
                <div className="flex border-b border-gray-200 dark:border-gray-700 text-xs font-semibold gap-1 mb-4 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'chemical', label: '💊 Chemical Protocol & Spray' },
                    { id: 'organic', label: '🌿 Bio-Organic Treatments' },
                    { id: 'prevention', label: '🛡️ Cultural Prevention' },
                    { id: 'symptoms', label: '🔍 Symptoms & Pathogen' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-3 border-b-2 font-medium transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-700 dark:text-primary-400 font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'chemical' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Standardized curative chemical controls recommended by agricultural research extension with simple farmer dosage guidelines:
                    </p>
                    <div className="space-y-3">
                      {(result.treatments || []).map((t, idx) => {
                        const isObj = typeof t === 'object' && t !== null;
                        const technical = isObj ? t.technical : t;
                        const easyEn = isObj ? t.easy_en : null;
                        const easyHi = isObj ? t.easy_hi : null;

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700 space-y-2.5"
                          >
                            <div className="flex items-start gap-2.5">
                              <CheckCircle size={17} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                  {technical}
                                </span>
                              </div>
                            </div>

                            {(easyEn || easyHi) && (
                              <div className="ml-7 p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-1.5">
                                {easyEn && (
                                  <div className="flex items-start gap-2 text-emerald-900 dark:text-emerald-200">
                                    <span className="font-semibold whitespace-nowrap">💡 Plain English:</span>
                                    <span>{easyEn}</span>
                                  </div>
                                )}
                                {easyHi && (
                                  <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300 border-t border-emerald-200/40 dark:border-emerald-800/30 pt-1.5 font-sans">
                                    <span className="font-semibold whitespace-nowrap">🇮🇳 आसान भाषा में:</span>
                                    <span>{easyHi}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'organic' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Biological and organic controls safe for beneficial soil microorganisms:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-xl bg-green-50/70 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <p className="font-semibold text-green-900 dark:text-green-200 text-xs">Neem Oil Spray (10,000 ppm)</p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Spray @ 3–5 ml per liter of water during early morning or late evening. Inhibits fungal sporulation.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-green-50/70 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                        <p className="font-semibold text-green-900 dark:text-green-200 text-xs">Trichoderma viride / harzianum</p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                          Bio-fungicide spray @ 5 g per liter. Outcompetes foliar pathogens and strengthens systemic resistance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'prevention' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Foliar hygiene and cultural field practices to prevent re-infection:
                    </p>
                    <ul className="space-y-2">
                      {(result.prevention || []).map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                          <Check size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'symptoms' && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pathological symptoms verified by neural gradient activation:
                    </p>
                    <ul className="space-y-2">
                      {(result.symptoms || []).map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
                          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
                {result.disclaimer}
              </div>
            </div>
          )}

          {!analyzing && !result && (
            <div className="card">
              <EmptyState
                icon={Image}
                title="Awaiting Crop Specimen"
                description="Upload a photo of your crop leaf or plant. The OpenPlants model will identify the crop species automatically, and the neural engine will diagnose disease symptoms and recommend treatments."
              />
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clock size={18} className="text-primary-600" />
            Diagnostic History ({history.length})
          </h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="btn-ghost text-xs text-red-500 hover:bg-red-50">
              <Trash2 size={13} /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <EmptyState icon={Microscope} title="No past analyses" description="Your analyzed crop specimens will be saved here." className="py-8" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {history.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${SEVERITY_COLOR[item.severity] || 'badge-yellow'} text-xs`}>{item.severity}</span>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{item.cropAnalyzed}</span>
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
