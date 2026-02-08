
import React, { useState, useRef } from 'react';
import { Camera, Activity, Info, Loader2, X, Sparkles, Upload, CheckCircle2, AlertCircle, ShieldPlus } from 'lucide-react';
import { detectFishDisease } from '../services/geminiService';
import { DiseaseAnalysis } from '../types';
import { useTheme } from '../App';

const DiseaseDetection: React.FC = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await detectFishDisease(base64Data);
      setResult(analysis);
    } catch (err) {
      alert("Analysis failed. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.8) return 'text-emerald-500 bg-emerald-500/10';
    if (conf > 0.5) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className={`pb-32 min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'}`}>
      <div className="p-6 pt-12 text-center space-y-2">
        <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Fish AI Diagnostic
        </h2>
        <p className="text-slate-400 text-sm font-medium">Detect diseases instantly using Gemini Vision</p>
      </div>

      <div className="flex-1 px-6 space-y-8 flex flex-col items-center">
        {/* Main Image Container */}
        <div className={`w-full max-w-sm aspect-square rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-2 border-dashed transition-all duration-500 relative overflow-hidden flex items-center justify-center ${
          image 
            ? 'border-transparent' 
            : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')
        }`}>
          {image ? (
            <div className="relative w-full h-full p-3">
              <img src={image} alt="Fish" className="w-full h-full object-cover rounded-[2.5rem]" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur shadow-lg text-slate-800 p-2 rounded-full hover:bg-white active:scale-90 transition-all z-10"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 dark:text-blue-400 animate-pulse">
                <Camera size={38} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Identify symptoms</h3>
                <p className="text-xs text-slate-400 font-medium px-4">Capture fins, scales, or skin abnormalities clearly</p>
              </div>
              
              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Camera size={18} />
                  <span>Use Camera</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Upload size={18} />
                  <span>Upload Gallery</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Hidden Inputs */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={cameraInputRef} 
            onChange={handleImageUpload} 
          />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
          />
        </div>

        {image && !result && (
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={runAnalysis}
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black tracking-wider uppercase text-sm flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-95 ${
                loading ? 'bg-emerald-400/70 text-white' : 'bg-emerald-500 text-white hover:brightness-105 shadow-emerald-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Start AI Analysis</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
              AI Processing via Gemini 3 Flash
            </p>
          </div>
        )}

        {/* Diagnostic Results */}
        {result && (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className={`rounded-[2.5rem] p-8 shadow-2xl border-t-4 transition-colors duration-500 ${
              theme === 'dark' 
                ? 'bg-slate-900 border-white/5 border-t-emerald-500' 
                : 'bg-white border-slate-100 border-t-emerald-500'
            }`}>
              {/* Result Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disease Identified</p>
                  <h3 className={`text-2xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {result.diseaseId}
                  </h3>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 ${getConfidenceColor(result.confidence)}`}>
                  <CheckCircle2 size={12} />
                  <span>{(result.confidence * 100).toFixed(0)}% Match</span>
                </div>
              </div>

              {/* Treatment Plan Section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-blue-500">
                    <Activity size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Urgent Treatment Plan</h4>
                  </div>
                  <div className={`p-5 rounded-3xl border text-sm leading-relaxed transition-colors ${
                    theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-blue-50/30 border-blue-100/50 text-slate-600'
                  }`}>
                    {result.treatmentPlan}
                  </div>
                </div>

                {/* Recommendations List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <ShieldPlus size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">AI Expert Recommendations</h4>
                  </div>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className={`p-4 rounded-2xl flex items-start space-x-3 transition-colors ${
                        theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50'
                      }`}>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        </div>
                        <span className={`text-xs font-bold leading-snug ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Disclaimer */}
            <div className={`p-5 rounded-3xl flex items-center space-x-3 border ${
              theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'
            }`}>
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[10px] font-bold text-amber-700/80 leading-tight">
                AI diagnosis is for guidance. For severe outbreaks, consult a certified fisheries officer or vet.
              </p>
            </div>

            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white shadow-xl shadow-slate-200'
              }`}
            >
              Scan Another Specimen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;
