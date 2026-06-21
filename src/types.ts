export type Category = 'transportation' | 'energy' | 'food' | 'waste';

export interface ActivityLog {
  id: string;
  date: string; // YYYY-MM-DD
  category: Category;
  type: string; // e.g., "Diesel Car", "Short-haul Flight", "Grid Electricity", "Vegetarian Meal", "Recycled Waste"
  value: number; // Raw quantity
  unit: string;  // e.g., "km", "kWh", "meals", "kg"
  emissions: number; // calculated CO2 equivalent in kg
  details?: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  co2Savings: number; // estimated kg saved
  isJoined: boolean;
  isCompleted: boolean;
  progress: number; // 0 to 100
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: Category | 'general';
  icon: string; // String identifier matching Lucide icons
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface CarbonSummary {
  date: string;
  transportation: number;
  energy: number;
  food: number;
  waste: number;
  total: number;
}

export interface DailyLimitTarget {
  limit: number; // User personal ceiling in kg CO2 per day
  streak: number; // Days in a row below the limit
}
