
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Screen, Language, PondConfig } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import DiseaseDetection from './screens/DiseaseDetection';
import Marketplace from './screens/Marketplace';
import ColdStorageScreen from './screens/ColdStorage';
import Analytics from './screens/Analytics';
import Profile from './screens/Profile';
import Login from './screens/Login';
import LanguageSelection from './screens/LanguageSelection';
import AIAssistant from './components/AIAssistant';
import { COLORS, TRANSLATIONS } from './constants';

interface UserData {
  name: string;
  phone: string;
  email: string;
  type: 'google' | 'standard';
}

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface UserContextType {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
}

interface PondContextType {
  pond: PondConfig;
  setPond: React.Dispatch<React.SetStateAction<PondConfig>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);
const PondContext = createContext<PondContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};

export const usePond = () => {
  const context = useContext(PondContext);
  if (!context) throw new Error("usePond must be used within PondProvider");
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('finguard-theme') as 'light' | 'dark') || 'light';
  });

  // Global coherent pond data
  const [pond, setPond] = useState<PondConfig>({
    id: 'POND-ALPHA-01',
    name: 'Pond Alpha',
    tankSize: '5,000 Liters',
    fishCount: 1200,
    fishType: 'Rohu & Catla',
    metrics: {
      temp: '28.5',
      ph: '7.8',
      oxygen: '6.2',
      ammonia: '0.02'
    },
    healthScore: 84
  });

  useEffect(() => {
    localStorage.setItem('finguard-theme', theme);
  }, [theme]);

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setIsLanguageSelected(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.DASHBOARD: return <Dashboard />;
      case Screen.DISEASE: return <DiseaseDetection />;
      case Screen.MARKETPLACE: return <Marketplace />;
      case Screen.COLD_STORAGE: return <ColdStorageScreen />;
      case Screen.ANALYTICS: return <Analytics />;
      case Screen.PROFILE: return <Profile />;
      default: return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <UserContext.Provider value={{ user, setUser }}>
        <Login onLogin={() => {}} />
      </UserContext.Provider>
    );
  }

  if (!isLanguageSelected) {
    return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <LanguageSelection onSelect={handleLanguageSelect} />
      </LanguageContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <LanguageContext.Provider value={{ lang, setLang, t }}>
          <PondContext.Provider value={{ pond, setPond }}>
            <div 
              className={`min-h-screen max-w-lg mx-auto flex flex-col relative animate-in fade-in duration-1000 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0F172A] dark' : 'bg-[#F5F8FA]'}`}
              style={{ color: theme === 'dark' ? '#F1F5F9' : COLORS.darkText }}
            >
              <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {renderScreen()}
              </main>

              {/* AI Assistant Button Overlay */}
              <AIAssistant />

              <BottomNav 
                currentScreen={currentScreen} 
                onScreenChange={setCurrentScreen} 
              />
            </div>
          </PondContext.Provider>
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
