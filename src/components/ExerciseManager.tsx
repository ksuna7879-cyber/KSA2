import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EXERCISE_CATEGORIES } from '../data/foodDatabase';
import { calculateCaloriesBurned, estimateSugarDrop } from '../utils/calculations';
import {
  Footprints,
  Plus,
  Trash2,
  Flame,
  Clock,
  HeartPulse,
  TrendingDown,
  Info,
  CheckCircle2,
  Sparkles,
  Timer,
  Film,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const ExerciseManager: React.FC = () => {
  const {
    exerciseRecords,
    deleteExerciseRecord,
    openQuickAdd,
    userProfile,
    seniorMode,
    setCurrentTab,
  } = useApp();

  // Active workout timer for live post-meal walking session
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Stats
  const totalMinutes = exerciseRecords.reduce((acc, e) => acc + e.durationMinutes, 0);
  const totalCalories = exerciseRecords.reduce((acc, e) => acc + e.caloriesBurned, 0);
  const totalDrop = exerciseRecords.reduce((acc, e) => acc + e.estimatedBloodSugarDrop, 0);

  // Group by day for chart
  const weeklyExerciseData = exerciseRecords.slice(0, 7).map((e) => {
    const d = new Date(e.timestamp);
    return {
      name: `${d.getMonth() + 1}/${d.getDate()} (${e.exerciseName.slice(0, 4)})`,
      분: e.durationMinutes,
      칼로리: e.caloriesBurned,
    };
  }).reverse();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              🏃
            </div>
            <h2 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              운동 관리 & 혈당 강하 분석
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            식후 유산소와 하체 근력 운동은 인슐린 감수성을 높여 혈당을 가장 안전하게 낮춥니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="exercise-open-videos-btn"
            onClick={() => setCurrentTab('guides')}
            className={`px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
              seniorMode ? 'text-base py-3' : 'text-sm'
            }`}
          >
            <Film className="w-4 h-4 text-emerald-200" />
            <span>홈트레이닝 영상 재생</span>
          </button>

          <button
            id="exercise-add-cta"
            onClick={() => openQuickAdd('exercise')}
            className={`px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              seniorMode ? 'text-base py-3' : 'text-sm'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>새 운동 기록하기</span>
          </button>
        </div>
      </div>

      {/* Live Post-Meal Exercise Stopwatch / Walking Companion */}
      <div className="bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-semibold border border-yellow-400/30">
              <Timer className="w-3.5 h-3.5" />
              <span>실시간 식후 걷기 스톱워치</span>
            </div>
            <button
              onClick={() => setCurrentTab('guides')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-emerald-300" />
              <span>실내 홈트 영상으로 운동하기</span>
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            지금 식후 30분이신가요? 20분 걷기를 시작해 보세요!
          </h3>
          <p className="text-xs sm:text-sm text-yellow-100/90 max-w-xl">
            스톱워치를 켜고 동네를 가볍게 산책하면 포도당이 근육으로 즉시 흡수되어 식후 스파이크를 30~50mg/dL 예방합니다. (궂은 날엔 거실 홈트 영상 권장)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-emerald-300 bg-black/40 px-6 py-2.5 rounded-2xl border border-white/10">
            {formatTimer(timerSeconds)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isTimerRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/30'
              }`}
            >
              {isTimerRunning ? '일시정지' : '운동 시작'}
            </button>
            {timerSeconds > 0 && (
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
              >
                리셋
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">총 누적 운동 시간</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`font-black text-amber-800 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {totalMinutes}
            </span>
            <span className="text-xs text-slate-500">분</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            총 {exerciseRecords.length}회 실천 완료
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">운동 소모 열량 (체중 {userProfile.weight}kg)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`font-black text-slate-900 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {totalCalories}
            </span>
            <span className="text-xs text-slate-500">kcal</span>
          </div>
          <p className="text-[11px] text-orange-600 font-semibold mt-1">
            체지방 및 간 글리코겐 대사 촉진
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">누적 혈당 강하 기여도</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`font-black text-emerald-600 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              -{totalDrop}
            </span>
            <span className="text-xs text-slate-500">mg/dL 누적 강하</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            인슐린 약물 의존도 감소에 기여
          </p>
        </div>
      </div>

      {/* Weekly Exercise Bar Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-4">
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            최근 운동 시간 추이 (분)
          </h3>
          <p className="text-xs text-slate-500">
            대한당뇨병학회 권장: 주 150분 이상의 중강도 유산소 및 주 2~3회 근력 운동
          </p>
        </div>

        <div className="h-60 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyExerciseData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val: any, name: any) => [`${val} 분`, '운동 시간']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }}
              />
              <Bar dataKey="분" fill="#eab308" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercise Guides & Recommendations */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className={`font-bold text-slate-900 mb-3 ${seniorMode ? 'text-xl' : 'text-base'}`}>
          당뇨 환자 추천 운동 종목 & 효과 사전
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXERCISE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    MET {cat.met}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold">
                ⏱ {cat.recommendedTiming}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            운동 히스토리 ({exerciseRecords.length}건)
          </h3>
          <span className="text-xs text-slate-500">실시간 체중 기반 MET 계산</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
              <tr>
                <th className="p-3.5 pl-5">운동 시간</th>
                <th className="p-3.5">운동 종목</th>
                <th className="p-3.5">소요 시간</th>
                <th className="p-3.5">운동 강도</th>
                <th className="p-3.5">소모 칼로리</th>
                <th className="p-3.5">예상 혈당 강하</th>
                <th className="p-3.5">메모</th>
                <th className="p-3.5 text-right pr-5">삭제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exerciseRecords.map((ex) => {
                const d = new Date(ex.timestamp);
                return (
                  <tr key={ex.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-5 text-slate-600 whitespace-nowrap">
                      {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {ex.exerciseName}
                    </td>
                    <td className="p-3.5 font-semibold text-amber-800 whitespace-nowrap">
                      {ex.durationMinutes}분
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {ex.intensity === 'light' ? '가벼움' : ex.intensity === 'moderate' ? '보통' : '격렬함'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 whitespace-nowrap">
                      {ex.caloriesBurned} kcal
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 whitespace-nowrap">
                      -{ex.estimatedBloodSugarDrop} mg/dL
                    </td>
                    <td className="p-3.5 text-slate-500 max-w-xs">
                      {ex.notes || '-'}
                    </td>
                    <td className="p-3.5 text-right pr-5 whitespace-nowrap">
                      <button
                        onClick={() => deleteExerciseRecord(ex.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
