import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Utensils,
  Footprints,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Award,
  ShieldCheck
} from 'lucide-react';
import { getTimingLabel, evaluateGlucoseStatus } from '../utils/calculations';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    glucoseRecords,
    mealRecords,
    exerciseRecords,
    userProfile,
    seniorMode,
    openQuickAdd,
    setCurrentTab,
    setIsShareOpen,
    badges,
    loginHistory,
    currentProvider,
    setIsLoginHistoryOpen,
  } = useApp();

  // Latest glucose reading
  const latestGlucose = glucoseRecords[0];
  const latestStatus = latestGlucose
    ? evaluateGlucoseStatus(latestGlucose.value, latestGlucose.timing, userProfile)
    : null;

  // Today's records
  const todayStr = new Date().toISOString().split('T')[0];
  const todayGlucose = glucoseRecords.filter((g) => g.timestamp.startsWith(todayStr));
  const todayMeals = mealRecords.filter((m) => m.timestamp.startsWith(todayStr));
  const todayExercises = exerciseRecords.filter((e) => e.timestamp.startsWith(todayStr));

  // Today summary stats
  const todayTotalCarbs = todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0);
  const todayTotalSugar = todayMeals.reduce((sum, m) => sum + m.totalSugar, 0);
  const todayTotalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const todayExerciseMins = todayExercises.reduce((sum, e) => sum + e.durationMinutes, 0);
  const todayCaloriesBurned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const todayDropEstimate = todayExercises.reduce((sum, e) => sum + e.estimatedBloodSugarDrop, 0);

  // Calculate TIR (Time in Range, 70 ~ 180 mg/dL)
  const inRangeCount = glucoseRecords.filter((g) => g.value >= 70 && g.value <= 180).length;
  const tirPercent = glucoseRecords.length > 0 ? Math.round((inRangeCount / glucoseRecords.length) * 100) : 85;

  // Chart data for last 7 readings
  const chartData = [...glucoseRecords]
    .slice(0, 8)
    .reverse()
    .map((g) => {
      const d = new Date(g.timestamp);
      return {
        time: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
        value: g.value,
        timing: getTimingLabel(g.timing),
      };
    });

  // Combined timeline events sorted chronologically for today
  type TimelineEvent = {
    id: string;
    type: 'glucose' | 'meal' | 'exercise';
    time: Date;
    title: string;
    desc: string;
    badge?: string;
    color: string;
  };

  const timelineEvents: TimelineEvent[] = [
    ...todayGlucose.map((g) => ({
      id: g.id,
      type: 'glucose' as const,
      time: new Date(g.timestamp),
      title: `${getTimingLabel(g.timing)} 혈당: ${g.value} mg/dL`,
      desc: g.notes || '측정 완료',
      badge: evaluateGlucoseStatus(g.value, g.timing, userProfile).label,
      color: g.value > 180 ? 'border-amber-500 bg-amber-50' : g.value < 70 ? 'border-rose-500 bg-rose-50' : 'border-emerald-500 bg-emerald-50',
    })),
    ...todayMeals.map((m) => ({
      id: m.id,
      type: 'meal' as const,
      time: new Date(m.timestamp),
      title: `${m.type === 'breakfast' ? '아침' : m.type === 'lunch' ? '점심' : m.type === 'dinner' ? '저녁' : '간식'} 식사 (${m.totalCalories} kcal)`,
      desc: m.items.map((i) => i.food.name).join(', ') + ` (탄수화물 ${m.totalCarbs}g, 당류 ${m.totalSugar}g)`,
      badge: m.spikeRisk === 'high' ? '스파이크 주의' : '안정 식단',
      color: 'border-amber-500 bg-amber-50',
    })),
    ...todayExercises.map((e) => ({
      id: e.id,
      type: 'exercise' as const,
      time: new Date(e.timestamp),
      title: `${e.exerciseName} (${e.durationMinutes}분)`,
      desc: `소모 ${e.caloriesBurned} kcal · 예상 혈당 강하 -${e.estimatedBloodSugarDrop} mg/dL`,
      badge: '운동 완료',
      color: 'border-amber-500 bg-amber-50',
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. TOP CORRELATION AI INSIGHT BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>오늘의 식단·운동·혈당 상관관계 피드백</span>
            </div>
            <h2 className={`font-extrabold tracking-tight leading-snug ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {todayExerciseMins >= 20
                ? `식후 운동(${todayExerciseMins}분) 덕분에 탄수화물(${todayTotalCarbs}g) 흡수가 지연되어 혈당이 안정적입니다!`
                : `식사 후 30분 시점의 가벼운 15분 산책으로 혈당 피크를 효과적으로 방어해 보세요.`}
            </h2>
            <p className={`text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl ${seniorMode ? 'text-base' : ''}`}>
              최근 혈당 목표 범위 달성률(TIR)은 <strong className="text-emerald-400 font-bold">{tirPercent}%</strong>로 관리 지침을 잘 따르고 계십니다.
              {todayTotalSugar > 20 && ' (단, 오늘 단순 당류 섭취가 다소 높아 주의가 필요합니다.)'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="dash-open-correlation-btn"
              onClick={() => setCurrentTab('correlation')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>상세 리포트 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CORE STATS CARDS (혈당, 식단, 운동, TIR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Latest Glucose */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                🩸
              </div>
              <span className="text-xs font-bold text-slate-500">최근 혈당</span>
            </div>
            {latestStatus && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${latestStatus.badgeClass}`}>
                {latestStatus.label}
              </span>
            )}
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-slate-900 tracking-tight ${seniorMode ? 'text-5xl' : 'text-4xl'}`}>
                {latestGlucose ? latestGlucose.value : '--'}
              </span>
              <span className="text-sm font-bold text-slate-500">mg/dL</span>
            </div>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              {latestGlucose ? getTimingLabel(latestGlucose.timing) : '측정 기록 없음'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">목표: {userProfile.targetFastingMin}~{userProfile.targetPostMealMax} mg/dL</span>
            <button
              onClick={() => openQuickAdd('glucose')}
              className="text-rose-600 font-bold hover:underline cursor-pointer"
            >
              + 측정 기록
            </button>
          </div>
        </div>

        {/* Card 2: Today Meals & Carbs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                🥗
              </div>
              <span className="text-sm font-bold text-slate-600">오늘 식단 & 탄수화물</span>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {todayMeals.length}끼 기록
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-slate-900 tracking-tight ${seniorMode ? 'text-5xl' : 'text-4xl'}`}>
                {todayTotalCarbs}
              </span>
              <span className="text-sm font-bold text-slate-500">g (당류 {todayTotalSugar}g)</span>
            </div>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              총 {todayTotalCalories} kcal 섭취
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">권장 탄수화물: ~180g</span>
            <button
              onClick={() => openQuickAdd('meal')}
              className="text-amber-600 font-bold hover:underline cursor-pointer"
            >
              + 식단 추가
            </button>
          </div>
        </div>

        {/* Card 3: Today Exercise */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                🏃
              </div>
              <span className="text-sm font-bold text-slate-600">오늘 운동 활동</span>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {todayExercises.length}회 완료
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-slate-900 tracking-tight ${seniorMode ? 'text-5xl' : 'text-4xl'}`}>
                {todayExerciseMins}
              </span>
              <span className="text-sm font-bold text-slate-500">분 ({todayCaloriesBurned} kcal)</span>
            </div>
            <p className="text-sm text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>예상 혈당 강하: -{todayDropEstimate} mg/dL</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">일일 목표: 30분 이상</span>
            <button
              onClick={() => openQuickAdd('exercise')}
              className="text-amber-700 font-bold hover:underline cursor-pointer"
            >
              + 운동 기록
            </button>
          </div>
        </div>

        {/* Card 4: TIR (Time In Range) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                🎯
              </div>
              <span className="text-sm font-bold text-slate-600">목표 범위 달성률 (TIR)</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              안전 구역
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-emerald-700 tracking-tight ${seniorMode ? 'text-5xl' : 'text-4xl'}`}>
                {tirPercent}%
              </span>
              <span className="text-sm font-bold text-slate-500">달성</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${tirPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">의학 권장치: 70% 이상</span>
            <span className="text-emerald-600 font-bold">목표 초과 달성</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTION BUTTONS (For High Accessibility & Seniors) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          빠른 원터치 기록 및 기능
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="dash-quick-glucose"
            onClick={() => openQuickAdd('glucose')}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-all font-bold cursor-pointer ${
              seniorMode ? 'p-5 text-lg' : 'text-base'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">혈당 측정 기록</div>
              <div className="text-xs sm:text-sm text-rose-700 font-medium">공복·식후 2시간</div>
            </div>
          </button>

          <button
            id="dash-quick-meal"
            onClick={() => openQuickAdd('meal')}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all font-bold cursor-pointer ${
              seniorMode ? 'p-5 text-lg' : 'text-base'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">식사 메뉴 기록</div>
              <div className="text-xs sm:text-sm text-amber-700 font-medium">영양소·사진·스파이크</div>
            </div>
          </button>

          <button
            id="dash-quick-exercise"
            onClick={() => openQuickAdd('exercise')}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200 transition-all font-bold cursor-pointer ${
              seniorMode ? 'p-5 text-lg' : 'text-base'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <Footprints className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">운동 활동 기록</div>
              <div className="text-xs sm:text-sm text-amber-800 font-medium">식후 산책·홈트·강하효과</div>
            </div>
          </button>

          <button
            id="dash-share-report"
            onClick={() => setIsShareOpen(true)}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all font-bold cursor-pointer ${
              seniorMode ? 'p-5 text-lg' : 'text-base'
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold">가족/의사 공유</div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">카카오톡·요약 리포트</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. RECENT GLUCOSE TREND & TODAY INTEGRATED TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                최근 혈당 추이 그래프
              </h3>
              <p className="text-xs text-slate-500">녹색 영역(70~180 mg/dL)은 안전 목표 범위입니다</p>
            </div>
            <button
              onClick={() => setCurrentTab('glucose')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>전체 차트</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[50, 260]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} mg/dL`, '혈당']}
                  labelFormatter={(label: any) => `측정 시간: ${label}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                {/* Target Range reference lines */}
                <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '식후 상한 (180)', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '저혈당 기준 (70)', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, stroke: '#059669', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Today Combined Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                오늘의 기록 타임라인
              </h3>
              <p className="text-xs text-slate-500">식단 ➡️ 운동 ➡️ 혈당 연계 흐름</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {timelineEvents.length}개
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-72 space-y-3 pr-1">
            {timelineEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                오늘 등록된 기록이 없습니다. 상단에서 첫 혈당이나 식단을 기록해 보세요!
              </div>
            ) : (
              timelineEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-xl border-l-4 ${ev.color} border border-slate-100 transition-all`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      {ev.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {ev.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border text-slate-700">
                        {ev.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">{ev.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{ev.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. ACHIEVEMENTS & HEALTH BADGES SECTION */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
              지속 기록 리워드 배지
            </h3>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">꾸준한 혈당 관리의 결실</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 sm:p-4 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                  : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-70'
              }`}
            >
              <div
                 className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center text-xl mb-2 ${
                  b.unlocked ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {b.unlocked ? '🏅' : '🔒'}
              </div>
              <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{b.description}</p>
              {b.unlocked ? (
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md mt-2 inline-block">
                  달성 완료 ({b.earnedDate})
                </span>
              ) : (
                <div className="mt-2">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${b.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-medium">{b.progress}% 진행 중</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. LOGIN & SECURITY STATUS CARD */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                계정 보안 & 최근 로그인 기록
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                보호 중 (2FA 설정)
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              현재 <strong className="text-slate-800 font-bold">{currentProvider === 'kakao' ? '카카오톡' : currentProvider === 'naver' ? '네이버' : '구글'}</strong> 계정으로 로그인 중입니다. (총 {loginHistory.length}건의 접속 기록 보관)
            </p>
          </div>
        </div>

        <button
          id="dash-open-login-history-btn"
          onClick={() => setIsLoginHistoryOpen(true)}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center shrink-0"
        >
          <span>로그인 기록 전체보기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
