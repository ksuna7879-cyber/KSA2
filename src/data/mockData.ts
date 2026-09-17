import {
  UserProfile,
  GlucoseRecord,
  MealRecord,
  ExerciseRecord,
  NotificationItem,
  HealthBadge,
  CorrelationDaySummary,
  LoginHistoryRecord
} from '../types';
import { FOOD_DATABASE } from './foodDatabase';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: '김철수',
  age: 58,
  gender: 'male',
  height: 172,
  weight: 71,
  diabetesType: 'type2',
  targetFastingMin: 70,
  targetFastingMax: 130,
  targetPostMealMax: 180,
  medication: ['메트포르민 500mg (아침/저녁)', 'SGLT-2 억제제 10mg'],
  caregiverName: '김민지 (자녀)',
  caregiverRelation: '딸',
};

export const CAREGIVER_PARENT_PROFILE: UserProfile = {
  name: '이영희 (어머니)',
  age: 74,
  gender: 'female',
  height: 156,
  weight: 58,
  diabetesType: 'type2',
  targetFastingMin: 80,
  targetFastingMax: 140,
  targetPostMealMax: 190,
  medication: ['당뇨약 1정 (아침 식후)', '혈압약 1정'],
  caregiverName: '김철수 (보호자)',
  caregiverRelation: '아들',
};

