
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Send, Sparkles, Volume2, Loader2, Waves } from 'lucide-react';
import { usePond, useTheme, useLanguage } from '../App';
import { getGeminiAnalysis, speakWithElevenLabs } from '../services/aiAssistantService';

const AIAssistant: React.FC = () => {
  const { pond } = usePond();
  const { theme } = useTheme();
  const { lang } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [transcript, setTranscript] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleSendMessage(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang]);

  const handleSendMessage = async (textToUse?: string) => {
    const message = textToUse || query;
    if (!message.trim()) return;

    setQuery('');
    setTranscript(prev => [...prev, { role: 'user', text: message }]);
    setIsProcessing(true);

    try {
      const aiResponse = await getGeminiAnalysis(message, pond);
      setTranscript(prev => [...prev, { role: 'ai', text: aiResponse }]);
      
      // Stop previous audio if any
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsSpeaking(true);
      const audio = await speakWithElevenLabs(aiResponse);
      if (audio) {
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 z-[70] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 active:scale-90 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform rounded-full"></div>
        <Sparkles size={24} className="relative z-10" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className={`mt-auto w-full max-w-sm mx-auto rounded-[2.5rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-20 duration-500 border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>FinGuard AI</h3>
              {isSpeaking && <p className="text-[10px] text-emerald-500 font-bold uppercase animate-pulse">AI is Speaking...</p>}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 p-2">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto mb-6 space-y-4 no-scrollbar">
          {transcript.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/5 rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="text-blue-500" size={32} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ask about Pond Alpha's metrics</p>
            </div>
          ) : (
            transcript.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : (theme === 'dark' ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5' : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100')
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isProcessing && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-3xl rounded-tl-none flex items-center space-x-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {isSpeaking && (
          <div className="flex justify-center mb-6 h-12">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className="w-1.5 bg-blue-500 rounded-full animate-wave" 
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleListening}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : (theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
            }`}
          >
            <Mic size={24} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything..."
              className={`w-full py-4 px-6 rounded-2xl text-sm outline-none transition-all border ${
                theme === 'dark' ? 'bg-slate-800 border-white/5 text-white focus:border-blue-500/50' : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-blue-500/50'
              }`}
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isProcessing || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(2); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
