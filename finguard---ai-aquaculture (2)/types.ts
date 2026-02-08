
export enum Screen {
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  DISEASE = 'DISEASE',
  COLD_STORAGE = 'COLD_STORAGE',
  ANALYTICS = 'ANALYTICS',
  PROFILE = 'PROFILE'
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  BENGALI = 'bn',
  MARATHI = 'mr',
  TELUGU = 'te',
  TAMIL = 'ta'
}

export interface PondMetrics {
  ph: number;
  temperature: number;
  dissolvedOxygen: number;
  ammonia: number;
  turbidity: number;
  salinity: number;
}

export interface PondConfig {
  id: string;
  name: string;
  tankSize: string;
  fishCount: number;
  fishType: string;
  metrics: {
    temp: string;
    ph: string;
    oxygen: string;
    ammonia: string;
  };
  healthScore: number;
}

export interface DiseaseAnalysis {
  diseaseId: string;
  confidence: number;
  treatmentPlan: string;
  recommendations: string[];
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'MEDICINE' | 'FEED' | 'EQUIPMENT' | 'SEEDS';
  price: number;
  rating: number;
  image: string;
}

export interface ColdStorage {
  id: string;
  name: string;
  distance: string;
  capacity: string;
  pricePerDay: number;
  rating: number;
  image: string;
}
