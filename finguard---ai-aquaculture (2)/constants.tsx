
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Camera, 
  Warehouse, 
  User 
} from 'lucide-react';
import { Screen, MarketplaceItem, ColdStorage, Language } from './types';

export const COLORS = {
  oceanBlue: '#0066CC',
  growthGreen: '#00A86B',
  coralAlert: '#FF6B35',
  darkText: '#1A1A1A',
  lightBG: '#F5F8FA',
};

export const NAV_ITEMS = [
  { id: Screen.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={24} /> },
  { id: Screen.MARKETPLACE, label: 'Market', icon: <ShoppingBag size={24} /> },
  { id: Screen.DISEASE, label: 'Detect', icon: <Camera size={24} /> },
  { id: Screen.COLD_STORAGE, label: 'Storage', icon: <Warehouse size={24} /> },
  { id: Screen.PROFILE, label: 'Profile', icon: <User size={24} /> },
];

export const TRANSLATIONS: any = {
  en: {
    home: "Home",
    market: "Market",
    detect: "Detect",
    storage: "Storage",
    profile: "Profile",
    health_index: "Pond Health Index",
    excellent: "EXCELLENT CONDITION",
    quick_actions: "QUICK ACTIONS",
    add_feeding: "Add Feeding",
    water_test: "Water Test",
    harvesting: "Harvesting",
    expenses: "Expenses",
    temp: "Temperature",
    ph: "pH Level",
    oxygen: "Oxygen",
    ammonia: "Ammonia",
    aeration_needed: "Evening Aeration Needed",
    view_history: "VIEW HISTORY",
    your_farm: "YOUR FARM",
    logout: "LOGOUT SESSION",
    settings: "Farm Settings",
    language: "Language",
    sign_out: "SIGN OUT FROM FARM"
  },
  hi: {
    home: "मुख्य",
    market: "बाजार",
    detect: "जांच",
    storage: "स्टोरेज",
    profile: "प्रोफ़ाइल",
    health_index: "तालाब स्वास्थ्य सूचकांक",
    excellent: "उत्कृष्ट स्थिति",
    quick_actions: "त्वरित कार्रवाई",
    add_feeding: "चारा डालें",
    water_test: "पानी की जांच",
    harvesting: "कटाई",
    expenses: "खर्च",
    temp: "तापमान",
    ph: "पीएच स्तर",
    oxygen: "ऑक्सीजन",
    ammonia: "अमोनिया",
    aeration_needed: "शाम को वातन की आवश्यकता",
    view_history: "इतिहास देखें",
    your_farm: "आपका फार्म",
    logout: "सत्र समाप्त करें",
    settings: "फार्म सेटिंग्स",
    language: "भाषा",
    sign_out: "फार्म से बाहर निकलें"
  },
  bn: {
    home: "হোম",
    market: "বাজার",
    detect: "শনাক্ত",
    storage: "স্টোরেজ",
    profile: "প্রোফাইল",
    health_index: "পুকুর স্বাস্থ্য সূচক",
    excellent: "চমৎকার অবস্থা",
    quick_actions: "দ্রুত পদক্ষেপ",
    add_feeding: "খাবার যোগ করুন",
    water_test: "জল পরীক্ষা",
    harvesting: "মাছ ধরা",
    expenses: "খরচ",
    temp: "তাপমাত্রা",
    ph: "পিএইচ স্তর",
    oxygen: "অক্সিজেন",
    ammonia: "অ্যামোনিয়া",
    aeration_needed: "সন্ধ্যায় বাতান প্রয়োজন",
    view_history: "ইতিহাস দেখুন",
    your_farm: "আপনার খামার",
    logout: "লগআউট",
    settings: "খামার সেটিংস",
    language: "ভাষা",
    sign_out: "খামার থেকে প্রস্থান করুন"
  },
  mr: {
    home: "मुख्य",
    market: "बाजार",
    detect: "तपासणी",
    storage: "साठवणूक",
    profile: "प्रोफाइल",
    health_index: "तलाव आरोग्य निर्देशांक",
    excellent: "उत्कृष्ट स्थिती",
    quick_actions: "त्वरित कृती",
    add_feeding: "खाद्य टाका",
    water_test: "पाणी चाचणी",
    harvesting: "काढणी",
    expenses: "खर्च",
    temp: "तापमान",
    ph: "पीएच पातळी",
    oxygen: "ऑक्सिजन",
    ammonia: "अमोनिया",
    aeration_needed: "संध्याकाळी एअरेशनची गरज",
    view_history: "इतिहास पहा",
    your_farm: "तुमचा फार्म",
    logout: "लॉगआउट",
    settings: "फार्म सेटिंग्ज",
    language: "भाषा",
    sign_out: "फार्म मधून बाहेर पडा"
  },
  te: {
    home: "హోమ్",
    market: "మార్కెట్",
    detect: "గుర్తించు",
    storage: "స్టోరేజ్",
    profile: "ప్రొఫైల్",
    health_index: "చెరువు ఆరోగ్య సూచిక",
    excellent: "అద్భుతమైన స్థితి",
    quick_actions: "త్వరిత చర్యలు",
    add_feeding: "మేత జోడించు",
    water_test: "నీటి పరీక్ష",
    harvesting: "కోత",
    expenses: "ఖర్చులు",
    temp: "ఉష్ణోగ్రత",
    ph: "pH స్థాయి",
    oxygen: "ఆక్సిజన్",
    ammonia: "అమ్మోనియా",
    aeration_needed: "సాయంత్రం గాలి అవసరం",
    view_history: "చరిత్ర చూడండి",
    your_farm: "మీ ఫామ్",
    logout: "లాగ్ అవుట్",
    settings: "ఫామ్ సెట్టింగ్స్",
    language: "భాష",
    sign_out: "ఫామ్ నుండి నిష్క్రమించు"
  },
  ta: {
    home: "முகப்பு",
    market: "சந்தை",
    detect: "கண்டறி",
    storage: "சேமிப்பு",
    profile: "சுயவிவரம்",
    health_index: "குளத்தின் ஆரோக்கிய குறியீடு",
    excellent: "சிறந்த நிலை",
    quick_actions: "விரைவான செயல்கள்",
    add_feeding: "தீவனம் சேர்",
    water_test: "நீர் சோதனை",
    harvesting: "அறுவடை",
    expenses: "செலவுகள்",
    temp: "வெப்பநிலை",
    ph: "pH அளவு",
    oxygen: "ஆக்ஸிஜன்",
    ammonia: "அம்மோனியா",
    aeration_needed: "மாலை காற்றோட்டம் தேவை",
    view_history: "வரலாற்றைக் காண்க",
    your_farm: "உங்கள் பண்ணை",
    logout: "வெளியேறு",
    settings: "பண்ணை அமைப்புகள்",
    language: "மொழி",
    sign_out: "பண்ணையிலிருந்து வெளியேறு"
  }
};

export const MOCK_MARKETPLACE: MarketplaceItem[] = [
  { 
    id: '1', 
    name: 'Premium Fish Feed', 
    category: 'FEED', 
    price: 1200, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    name: 'Water Test Kit Pro', 
    category: 'EQUIPMENT', 
    price: 850, 
    rating: 4.5, 
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    name: 'Oxytetracycline Soluble', 
    category: 'MEDICINE', 
    price: 450, 
    rating: 4.2, 
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f159f96d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '4', 
    name: 'High-Yield Rohu Seeds', 
    category: 'SEEDS', 
    price: 2500, 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=800&auto=format&fit=crop' 
  },
];

export const MOCK_COLD_STORAGE: ColdStorage[] = [
  { 
    id: '1', 
    name: 'Haldia Cold Chain', 
    distance: '12km', 
    capacity: '50 MT', 
    pricePerDay: 45, 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    name: 'Coastal Freeze Services', 
    distance: '28km', 
    capacity: '120 MT', 
    pricePerDay: 40, 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    name: 'Barasat Agri-Freeze', 
    distance: '45km', 
    capacity: '30 MT', 
    pricePerDay: 50, 
    rating: 4.1, 
    image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?q=80&w=800&auto=format&fit=crop' 
  },
];
