import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlucoseTiming, GlucoseStatus } from '../types';
import { getTimingLabel, evaluateGlucoseStatus } from '../utils/calculations';
import {
  Activity,
  Plus,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const GlucoseManager: React.FC = () => {
  const {
    glucoseRecords,
    deleteGlucoseRecord,
    openQuickAdd,
    userProfile,
    seniorMode,
    addNotification,
  } = useApp();

  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [filterTiming, setFilterTiming] = useState<string>('all');
  const [timerRemaining, setTimerRemaining] = useState<number | null>(75); // e.g. 75 mins until next 2h post-meal test

  // Filter records
  const filteredRecords = glucoseRecords.filter((r) => {
    if (filterTiming === 'all') return true;
    if (filterTiming === 'fasting') return r.timing === 'fasting' || r.timing.startsWith('before');
    if (filterTiming === 'post_meal') return r.timing.includes('after');
    if (filterTiming === 'caution') return r.status === 'elevated' || r.status === 'high' || r.status === 'critical' || r.status === 'low';
    return true;
  });

  // TIR breakdown calculations
  const totalCount = glucoseRecords.length || 1;
  const inRangeCount = glucoseRecords.filter((g) => g.value >= 70 && g.value <= 180).length;
  const lowCount = glucoseRecords.filter((g) => g.value < 70).length;
  const highCount = glucoseRecords.filter((g) => g.value > 180).length;

  const tirData = [
    { name: '목표 범위 내 (70~180)', value: inRangeCount, color: '#10b981' },
    { name: '고혈당 (>180)', value: highCount, color: '#f59e0b' },
    { name: '저혈당 (<70)', value: lowCount, color: '#ef4444' },
  ];

  // Average calculations
  const avgTotal = Math.round(
    glucoseRecords.reduce((acc, cur) => acc + cur.value, 0) / (glucoseRecords.length || 1)
  );

  const fastingRecords = glucoseRecords.filter(
    (g) => g.timing === 'fasting' || g.timing === 'before_breakfast'
  );
  const avgFasting = fastingRecords.length
    ? Math.round(fastingRecords.reduce((acc, cur) => acc + cur.value, 0) / fastingRecords.length)
    : 110;

  const postMealRecords = glucoseRecords.filter((g) => g.timing.includes('after'));
  const avgPostMeal = postMealRecords.length
    ? Math.round(postMealRecords.reduce((acc, cur) => acc + cur.value, 0) / postMealRecords.length)
    : 152;

  // Chart series
  const chartData = [...glucoseRecords]
    .slice(0, 14)
    .reverse()
    .map((g) => {
      const d = new Date(g.timestamp);
      return {
        date: `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}시`,
        value: g.value,
        timing: getTimingLabel(g.timing),
        rawTime: d.toLocaleDateString(),
      };
    });

  const handleTriggerTestReminder = () => {
    addNotification({
      title: '⏰ [테스트 알림] 식후 2시간 혈당 측정 시간입니다!',
      message: '식사 시작 후 2시간이 경과되었습니다. 혈당을 측정하여 당뇨 다이어리에 기록해 주세요.',
      time: '방금 전',
      type: 'post_meal_alert',
    });
    alert('식후 2시간 알림이 발송되었습니다! 상단 알림 벨 아이콘을 확인하세요.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              🩸
            </div>
            <h2 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              혈당 관리 & 트렌드 분석
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            공복 및 식후 2시간 혈당을 규칙적으로 기록하여 혈당 스파이크와 변동성을 파악합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerTestReminder}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            title="식후 2시간 타이머 알림 시뮬레이션"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2시간 알림 테스트</span>
          </button>

          <button
            id="glucose-add-cta"
            onClick={() => openQuickAdd('glucose')}
            className={`px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              seniorMode ? 'text-base py-3' : 'text-sm'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>새 혈당 기록하기</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Average Glucose */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">전체 평균 혈당</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-black text-slate-900 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {avgTotal}
            </span>
            <span className="text-xs text-slate-500">mg/dL</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            당화혈색소(eA1c) 환산 추정치 약 {( (avgTotal + 46.7) / 28.7 ).toFixed(1)}%
          </p>
        </div>

        {/* Card 2: Fasting vs PostMeal */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">공복 / 식후 2시간 평균</span>
          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="text-xs text-slate-500">공복: </span>
              <span className="text-xl font-bold text-emerald-700">{avgFasting}</span>
              <span className="text-xs text-slate-400"> mg/dL</span>
            </div>
            <div>
              <span className="text-xs text-slate-500">식후 2h: </span>
              <span className="text-xl font-bold text-amber-700">{avgPostMeal}</span>
              <span className="text-xs text-slate-400"> mg/dL</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            공복 목표({userProfile.targetFastingMin}~{userProfile.targetFastingMax}) / 식후 목표(≤{userProfile.targetPostMealMax})
          </p>
        </div>

        {/* Card 3: TIR Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">목표 범위 내 비율 (TIR)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-black text-emerald-600 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {Math.round((inRangeCount / totalCount) * 100)}%
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              우수 관리
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            총 {totalCount}회 측정 중 {inRangeCount}회 목표 달성
          </p>
        </div>
      </div>

      {/* Main Charts: Trend Line & TIR Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                혈당 변동 곡선
              </h3>
              <p className="text-xs text-slate-500">
                시간 경과에 따른 혈당의 등락 폭을 모니터링합니다.
              </p>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setPeriod('day')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  period === 'day' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                일간
              </button>
              <button
                onClick={() => setPeriod('week')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  period === 'week' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                주간
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  period === 'month' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                월간
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[50, 260]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} mg/dL (${item.payload.timing})`,
                    '측정 혈당',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }}
                />
                <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '식후 상한 (180)', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={130} stroke="#10b981" strokeDasharray="3 3" label={{ value: '공복 상한 (130)', fill: '#10b981', fontSize: 10 }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '저혈당 경계 (70)', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#f43f5e', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: TIR Pie / Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
              혈당 범위별 분포 비율 (TIR)
            </h3>
            <p className="text-xs text-slate-500">
              미국 당뇨병학회(ADA) 권장: 목표 범위 70% 이상
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tirData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tirData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}회`, '측정 횟수']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {tirData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {Math.round((item.value / totalCount) * 100)}% ({item.value}회)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
              혈당 측정 히스토리 ({filteredRecords.length}건)
            </h3>
            <p className="text-xs text-slate-500">측정 시점별 기록과 상태 피드백을 확인하세요.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterTiming('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                filterTiming === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterTiming('fasting')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                filterTiming === 'fasting' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              공복/식전만
            </button>
            <button
              onClick={() => setFilterTiming('post_meal')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                filterTiming === 'post_meal' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              식후 2시간만
            </button>
            <button
              onClick={() => setFilterTiming('caution')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                filterTiming === 'caution' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              주의/고혈당만
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
                <th className="p-3.5 pl-5">측정 시간</th>
                <th className="p-3.5">측정 시점</th>
                <th className="p-3.5">혈당 수치</th>
                <th className="p-3.5">판정 상태</th>
                <th className="p-3.5">메모 및 조언</th>
                <th className="p-3.5 text-right pr-5">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredRecords.map((r) => {
                const evalInfo = evaluateGlucoseStatus(r.value, r.timing, userProfile);
                const dateObj = new Date(r.timestamp);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-5 font-medium text-slate-600 whitespace-nowrap">
                      {dateObj.toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}{' '}
                      {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {getTimingLabel(r.timing)}
                    </td>
                    <td className="p-3.5">
                      <span className={`font-black text-slate-900 ${seniorMode ? 'text-lg' : 'text-base'}`}>
                        {r.value}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">mg/dL</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${evalInfo.badgeClass}`}>
                        {evalInfo.label}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs text-slate-600">
                      <div>{r.notes || evalInfo.advice}</div>
                    </td>
                    <td className="p-3.5 text-right pr-5 whitespace-nowrap">
                      <button
                        onClick={() => deleteGlucoseRecord(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="기록 삭제"
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
