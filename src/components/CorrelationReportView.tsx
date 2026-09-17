import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileBarChart2,
  Sparkles,
  Share2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const CorrelationReportView: React.FC = () => {
  const {
    glucoseRecords,
    mealRecords,
    exerciseRecords,
    userProfile,
    seniorMode,
    setIsShareOpen,
  } = useApp();

  const [selectedCase, setSelectedCase] = useState<number>(0);

  // Correlation Case Studies based on realistic records
  const caseStudies = [
    {
      title: '케이스 1: [스파이크 분석] 고탄수화물 외식 & 운동 미실시',
      date: '어제 점심',
      mealDesc: '짜장면 1그릇 + 믹스커피 (탄수화물 134g, 당류 20g)',
      exerciseDesc: '식후 운동 없음 (0분)',
      glucoseResult: '식후 2시간 혈당 195 mg/dL (스파이크 발생 ⚠️)',
      outcomeStatus: 'warning',
      analysis: '단순당과 정제 밀가루의 급격한 흡수와 인슐린 분비 부담으로 인해 목표 혈당(180mg/dL)을 초과하는 식후 스파이크가 나타났습니다.',
      doctorAdvice: '부득이한 면류 섭취 시 식사 속도를 늦추고 면을 1/3 남기거나, 식후 30분 시점에 20분 걷기 운동을 병행했다면 혈당 상승을 30mg/dL 이상 억제할 수 있었습니다.',
    },
    {
      title: '케이스 2: [안정 제어 성공] 잡곡 쌈채소 식단 & 식후 25분 산책',
      date: '오늘 아침·점심',
      mealDesc: '현미밥 + 우렁된장찌개 + 닭가슴살 쌈채소 (탄수화물 62g, 단백질 42g)',
      exerciseDesc: '식후 30분 시점 가벼운 산책 25분 (소모 95 kcal)',
      glucoseResult: '식후 2시간 혈당 142 mg/dL (목표 범위 안정 달성 ✅)',
      outcomeStatus: 'success',
      analysis: '풍부한 식이섬유가 포도당 흡수를 완만하게 지연시켰고, 산책을 통해 대퇴사두근이 혈중 포도당을 빠르게 소비하여 혈당 곡선이 완만하게 유지되었습니다.',
      doctorAdvice: '당뇨 환자에게 가장 이상적인 식단-운동 조합입니다. 지금처럼 식사 후 30분 이내 가벼운 걷기 루틴을 유지하세요.',
    },
    {
      title: '케이스 3: [고혈당 방어] 저녁 저탄수 식단 & 실내 자전거 30분',
      date: '어제 저녁',
      mealDesc: '두부면 콩국수 + 삶은 달걀 + 오이스틱 (탄수화물 18g, 단백질 35g)',
      exerciseDesc: '실내 고정식 자전거 30분 (소모 195 kcal)',
      glucoseResult: '식후 2시간 혈당 148 mg/dL (수면 전 안정화 ✅)',
      outcomeStatus: 'success',
      analysis: '낮 동안의 높은 혈당 부담을 저녁의 철저한 저탄수화물 구성과 중강도 유산소 운동으로 완전히 상쇄하여 안정적인 수면 전 혈당을 확보했습니다.',
      doctorAdvice: '낮에 탄수화물을 초과했다면 저녁 식단을 가볍게 조절하고 실내 유산소를 실시하는 보상 관리 습관이 매우 훌륭합니다.',
    }
  ];

  // Overlay data for 5 days: Carbohydrates vs PostMeal Peak vs Exercise Mins
  const multiMetricData = [
    { day: '4일 전', 탄수화물: 140, 식후혈당: 145, 운동시간: 30 },
    { day: '3일 전', 탄수화물: 175, 식후혈당: 175, 운동시간: 20 },
    { day: '2일 전', 탄수화물: 155, 식후혈당: 152, 운동시간: 20 },
    { day: '어제', 탄수화물: 210, 식후혈당: 195, 운동시간: 30 },
    { day: '오늘', 탄수화물: 120, 식후혈당: 142, 운동시간: 40 },
  ];

  // Time in range calculation
  const inRange = glucoseRecords.filter((g) => g.value >= 70 && g.value <= 180).length;
  const tir = Math.round((inRange / (glucoseRecords.length || 1)) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              📑
            </div>
            <h2 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              혈당·식단·운동 상관관계 종합 분석 리포트
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ‘내가 먹은 음식’과 ‘내가 한 운동’이 ‘혈당’에 미치는 인과관계를 데이터로 입증합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>리포트 인쇄</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className={`px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
              seniorMode ? 'text-base py-3' : 'text-xs'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>가족·주치의 공유하기</span>
          </button>
        </div>
      </div>

      {/* High-level Summary Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>의료진 및 보호자용 주간 요약 총평</span>
        </div>

        <h3 className={`font-extrabold leading-snug mb-3 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
          "식후 20분 이상 걷기를 실천한 끼니는, 운동을 생략한 끼니 대비 식후 혈당이 평균 38 mg/dL 낮게 안정되었습니다."
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block">환자명 / 당뇨 유형</span>
            <span className="font-bold text-slate-100 text-sm">{userProfile.name} ({userProfile.age}세 · 2형)</span>
          </div>
          <div>
            <span className="text-slate-400 block">목표 범위 달성률 (TIR)</span>
            <span className="font-bold text-emerald-400 text-sm">{tir}% (권장 70% 이상)</span>
          </div>
          <div>
            <span className="text-slate-400 block">평균 공복 혈당</span>
            <span className="font-bold text-slate-100 text-sm">114 mg/dL (안정권)</span>
          </div>
          <div>
            <span className="text-slate-400 block">주간 운동 빈도</span>
            <span className="font-bold text-amber-400 text-sm">{exerciseRecords.length}회 실천 (총 {exerciseRecords.reduce((a, b) => a + b.durationMinutes, 0)}분)</span>
          </div>
        </div>
      </div>

      {/* Multi-Metric Overlay Chart: Carbs vs Exercise vs Glucose */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-4">
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            일자별 탄수화물 섭취량 vs 식후 피크 혈당 vs 운동 시간 상관관계
          </h3>
          <p className="text-xs text-slate-500">
            탄수화물 바(황색)가 높더라도 운동 시간 바(노란색)가 충분하면 혈당 곡선(자주색)의 상승이 억제됩니다.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={multiMetricData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="탄수화물" fill="#f59e0b" name="탄수화물(g)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="운동시간" fill="#eab308" name="운동시간(분)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="식후혈당" stroke="#9333ea" strokeWidth={3} name="식후 혈당(mg/dL)" dot={{ r: 5, fill: '#9333ea' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Case Studies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            데이터 기반 심층 상관관계 분석 사례
          </h3>
          <span className="text-xs text-slate-500">실제 기록 인과관계 추출</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCase(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedCase === idx
                  ? 'border-amber-500 bg-amber-50/30 shadow-md ring-2 ring-amber-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{cs.date}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cs.outcomeStatus === 'warning'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {cs.outcomeStatus === 'warning' ? '스파이크 주의' : '안정 제어'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">{cs.title}</h4>

                <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-500">식단: </span>
                    <span className="text-slate-800">{cs.mealDesc}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">운동: </span>
                    <span className="text-slate-800">{cs.exerciseDesc}</span>
                  </div>
                  <div className="pt-1 font-bold text-amber-900">
                    <span>결과: </span>
                    <span>{cs.glucoseResult}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cs.analysis}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
                💡 {cs.doctorAdvice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Rules for Diabetics */}
      <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl">
        <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>당당케어가 제안하는 3대 혈당 안정화 수칙</span>
        </h4>
        <ul className="text-xs sm:text-sm text-emerald-900 space-y-1.5 pl-5 list-disc leading-relaxed">
          <li><strong>거꾸로 식사법 준수:</strong> 채소 샐러드나 나물 반찬을 먼저 5분간 천천히 먹고 단백질, 마지막에 밥을 먹으면 혈당 피크가 최대 40% 감소합니다.</li>
          <li><strong>식후 30분 골든타임 걷기:</strong> 포도당이 혈관으로 쏟아져 나오는 식후 30~45분 시점에 15~25분간 걷는 것만으로 약물 1알 수준의 혈당 조절 효과가 나타납니다.</li>
          <li><strong>규칙적인 식후 2시간 측정:</strong> 본인이 자주 먹는 음식에 대한 혈당 반응을 파악하여 '나만의 안전 음식' 리스트를 구축하세요.</li>
        </ul>
      </div>
    </div>
  );
};