// Helper to make timestamps for the last 5 days
const now = new Date();
const formatISO = (daysAgo: number, hour: number, minute: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const INITIAL_GLUCOSE_RECORDS: GlucoseRecord[] = [
  // 오늘 (0일 전)
  {
    id: 'g-0-1',
    timestamp: formatISO(0, 7, 30),
    value: 108,
    timing: 'fasting',
    status: 'normal',
    notes: '전날 저녁 소식 후 편안한 수면',
  },
  {
    id: 'g-0-2',
    timestamp: formatISO(0, 10, 0),
    value: 142,
    timing: 'after_breakfast_2h',
    status: 'normal',
    notes: '현미밥과 두부된장찌개 섭취 후 20분 가벼운 걷기',
  },
  {
    id: 'g-0-3',
    timestamp: formatISO(0, 14, 15),
    value: 168,
    timing: 'after_lunch_2h',
    status: 'normal',
    notes: '직장 동료들과 일반식, 식후 15분 계단 오르기',
  },

  // 어제 (1일 전)
  {
    id: 'g-1-1',
    timestamp: formatISO(1, 7, 20),
    value: 114,
    timing: 'fasting',
    status: 'normal',
  },
  {
    id: 'g-1-2',
    timestamp: formatISO(1, 10, 10),
    value: 135,
    timing: 'after_breakfast_2h',
    status: 'normal',
    notes: '달걀 2알과 호밀빵',
  },
  {
    id: 'g-1-3',
    timestamp: formatISO(1, 14, 30),
    value: 195,
    timing: 'after_lunch_2h',
    status: 'elevated',
    notes: '외식으로 자장면 섭취 후 운동 못함 -> 혈당 스파이크 발생',
  },
  {
    id: 'g-1-4',
    timestamp: formatISO(1, 21, 0),
    value: 148,
    timing: 'after_dinner_2h',
    status: 'normal',
    notes: '저녁 후 실내 자전거 30분 운동으로 혈당 강하',
  },

  // 2일 전
  {
    id: 'g-2-1',
    timestamp: formatISO(2, 7, 15),
    value: 119,
    timing: 'fasting',
    status: 'normal',
  },
  {
    id: 'g-2-2',
    timestamp: formatISO(2, 10, 0),
    value: 138,
    timing: 'after_breakfast_2h',
    status: 'normal',
  },
  {
    id: 'g-2-3',
    timestamp: formatISO(2, 14, 10),
    value: 152,
    timing: 'after_lunch_2h',
    status: 'normal',
  },
  {
    id: 'g-2-4',
    timestamp: formatISO(2, 21, 15),
    value: 140,
    timing: 'after_dinner_2h',
    status: 'normal',
  },

  // 3일 전
  {
    id: 'g-3-1',
    timestamp: formatISO(3, 7, 40),
    value: 122,
    timing: 'fasting',
    status: 'normal',
  },
  {
    id: 'g-3-2',
    timestamp: formatISO(3, 14, 0),
    value: 175,
    timing: 'after_lunch_2h',
    status: 'normal',
  },
  {
    id: 'g-3-3',
    timestamp: formatISO(3, 21, 30),
    value: 162,
    timing: 'after_dinner_2h',
    status: 'normal',
  },

  // 4일 전
  {
    id: 'g-4-1',
    timestamp: formatISO(4, 7, 25),
    value: 112,
    timing: 'fasting',
    status: 'normal',
  },
  {
    id: 'g-4-2',
    timestamp: formatISO(4, 14, 20),
    value: 145,
    timing: 'after_lunch_2h',
    status: 'normal',
  },
  {
    id: 'g-4-3',
    timestamp: formatISO(4, 21, 10),
    value: 139,
    timing: 'after_dinner_2h',
    status: 'normal',
  },
];

export const INITIAL_MEAL_RECORDS: MealRecord[] = [
  // 오늘 아침
  {
    id: 'm-0-1',
    timestamp: formatISO(0, 8, 0),
    type: 'breakfast',
    items: [
      { food: FOOD_DATABASE[0], quantity: 0.8 }, // 현미밥
      { food: FOOD_DATABASE[9], quantity: 1 },   // 우렁된장찌개
      { food: FOOD_DATABASE[15], quantity: 1 },  // 두부 부침
      { food: FOOD_DATABASE[18], quantity: 1 },  // 시금치 나물
    ],
    totalCalories: 480,
    totalCarbs: 62,
    totalProtein: 28,
    totalFat: 14,
    totalSugar: 4.8,
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    notes: '잡곡 비율을 늘리고 채소 먼저 천천히 씹어먹음',
    spikeRisk: 'low',
    aiFeedback: '탄수화물과 식이섬유, 단백질 균형이 우수합니다. 식후 혈당이 매우 완만할 것으로 예상됩니다.',
  },
  // 오늘 점심
  {
    id: 'm-0-2',
    timestamp: formatISO(0, 12, 20),
    type: 'lunch',
    items: [
      { food: FOOD_DATABASE[1], quantity: 0.7 }, // 백미밥 70%
      { food: FOOD_DATABASE[12], quantity: 1 },  // 닭가슴살 구이
      { food: FOOD_DATABASE[17], quantity: 1 },  // 모둠 쌈채소
      { food: FOOD_DATABASE[11], quantity: 1 },  // 소고기 뭇국
    ],
    totalCalories: 510,
    totalCarbs: 58,
    totalProtein: 42,
    totalFat: 12,
    totalSugar: 3.2,
    photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    notes: '상추와 깻잎을 듬뿍 싸서 먹음',
    spikeRisk: 'low',
    aiFeedback: '고단백 저당 식단입니다. 쌈채소의 풍부한 식이섬유가 소화 흡수 속도를 늦춰주었습니다.',
  },

  // 어제 점심 (외식 자장면 - 스파이크 유발 식단)
  {
    id: 'm-1-2',
    timestamp: formatISO(1, 12, 30),
    type: 'lunch',
    items: [
      { food: FOOD_DATABASE[5], quantity: 1 }, // 짜장면
      { food: FOOD_DATABASE[25], quantity: 1 }, // 믹스커피
    ],
    totalCalories: 835,
    totalCarbs: 134,
    totalProtein: 22,
    totalFat: 21,
    totalSugar: 20,
    photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    notes: '부서 회식으로 어쩔 수 없이 면 요리 섭취',
    spikeRisk: 'high',
    aiFeedback: '정제 밀가루와 달콤한 춘장 소스로 단순당과 탄수화물이 매우 높습니다. 2시간 뒤 혈당 스파이크(195mg/dL)의 직접적 원인이 되었습니다.',
  },

  // 어제 저녁
  {
    id: 'm-1-3',
    timestamp: formatISO(1, 18, 50),
    type: 'dinner',
    items: [
      { food: FOOD_DATABASE[7], quantity: 1 }, // 두부면 콩국수
      { food: FOOD_DATABASE[14], quantity: 1 }, // 삶은 달걀
      { food: FOOD_DATABASE[20], quantity: 1 }, // 오이 스틱
    ],
    totalCalories: 395,
    totalCarbs: 18,
    totalProtein: 35,
    totalFat: 18,
    totalSugar: 5.5,
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    notes: '점심 과식 반성으로 저녁은 저탄수 두부면',
    spikeRisk: 'low',
    aiFeedback: '점심 고탄수화물을 만회하는 훌륭한 저탄수 고단백 저녁 식단입니다.',
  }
];

export const INITIAL_EXERCISE_RECORDS: ExerciseRecord[] = [
  // 오늘 아침 산책
  {
    id: 'e-0-1',
    timestamp: formatISO(0, 8, 45),
    exerciseName: '가벼운 식후 산책',
    exerciseType: 'cardio',
    durationMinutes: 25,
    intensity: 'light',
    caloriesBurned: 95,
    estimatedBloodSugarDrop: 24,
    notes: '아침 식사 30분 후 동네 공원 한 바퀴',
  },
  // 오늘 점심 계단오르기
  {
    id: 'e-0-2',
    timestamp: formatISO(0, 13, 10),
    exerciseName: '아파트 계단 천천히 오르기',
    exerciseType: 'strength',
    durationMinutes: 15,
    intensity: 'moderate',
    caloriesBurned: 115,
    estimatedBloodSugarDrop: 32,
    notes: '회사 1층부터 8층까지 천천히 2번 반복 오르기',
  },
  // 어제 저녁 실내 자전거
  {
    id: 'e-1-1',
    timestamp: formatISO(1, 19, 45),
    exerciseName: '실내 고정식 자전거',
    exerciseType: 'cardio',
    durationMinutes: 30,
    intensity: 'moderate',
    caloriesBurned: 195,
    estimatedBloodSugarDrop: 42,
    notes: 'TV 뉴스 보며 시속 18km 수준으로 가볍게 페달링',
  },
  // 2일 전 스쿼트
  {
    id: 'e-2-1',
    timestamp: formatISO(2, 19, 30),
    exerciseName: '의자 스쿼트 & 까치발 들기',
    exerciseType: 'strength',
    durationMinutes: 20,
    intensity: 'moderate',
    caloriesBurned: 105,
    estimatedBloodSugarDrop: 28,
    notes: '거실에서 의자 잡고 안전하게 15회씩 4세트',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '⏰ 식후 2시간 혈당 측정 알림',
    message: '점심 식사 시작 후 2시간이 경과했습니다. 혈당을 측정하여 기록해 보세요!',
    time: '방금 전',
    type: 'post_meal_alert',
    read: false,
  },
  {
    id: 'notif-2',
    title: '💊 저녁 당뇨약 복용 시간입니다',
    message: '처방받으신 메트포르민 500mg을 복용하실 시간입니다. 위장 장애 예방을 위해 식후 복용하세요.',
    time: '2시간 전',
    type: 'medication',
    read: false,
  },
  {
    id: 'notif-3',
    title: '🎉 3일 연속 식후 산책 달성!',
    message: '김철수 님, 꾸준한 식후 유산소 운동으로 평균 식후 혈당이 18mg/dL 개선되었습니다.',
    time: '어제',
    type: 'cheer',
    read: true,
  },
];

export const INITIAL_BADGES: HealthBadge[] = [
  {
    id: 'b1',
    title: '첫 기록의 시작',
    description: '혈당, 식단, 운동을 모두 처음 기록 완료',
    icon: 'Sparkles',
    earnedDate: '2026.09.12',
    progress: 100,
    unlocked: true,
  },
  {
    id: 'b2',
    title: '3일 연속 혈당 마스터',
    description: '연속 3일간 공복과 식후 혈당을 거르지 않고 기록',
    icon: 'Flame',
    earnedDate: '2026.09.15',
    progress: 100,
    unlocked: true,
  },
  {
    id: 'b3',
    title: '식후 걷기 수호자',
    description: '식후 20분 이상 산책 10회 이상 완료',
    icon: 'Footprints',
    earnedDate: undefined,
    progress: 70, // 7/10
    unlocked: false,
  },
  {
    id: 'b4',
    title: '혈당 안심 구역 (TIR 80%)',
    description: '주간 혈당 목표 범위(TIR) 80% 이상 달성',
    icon: 'ShieldCheck',
    earnedDate: '2026.09.16',
    progress: 100,
    unlocked: true,
  },
  {
    id: 'b5',
    title: '하체 근육 발전소',
    description: '의자 스쿼트 & 종아리 운동 15세트 완료',
    icon: 'Activity',
    earnedDate: undefined,
    progress: 50,
    unlocked: false,
  }
];

export const INITIAL_LOGIN_HISTORY: LoginHistoryRecord[] = [
  {
    id: 'log-1',
    timestamp: formatISO(0, 7, 15),
    provider: 'kakao',
    deviceName: 'Chrome 128 / Windows 11',
    ipAddress: '211.234.52.18',
    location: '대한민국 서울특별시 강남구',
    status: 'success',
    isCurrentDevice: true,
  },
  {
    id: 'log-2',
    timestamp: formatISO(1, 12, 10),
    provider: 'kakao',
    deviceName: 'Mobile Safari / iPhone 15 Pro',
    ipAddress: '223.38.19.42',
    location: '대한민국 서울특별시 서초구 (모바일)',
    status: 'success',
    isCurrentDevice: false,
  },
  {
    id: 'log-3',
    timestamp: formatISO(2, 8, 30),
    provider: 'naver',
    deviceName: 'Chrome 128 / Windows 11',
    ipAddress: '211.234.52.18',
    location: '대한민국 서울특별시 강남구',
    status: 'success',
    isCurrentDevice: false,
  },
  {
    id: 'log-4',
    timestamp: formatISO(3, 22, 15),
    provider: 'google',
    deviceName: 'Samsung Internet / Galaxy S24',
    ipAddress: '175.202.88.91',
    location: '대한민국 경기도 성남시 분당구',
    status: 'success',
    isCurrentDevice: false,
  },
  {
    id: 'log-5',
    timestamp: formatISO(5, 3, 42),
    provider: 'kakao',
    deviceName: 'Firefox / Linux (Ubuntu)',
    ipAddress: '194.26.29.112',
    location: '해외 의심 IP (네덜란드 암스테르담)',
    status: 'blocked',
    isCurrentDevice: false,
  }
];

export const HEALTH_GUIDES = [
  {
    id: 'g1',
    title: '당뇨 환자가 꼭 알아야 할 착한 GI(혈당지수) 식품 가이드',
    category: '식재료 정보',
    readTime: '3분',
    summary: '같은 칼로리라도 혈당을 급격히 올리는 고GI 식품과 천천히 올리는 저GI 식품의 차이점을 한눈에 정리했습니다.',
    highlights: [
      '피해야 할 고GI(70 이상): 찹쌀떡, 흰 식빵, 라면, 감자튀김, 달콤한 믹스커피',
      '적극 추천 저GI(55 이하): 귀리, 보리, 브로콜리, 두부, 달걀, 생선류, 아몬드',
      '거꾸로 식사법: 채소(식이섬유) -> 단백질(고기/두부) -> 탄수화물(밥) 순서로 먹기',
    ],
    bgClass: 'from-emerald-50 to-teal-50 border-emerald-200',
  },
  {
    id: 'g2',
    title: '식후 15분, 거실 의자로 끝내는 하체 근육 당소모 홈트레이닝',
    category: '홈트레이닝 가이드',
    readTime: '4분',
    summary: '우리 몸 포도당의 약 70%는 하체 허벅지와 종아리 근육에서 흡수·소모됩니다. 관절 무리 없는 3가지 동작!',
    highlights: [
      '1. 의자 앉았다 일어서기(체어 스쿼트): 무릎에 부담 없이 대퇴사두근 자극 (15회 x 3세트)',
      '2. 식탁 잡고 까치발 들기(가자미근 운동): 혈액 순환 및 식후 포도당 연소 촉진',
      '3. 실내 제자리 무릎 높여 걷기: TV를 보며 식후 30분 시점에 10분간 실시',
    ],
    bgClass: 'from-blue-50 to-indigo-50 border-blue-200',
  },
  {
    id: 'g3',
    title: '입이 심심할 때 안심하고 먹는 당뇨 추천 간식 5가지',
    category: '식단 팁',
    readTime: '2분',
    summary: '무조건 굶는 것은 저혈당과 폭식을 부릅니다. 혈당 변화가 거의 없는 안전한 든든 간식 리스트.',
    highlights: [
      '구운 무염 견과류 한 줌 (호두, 아몬드 25g)',
      '무가당 그릭 요거트에 블루베리 10알',
      '방울토마토 8~10알 (풍부한 라이코펜과 수분)',
      '삶은 계란 1개 또는 볶은 검은콩',
    ],
    bgClass: 'from-amber-50 to-orange-50 border-amber-200',
  }
];
