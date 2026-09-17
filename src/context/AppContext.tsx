import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  GlucoseRecord,
  MealRecord,
  ExerciseRecord,
  NotificationItem,
  HealthBadge,
  UserRoleMode,
  LoginHistoryRecord,
  LoginProvider
} from '../types';
import {
  INITIAL_USER_PROFILE,
  CAREGIVER_PARENT_PROFILE,
  INITIAL_GLUCOSE_RECORDS,
  INITIAL_MEAL_RECORDS,
  INITIAL_EXERCISE_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES,
  INITIAL_LOGIN_HISTORY
} from '../data/mockData';

interface AppContextType {
  // Mode & Senior accessibility
  seniorMode: boolean;
  toggleSeniorMode: () => void;
  roleMode: UserRoleMode;
  setRoleMode: (mode: UserRoleMode) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Records
  glucoseRecords: GlucoseRecord[];
  addGlucoseRecord: (record: Omit<GlucoseRecord, 'id'>) => void;
  deleteGlucoseRecord: (id: string) => void;

  mealRecords: MealRecord[];
  addMealRecord: (record: Omit<MealRecord, 'id'>) => void;
  deleteMealRecord: (id: string) => void;

  exerciseRecords: ExerciseRecord[];
  addExerciseRecord: (record: Omit<ExerciseRecord, 'id'>) => void;
  deleteExerciseRecord: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read'>) => void;
  unreadCount: number;

  // Badges
  badges: HealthBadge[];

  // Navigation tab
  currentTab: 'dashboard' | 'glucose' | 'meals' | 'exercise' | 'correlation' | 'guides';
  setCurrentTab: (tab: 'dashboard' | 'glucose' | 'meals' | 'exercise' | 'correlation' | 'guides') => void;

  // Quick Add Modal trigger
  quickAddType: 'glucose' | 'meal' | 'exercise' | null;
  openQuickAdd: (type: 'glucose' | 'meal' | 'exercise') => void;
  closeQuickAdd: () => void;

  // Share modal trigger
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;

  // Login & Security Management
  loginHistory: LoginHistoryRecord[];
  isLoggedIn: boolean;
  currentProvider: LoginProvider;
  isLoginHistoryOpen: boolean;
  setIsLoginHistoryOpen: (open: boolean) => void;
  login: (provider: LoginProvider) => void;
  logout: () => void;
  terminateOtherSessions: () => void;
  deleteLoginRecord: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Senior Mode default false or read from localStorage
  const [seniorMode, setSeniorMode] = useState<boolean>(() => {
    return localStorage.getItem('dangdang_senior_mode') === 'true';
  });

  const [roleMode, setRoleMode] = useState<UserRoleMode>('self');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const [glucoseRecords, setGlucoseRecords] = useState<GlucoseRecord[]>(() => {
    const saved = localStorage.getItem('dangdang_glucose');
    return saved ? JSON.parse(saved) : INITIAL_GLUCOSE_RECORDS;
  });

