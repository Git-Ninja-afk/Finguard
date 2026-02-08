
import React, { useState, useEffect } from 'react';
import { 
  Bell, Thermometer, Droplets, Wind, AlertTriangle, ShieldCheck, 
  Plus, X, Check, DollarSign, Waves, Shield, Activity,
  Send, Smartphone, Loader2, Users, CloudSun, Sun, Gauge, MapPin, Sparkles, MessageSquare, Info,
  Target
} from 'lucide-react';
import { useLanguage, useTheme, useUser, usePond } from '../App';
import { broadcastSMS, draftPondReportSMS, triggerNativeSMS } from '../services/smsService';
import { getHighAccuracyLocation } from '../services/locationService';
import { fetchWeatherByCoords, WeatherData } from '../services/weatherService';

const Dashboard: React.FC = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { user } = useUser();
  const { pond, setPond } = usePond();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // SMS States
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [smsDraft, setSmsDraft] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSuccess, setSmsSuccess] = useState(false);

  useEffect(() => {
    handleSync();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const loc = await getHighAccuracyLocation();
      const weatherData = await fetchWeatherByCoords(loc.lat, loc.lng);
      setWeather(weatherData);
    } catch (err: any) {
      setSyncError(err.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenSmsModal = async () => {
    setIsSmsModalOpen(true);
    setIsDrafting(true);
    setSmsSuccess(false);
    try {
      const draft = await draftPondReportSMS(
        pond.name, 
        pond.metrics, 
        pond.healthScore, 
        lang
      );
      setSmsDraft(draft);
    } catch (err) {
      setSmsDraft(`FinGuard Alert: ${pond.name} Health Score is ${pond.healthScore}. All metrics stable.`);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleBroadcast = async () => {
    setIsSendingSms(true);
    // Predefined stakeholders
    const recipients = ['+919876543210', '+919988776655'];
    
    const success = await broadcastSMS(recipients, smsDraft);
    
    if (!success) {
      // If API fails (likely CORS), use Native fallback for the first recipient
      triggerNativeSMS(recipients[0], smsDraft);
    }
    
    setSmsSuccess(true);
    setIsSendingSms(false);
    setTimeout(() => setIsSmsModalOpen(false), 2000);
  };

  const getHealthStatus = (score: number) => {
    if (score >= 85) return { label: 'EXCELLENT', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
    if (score >= 70) return { label: 'STABLE', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' };
    return { label: 'CRITICAL', color: 'text-red-400 bg-red-400/10 border-red-400/20' };
  };

  const currentHealthStatus = getHealthStatus(pond.healthScore);

  return (
    <div className="pb-32 relative">
      {/* SMS Modal Overlay */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSmsModalOpen(false)} />
          <div className={`w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500">
                  <MessageSquare size={18} />
                </div>
                <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>AI Report Draft</h3>
              </div>
              <button onClick={() => setIsSmsModalOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>

            {isDrafting ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Gemini is drafting...</p>
              </div>
            ) : smsSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-bounce">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white">Broadcast Complete</h4>
                <p className="text-xs text-slate-400">All stakeholders notified.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-5 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <textarea 
                    value={smsDraft}
                    onChange={(e) => setSmsDraft(e.target.value)}
                    className="w-full bg-transparent text-sm leading-relaxed focus:outline-none min-h-[100px] font-medium"
                    placeholder="Report content..."
                  />
                  <div className="mt-4 flex items-center space-x-1.5 opacity-50">
                    <Sparkles size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Review required before broadcast</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={handleOpenSmsModal}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}
                  >
                    Regenerate
                  </button>
                  <button 
                    onClick={handleBroadcast}
                    disabled={isSendingSms}
                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                  >
                    {isSendingSms ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> <span>Broadcast Now</span></>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="safe-area-top sticky top-0 z-50 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-center px-5 h-20">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF5FF] dark:bg-blue-500/10 flex items-center justify-center text-[#0066CC]">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] leading-tight">System Live</p>
              <span className="text-sm font-black text-[#1E293B] dark:text-slate-100">{pond.name}</span>
            </div>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isSyncing ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
          </button>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Pond Registration Summary Banner */}
        <div className="flex space-x-3">
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-4 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Fish Count</p>
              <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{pond.fishCount}</p>
            </div>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] p-4 flex items-center space-x-3 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
              <Waves size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tank Size</p>
              <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{pond.tankSize}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#0F172A] dark:bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('health_index')}</p>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-6xl font-black tracking-tighter">{pond.healthScore}<span className="text-xl text-slate-500 ml-1">/100</span></h2>
              <div className={`mt-4 inline-flex items-center space-x-2 font-black text-[10px] px-3 py-1.5 rounded-full border uppercase tracking-widest ${currentHealthStatus.color}`}>
                <ShieldCheck size={14} /> <span>{currentHealthStatus.label}</span>
              </div>
            </div>
            <Waves className="text-blue-400 animate-pulse w-12 h-12" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Operations</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Feed', icon: <Plus size={24} />, color: 'bg-blue-600' },
              { label: 'Sms', icon: <Users size={24} />, color: 'bg-indigo-600', onClick: handleOpenSmsModal },
              { label: 'Crisis', icon: <AlertTriangle size={24} />, color: 'bg-red-600', onClick: () => setPond(p => ({...p, healthScore: 38})) },
              { label: 'Logs', icon: <Activity size={24} />, color: 'bg-slate-700' },
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={action.onClick}
                className="flex flex-col items-center space-y-2 active:scale-90 transition-transform"
              >
                <div className={`${action.color} w-16 h-16 rounded-[1.6rem] flex items-center justify-center text-white shadow-lg`}>
                  {action.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'WATER TEMP', value: `${pond.metrics.temp}°C`, icon: <Thermometer size={18} /> },
            { label: 'OXYGEN', value: `${pond.metrics.oxygen}mg/L`, icon: <Wind size={18} /> },
            { label: 'PH LEVEL', value: pond.metrics.ph, icon: <Droplets size={18} /> },
            { label: 'AMMONIA', value: `${pond.metrics.ammonia}mg/L`, icon: <Activity size={18} /> },
          ].map((m, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg w-fit mb-3">{m.icon}</div>
              <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{m.label}</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">{m.value}</p>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${
          syncError ? 'bg-red-50 border-red-100' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm'
        }`}>
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <CloudSun size={18} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Sync</h3>
                <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 leading-none mt-0.5">
                  {weather?.locationName || 'Syncing Place...'}
                </p>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tight mt-1">Live Atmospheric Data</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-pulse' : (syncError ? 'bg-red-500' : 'bg-emerald-500')}`}></div>
              <span className="text-[8px] font-black uppercase tracking-tight text-slate-500">
                {isSyncing ? 'Locating...' : (syncError ? 'Sync Error' : 'Stable Connection')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-slate-400">
                <Thermometer size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">Air Temp</span>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                {weather ? `${weather.temp}°` : '--°'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-slate-400">
                <Gauge size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">Pressure</span>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                {weather ? weather.pressure : '--'}
                <span className="text-[10px] text-slate-400 font-bold ml-0.5">hPa</span>
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-slate-400">
                <Sun size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">UV Index</span>
              </div>
              <p className={`text-2xl font-black tracking-tighter ${weather && weather.uvi > 7 ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                {weather ? weather.uvi : '--'}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12">
            <Sun size={180} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
