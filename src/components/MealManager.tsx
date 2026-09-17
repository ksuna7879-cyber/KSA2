import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealRecord, FoodItem } from '../types';
import { FOOD_DATABASE } from '../data/foodDatabase';
import {
  Utensils,
  Plus,
  Trash2,
  Camera,
  AlertTriangle,
  Sparkles,
  Search,
  CheckCircle2,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export const MealManager: React.FC = () => {
  const {
    mealRecords,
    deleteMealRecord,
    openQuickAdd,
    seniorMode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter food database for reference lookup
  const filteredFoods = FOOD_DATABASE.filter((f) => {
    const matchQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  // Calculate overall nutrition totals from meals
  const totalMealCount = mealRecords.length || 1;
  const avgCarbs = Math.round(mealRecords.reduce((acc, m) => acc + m.totalCarbs, 0) / totalMealCount);
  const avgProtein = Math.round(mealRecords.reduce((acc, m) => acc + m.totalProtein, 0) / totalMealCount);
  const avgFat = Math.round(mealRecords.reduce((acc, m) => acc + m.totalFat, 0) / totalMealCount);
  const avgSugar = Math.round(mealRecords.reduce((acc, m) => acc + m.totalSugar, 0) / totalMealCount);

  // Chart data for meal nutrition breakdown
  const mealNutritionChartData = mealRecords.slice(0, 6).map((m) => {
    const d = new Date(m.timestamp);
    const label = `${d.getMonth() + 1}/${d.getDate()} ${m.type === 'breakfast' ? '아침' : m.type === 'lunch' ? '점심' : m.type === 'dinner' ? '저녁' : '간식'}`;
    return {
      meal: label,
      탄수화물: m.totalCarbs,
      단백질: m.totalProtein,
      지방: m.totalFat,
      당류: m.totalSugar,
    };
  }).reverse();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              🥗
            </div>
            <h2 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              식단 기록 & 영양소 분석
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            식사의 탄수화물, 당류, 단백질 비중을 기록하고 혈당 스파이크 위험도를 사전에 예방합니다.
          </p>
        </div>

        <button
          id="meal-add-cta"
          onClick={() => openQuickAdd('meal')}
          className={`px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
            seniorMode ? 'text-base py-3' : 'text-sm'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>새 식단 기록하기</span>
        </button>
      </div>

      {/* Overview Averages */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-amber-700 block">끼니당 평균 탄수화물</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className={`font-black text-amber-800 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {avgCarbs}
            </span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">목표 50~70g 이내</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-rose-700 block">끼니당 평균 당류</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className={`font-black text-rose-800 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {avgSugar}
            </span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">권장 10g 미만</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-blue-700 block">끼니당 평균 단백질</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className={`font-black text-blue-800 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {avgProtein}
            </span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">단백질 섭취 양호</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-600 block">끼니당 평균 지방</span>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className={`font-black text-slate-800 ${seniorMode ? 'text-4xl' : 'text-3xl'}`}>
              {avgFat}
            </span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">식물성/불포화 권장</span>
        </div>
      </div>

      {/* Nutrition Trend Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-4">
          <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
            끼니별 3대 영양소 & 당류 분포 (g)
          </h3>
          <p className="text-xs text-slate-500">
            탄수화물(황색)과 당류(적색)가 높을수록 식후 혈당 스파이크 가능성이 커집니다.
          </p>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mealNutritionChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="meal" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="탄수화물" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="당류" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="단백질" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="지방" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meal Records List with Photo & Nutrition & AI Feedback */}
      <div className="space-y-4">
        <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
          최근 식사 기록 리스트 ({mealRecords.length}끼)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealRecords.map((meal) => {
            const d = new Date(meal.timestamp);
            const dateStr = `${d.getMonth() + 1}월 ${d.getDate()}일 ${meal.type === 'breakfast' ? '아침' : meal.type === 'lunch' ? '점심' : meal.type === 'dinner' ? '저녁' : '간식'}`;

            return (
              <div
                key={meal.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Header */}
                  {meal.photoUrl && (
                    <div className="h-44 w-full overflow-hidden relative group">
                      <img
                        src={meal.photoUrl}
                        alt="식단 사진"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-xs ${
                            meal.spikeRisk === 'high'
                              ? 'bg-rose-500 text-white'
                              : meal.spikeRisk === 'moderate'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {meal.spikeRisk === 'high' ? '⚠️ 스파이크 경고' : meal.spikeRisk === 'moderate' ? '보통 부담' : '✅ 안심 식단'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {!meal.photoUrl && (
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{dateStr}</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            meal.spikeRisk === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : meal.spikeRisk === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {meal.spikeRisk === 'high' ? '스파이크 주의' : '안심 식단'}
                        </span>
                      </div>
                    )}

                    {/* Food Items Pills */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">식사 메뉴</span>
                      <div className="flex flex-wrap gap-1.5">
                        {meal.items.map((i, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                          >
                            <span>{i.food.name}</span>
                            <span className="text-[10px] text-slate-400">×{i.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Nutrition Breakdown Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">칼로리</span>
                        <span className="text-xs font-bold text-slate-900">{meal.totalCalories} kcal</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-700 block font-semibold">탄수화물</span>
                        <span className="text-xs font-bold text-amber-800">{meal.totalCarbs}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-700 block font-semibold">당류</span>
                        <span className="text-xs font-bold text-rose-800">{meal.totalSugar}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-teal-700 block font-semibold">단백질</span>
                        <span className="text-xs font-bold text-teal-800">{meal.totalProtein}g</span>
                      </div>
                    </div>

                    {/* AI Feedback & Notes */}
                    {meal.aiFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs leading-relaxed text-emerald-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold block">영양 피드백</strong>
                          <span>{meal.aiFeedback}</span>
                        </div>
                      </div>
                    )}

                    {meal.notes && (
                      <p className="text-xs text-slate-500 italic">
                        "{meal.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Delete */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>기록 시점: {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <button
                    onClick={() => deleteMealRecord(meal.id)}
                    className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Korean Food Database Search & Reference Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
              당뇨 환자를 위한 한국 음식 영양 & 혈당지수(GI) 사전
            </h3>
            <p className="text-xs text-slate-500">
              자주 드시는 음식의 탄수화물 함량과 GI(혈당 상승 속도)를 검색해 보세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="음식명 검색 (예: 밥, 국, 찌개, 사과 등)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-52 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs">
          {[
            { id: 'all', label: '전체 보기' },
            { id: 'staple', label: '밥·면·주식류' },
            { id: 'soup_stew', label: '국·찌개류' },
            { id: 'meat_fish', label: '육류·생선·두부' },
            { id: 'vegetable', label: '채소·나물류' },
            { id: 'snack', label: '간식류' },
            { id: 'fruit', label: '과일류' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Food Table */}
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
              <tr>
                <th className="p-2.5 pl-4">음식명</th>
                <th className="p-2.5">기준 분량</th>
                <th className="p-2.5">열량 (kcal)</th>
                <th className="p-2.5">탄수화물 (g)</th>
                <th className="p-2.5">당류 (g)</th>
                <th className="p-2.5">단백질 (g)</th>
                <th className="p-2.5 pr-4">GI 지수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFoods.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70">
                  <td className="p-2.5 pl-4 font-bold text-slate-900">{f.name}</td>
                  <td className="p-2.5 text-slate-500">{f.portion}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{f.calories}</td>
                  <td className="p-2.5 font-bold text-amber-800">{f.carbs}g</td>
                  <td className="p-2.5 text-rose-700 font-semibold">{f.sugar}g</td>
                  <td className="p-2.5 text-teal-700 font-semibold">{f.protein}g</td>
                  <td className="p-2.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        f.giLevel === 'low'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : f.giLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {f.giLevel === 'low' ? '안전 (낮음)' : f.giLevel === 'medium' ? '보통' : '주의 (높음)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