  const [mealRecords, setMealRecords] = useState<MealRecord[]>(() => {
    const saved = localStorage.getItem('dangdang_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEAL_RECORDS;
  });

  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>(() => {
    const saved = localStorage.getItem('dangdang_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISE_RECORDS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('dangdang_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [badges, setBadges] = useState<HealthBadge[]>(INITIAL_BADGES);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'glucose' | 'meals' | 'exercise' | 'correlation' | 'guides'>('dashboard');
  const [quickAddType, setQuickAddType] = useState<'glucose' | 'meal' | 'exercise' | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Login & Security State
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>(() => {
    const saved = localStorage.getItem('dangdang_login_history');
    return saved ? JSON.parse(saved) : INITIAL_LOGIN_HISTORY;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentProvider, setCurrentProvider] = useState<LoginProvider>('kakao');
  const [isLoginHistoryOpen, setIsLoginHistoryOpen] = useState(false);

  // Sync role profile
  useEffect(() => {
    if (roleMode === 'caregiver') {
      setUserProfile(CAREGIVER_PARENT_PROFILE);
    } else {
      setUserProfile(INITIAL_USER_PROFILE);
    }
  }, [roleMode]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('dangdang_senior_mode', String(seniorMode));
  }, [seniorMode]);

  useEffect(() => {
    localStorage.setItem('dangdang_glucose', JSON.stringify(glucoseRecords));
  }, [glucoseRecords]);

  useEffect(() => {
    localStorage.setItem('dangdang_meals', JSON.stringify(mealRecords));
  }, [mealRecords]);

  useEffect(() => {
    localStorage.setItem('dangdang_exercises', JSON.stringify(exerciseRecords));
  }, [exerciseRecords]);

  useEffect(() => {
    localStorage.setItem('dangdang_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('dangdang_login_history', JSON.stringify(loginHistory));
  }, [loginHistory]);

  const toggleSeniorMode = () => {
    setSeniorMode((prev) => !prev);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const addGlucoseRecord = (record: Omit<GlucoseRecord, 'id'>) => {
    const newRecord: GlucoseRecord = {
      ...record,
      id: 'g-' + Date.now(),
    };
    setGlucoseRecords((prev) => [newRecord, ...prev]);

    // Check if high/low to issue push notification
    if (newRecord.value > 200) {
      addNotification({
        title: '⚠️ 고혈당 알림',
        message: `혈당이 ${newRecord.value}mg/dL로 높게 측정되었습니다. 물을 충분히 섭취하고 무리한 운동은 삼가세요.`,
        time: '방금 전',
        type: 'warning',
      });
    } else if (newRecord.value < 70) {
      addNotification({
        title: '🚨 저혈당 주의보',
        message: `혈당이 ${newRecord.value}mg/dL로 위험 수준입니다. 단순당 15g(사탕 3~4개)을 즉시 섭취하세요.`,
        time: '방금 전',
        type: 'warning',
      });
    }
  };

  const deleteGlucoseRecord = (id: string) => {
    setGlucoseRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const addMealRecord = (record: Omit<MealRecord, 'id'>) => {
    const newRecord: MealRecord = {
      ...record,
      id: 'm-' + Date.now(),
    };
    setMealRecords((prev) => [newRecord, ...prev]);

    // Automatically schedule a 2-hour post-meal reminder notification
    addNotification({
      title: '⏰ 식후 2시간 혈당 측정 알림 예약됨',
      message: `${newRecord.type === 'breakfast' ? '아침' : newRecord.type === 'lunch' ? '점심' : newRecord.type === 'dinner' ? '저녁' : '간식'} 식사 후 2시간 혈당 측정을 잊지 마세요!`,
      time: '방금 전',
      type: 'post_meal_alert',
    });
  };

  const deleteMealRecord = (id: string) => {
    setMealRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const addExerciseRecord = (record: Omit<ExerciseRecord, 'id'>) => {
    const newRecord: ExerciseRecord = {
      ...record,
      id: 'e-' + Date.now(),
    };
    setExerciseRecords((prev) => [newRecord, ...prev]);

    addNotification({
      title: '👏 운동 기록 완료!',
      message: `${newRecord.exerciseName} ${newRecord.durationMinutes}분 완료! 약 ${newRecord.estimatedBloodSugarDrop}mg/dL의 혈당 강하 효과가 기대됩니다.`,
      time: '방금 전',
      type: 'cheer',
    });
  };

  const deleteExerciseRecord = (id: string) => {
    setExerciseRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openQuickAdd = (type: 'glucose' | 'meal' | 'exercise') => {
    setQuickAddType(type);
  };

  const closeQuickAdd = () => {
    setQuickAddType(null);
  };

  const login = (provider: LoginProvider) => {
    setIsLoggedIn(true);
    setCurrentProvider(provider);

    // Detect browser or provide realistic device string
    const userAgent = navigator.userAgent;
    let deviceName = 'Chrome / Windows 11';
    if (/iPhone/i.test(userAgent)) deviceName = 'Mobile Safari / iPhone 15 Pro';
    else if (/Android/i.test(userAgent)) deviceName = 'Samsung Internet / Galaxy S24';
    else if (/Mac/i.test(userAgent)) deviceName = 'Safari / macOS Sonoma';

    const providerNames: Record<LoginProvider, string> = {
      kakao: '카카오톡',
      naver: '네이버',
      google: '구글',
      apple: '애플',
      email: '이메일',
    };

    const newRecord: LoginHistoryRecord = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      provider,
      deviceName,
      ipAddress: '211.234.' + Math.floor(Math.random() * 80 + 10) + '.' + Math.floor(Math.random() * 80 + 10),
      location: '대한민국 서울특별시 강남구',
      status: 'success',
      isCurrentDevice: true,
    };

    setLoginHistory((prev) => [
      newRecord,
      ...prev.map((item) => ({ ...item, isCurrentDevice: false })),
    ]);

    addNotification({
      title: `🔑 [로그인 성공] ${providerNames[provider]} 계정`,
      message: `${deviceName}에서 정상적으로 로그인되었습니다. (IP: ${newRecord.ipAddress})`,
      time: '방금 전',
      type: 'cheer',
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    addNotification({
      title: '🔒 로그아웃 완료',
      message: '현재 기기에서 안전하게 로그아웃되었습니다.',
      time: '방금 전',
      type: 'cheer',
    });
  };

  const terminateOtherSessions = () => {
    setLoginHistory((prev) =>
      prev.map((item) => (item.isCurrentDevice ? item : { ...item, status: 'blocked' }))
    );
    addNotification({
      title: '🛡️ 원격 기기 일괄 로그아웃',
      message: '현재 사용 중인 기기를 제외한 다른 모든 기기의 세션을 안전하게 종료하였습니다.',
      time: '방금 전',
      type: 'cheer',
    });
  };

  const deleteLoginRecord = (id: string) => {
    setLoginHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        seniorMode,
        toggleSeniorMode,
        roleMode,
        setRoleMode,
        userProfile,
        updateProfile,
        glucoseRecords,
        addGlucoseRecord,
        deleteGlucoseRecord,
        mealRecords,
        addMealRecord,
        deleteMealRecord,
        exerciseRecords,
        addExerciseRecord,
        deleteExerciseRecord,
        notifications,
        markNotificationAsRead,
        addNotification,
        unreadCount,
        badges,
        currentTab,
        setCurrentTab,
        quickAddType,
        openQuickAdd,
        closeQuickAdd,
        isShareOpen,
        setIsShareOpen,
        loginHistory,
        isLoggedIn,
        currentProvider,
        isLoginHistoryOpen,
        setIsLoginHistoryOpen,
        login,
        logout,
        terminateOtherSessions,
        deleteLoginRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
