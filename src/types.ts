export type DiabetesType = 'type1' | 'type2' | 'prediabetes' | 'gestational';

export type UserRoleMode = 'self' | 'caregiver';

export type LoginProvider = 'kakao' | 'naver' | 'google' | 'apple' | 'email';

export interface LoginHistoryRecord {
  id: string;
  timestamp: string; // ISO string
  provider: LoginProvider;
  deviceName: string; // e.g. "Chrome / Windows 11", "Safari / iPhone 15"
  ipAddress: string;  // e.g. "211.234.xx.45"
  location: string;   // e.g. "대한민국 서울특별시"
  status: 'success' | 'suspicious' | 'blocked';
  isCurrentDevice: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  diabetesType: DiabetesType;
  targetFastingMin: number; // mg/dL (e.g. 70)
  targetFastingMax: number; // mg/dL (e.g. 130)
  targetPostMealMax: number; // mg/dL (e.g. 180)
  medication: string[];
  caregiverName?: string;
  caregiverRelation?: string;
}

export type MealTimeType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type GlucoseTiming = 
  | 'fasting'              // 공복
  | 'before_breakfast'     // 아침 식전
  | 'after_breakfast_2h'   // 아침 식후 2시간
  | 'before_lunch'         // 점심 식전
  | 'after_lunch_2h'       // 점심 식후 2시간
  | 'before_dinner'        // 저녁 식전
  | 'after_dinner_2h'      // 저녁 식후 2시간
  | 'bedtime'              // 취침 전
  | 'night'                // 야간 / 새벽
  | 'random';              // 불시 측정

export type GlucoseStatus = 'low' | 'normal' | 'elevated' | 'high' | 'critical';

export interface GlucoseRecord {
  id: string;
  timestamp: string; // ISO string
  value: number; // mg/dL
  timing: GlucoseTiming;
  status: GlucoseStatus;
  notes?: string;
  linkedMealId?: string;
  linkedExerciseId?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'staple' | 'soup_stew' | 'meat_fish' | 'vegetable' | 'snack' | 'drink' | 'fruit';
  portion: string; // e.g. "1공기 (210g)"
  calories: number; // kcal
  carbs: number; // g
  protein: number; // g
  fat: number; // g
  sugar: number; // g
  giLevel: 'low' | 'medium' | 'high'; // Glycemic Index
}

export interface MealRecord {
  id: string;
  timestamp: string; // ISO string
  type: MealTimeType;
  items: {
    food: FoodItem;
    quantity: number; // multiplier e.g. 1, 0.5, 2
  }[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalSugar: number;
  photoUrl?: string;
  notes?: string;
  spikeRisk: 'low' | 'moderate' | 'high';
  aiFeedback?: string;
}

export type ExerciseType = 'cardio' | 'strength' | 'flexibility';

export interface ExerciseCategory {
  id: string;
  name: string;
  type: ExerciseType;
  met: number; // Metabolic Equivalent of Task
  recommendedTiming: string; // e.g. "식후 30분~1시간 후"
  description: string;
  iconName: string;
}

export interface ExerciseRecord {
  id: string;
  timestamp: string; // ISO string
  exerciseName: string;
  exerciseType: ExerciseType;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'vigorous';
  caloriesBurned: number;
  notes?: string;
  estimatedBloodSugarDrop: number; // mg/dL reduction estimate
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'post_meal_alert' | 'medication' | 'cheer' | 'warning';
  read: boolean;
  actionUrl?: string;
}

export interface HealthBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate?: string;
  progress: number; // 0 - 100
  unlocked: boolean;
}

export interface CorrelationDaySummary {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  avgGlucose: number;
  fastingGlucose?: number;
  peakPostMealGlucose?: number;
  totalCarbs: number;
  totalSugar: number;
  totalExerciseMinutes: number;
  exerciseCalories: number;
  tirScore: number; // % in target range
  insightText: string;
  status: 'excellent' | 'good' | 'caution' | 'warning';
}
