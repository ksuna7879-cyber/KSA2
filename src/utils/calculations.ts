import { GlucoseStatus, GlucoseTiming, UserProfile } from '../types';

/**
 * Calculates blood sugar status according to medical target thresholds
 */
export function evaluateGlucoseStatus(
  value: number,
  timing: GlucoseTiming,
  profile?: UserProfile
): {
  status: GlucoseStatus;
  label: string;
  badgeClass: string;
  advice: string;
} {
  const fastingMin = profile?.targetFastingMin || 70;
  const fastingMax = profile?.targetFastingMax || 130;
  const postMealMax = profile?.targetPostMealMax || 180;

  const isFasting = timing === 'fasting' || timing === 'before_breakfast' || timing === 'before_lunch' || timing === 'before_dinner';

  if (value < 70) {
    return {
      status: 'low',
      label: '저혈당',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300',
      advice: '사탕 3~4알, 주스 반 컵 등 단순당 15g을 즉시 섭취하고 15분 후 재측정하세요.',
    };
  }

  if (isFasting) {
    if (value <= fastingMax) {
      return {
        status: 'normal',
        label: '목표 달성',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300',
        advice: '공복 혈당이 목표 범위(70~130 mg/dL) 내에서 아주 훌륭하게 유지되고 있습니다.',
      };
    } else if (value <= 150) {
      return {
        status: 'elevated',
        label: '약간 높음',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
        advice: '전날 야식이나 수면의 질, 취침 전 혈당을 점검해 보세요.',
      };
    } else {
      return {
        status: 'high',
        label: '고혈당 주의',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300',
        advice: '공복 수치가 다소 높습니다. 처방약 복용 여부와 전날 저녁 식단을 확인하세요.',
      };
    }
  } else {
    // 식후 또는 기타
    if (value <= postMealMax) {
      return {
        status: 'normal',
        label: '목표 달성',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300',
        advice: '식후 혈당이 목표 수치(180 mg/dL 이하)로 적절히 제어되고 있습니다.',
      };
    } else if (value <= 230) {
      return {
        status: 'elevated',
        label: '식후 스파이크',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
        advice: '정제 탄수화물 과다 또는 식후 활동량 부족일 수 있습니다. 가벼운 15분 산책을 추천합니다.',
      };
    } else if (value <= 300) {
      return {
        status: 'high',
        label: '고혈당 경고',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300',
        advice: '혈당이 크게 상승했습니다. 수분을 충분히 섭취하고 무리한 격렬한 운동 대신 안정을 취하세요.',
      };
    } else {
      return {
        status: 'critical',
        label: '위험 수준',
        badgeClass: 'bg-red-200 text-red-900 border-red-400 font-bold dark:bg-red-950/60 dark:text-red-200',
        advice: '300mg/dL 초과 고혈당입니다. 케톤증 위험 또는 이상 증세가 있는지 확인하고 주치의와 상담하세요.',
      };
    }
  }
}

/**
 * Timing readable Korean label
 */
export function getTimingLabel(timing: GlucoseTiming): string {
  switch (timing) {
    case 'fasting':
      return '아침 공복';
    case 'before_breakfast':
      return '아침 식전';
    case 'after_breakfast_2h':
      return '아침 식후 2시간';
    case 'before_lunch':
      return '점심 식전';
    case 'after_lunch_2h':
      return '점심 식후 2시간';
    case 'before_dinner':
      return '저녁 식전';
    case 'after_dinner_2h':
      return '저녁 식후 2시간';
    case 'bedtime':
      return '취침 전';
    case 'night':
      return '새벽/야간';
    case 'random':
      return '수시 측정';
    default:
      return '측정';
  }
}

/**
 * Calculate calories burned using MET equation:
 * Calories = MET * Weight(kg) * (DurationMinutes / 60) * 1.05
 */
export function calculateCaloriesBurned(
  met: number,
  weightKg: number,
  durationMinutes: number,
  intensity: 'light' | 'moderate' | 'vigorous'
): number {
  let intensityFactor = 1.0;
  if (intensity === 'light') intensityFactor = 0.85;
  if (intensity === 'vigorous') intensityFactor = 1.25;

  const hours = durationMinutes / 60;
  const burned = met * intensityFactor * weightKg * hours * 1.05;
  return Math.round(burned);
}

/**
 * Estimate blood sugar drop from exercise (typical clinical range 15~60 mg/dL)
 */
export function estimateSugarDrop(
  met: number,
  durationMinutes: number,
  intensity: 'light' | 'moderate' | 'vigorous'
): number {
  let baseDrop = (durationMinutes / 10) * (met * 0.9);
  if (intensity === 'vigorous') baseDrop *= 1.2;
  if (intensity === 'light') baseDrop *= 0.85;
  // Cap realistically between 10 and 65
  return Math.min(65, Math.max(10, Math.round(baseDrop)));
}

/**
 * Generates an intelligent correlation insight from day's records
 */
export function generateDayCorrelationInsight(
  carbs: number,
  sugar: number,
  exerciseMins: number,
  peakGlucose: number,
  avgGlucose: number
): { text: string; status: 'excellent' | 'good' | 'caution' | 'warning' } {
  if (carbs > 150 && exerciseMins < 15 && peakGlucose > 190) {
    return {
      text: `오늘 탄수화물 섭취(${carbs}g)가 다소 많았으나 식후 운동이 부족하여 최고 식후 혈당이 ${peakGlucose}mg/dL까지 상승했습니다. 내일은 식후 15분 산책을 꼭 병행해 보세요!`,
      status: 'caution',
    };
  } else if (exerciseMins >= 30 && avgGlucose <= 140) {
    return {
      text: `총 ${exerciseMins}분의 운동 덕분에 탄수화물(${carbs}g)을 섭취했음에도 평균 혈당이 ${avgGlucose}mg/dL로 매우 안정적으로 유지되었습니다!`,
      status: 'excellent',
    };
  } else if (sugar > 35) {
    return {
      text: `오늘 단순 당류(${sugar}g) 섭취량이 권장치(25g 이하)를 초과했습니다. 음료나 간식류의 당류를 줄이면 식후 스파이크를 크게 방지할 수 있습니다.`,
      status: 'warning',
    };
  } else if (avgGlucose <= 135) {
    return {
      text: `식단과 활동량 밸런스가 아주 훌륭합니다. 전반적인 혈당 변동폭이 좁고 목표 범위(TIR)를 85% 이상 달성했습니다.`,
      status: 'excellent',
    };
  } else {
    return {
      text: `규칙적인 식단과 가벼운 하체 운동을 함께 이어가시면 식후 혈당이 한층 더 안정권으로 진입할 수 있습니다.`,
      status: 'good',
    };
  }
}
