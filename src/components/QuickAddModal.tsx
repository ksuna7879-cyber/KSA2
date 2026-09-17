import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlucoseTiming, GlucoseStatus, MealTimeType, FoodItem, ExerciseType } from '../types';
import { FOOD_DATABASE, EXERCISE_CATEGORIES } from '../data/foodDatabase';
import { evaluateGlucoseStatus, calculateCaloriesBurned, estimateSugarDrop } from '../utils/calculations';
import {
  X,
  Activity,
  Utensils,
  Footprints,
  Plus,
  Trash2,
  Camera,
  Check,
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddType,
    closeQuickAdd,
    addGlucoseRecord,
    addMealRecord,
    addExerciseRecord,
    userProfile,
    seniorMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'glucose' | 'meal' | 'exercise'>(
    quickAddType || 'glucose'
  );

  // Sync with prop when opened
  React.useEffect(() => {
    if (quickAddType) {
      setActiveTab(quickAddType);
    }
  }, [quickAddType]);

  // GLUCOSE FORM STATE
  const [glucoseVal, setGlucoseVal] = useState<number>(128);
  const [glucoseTiming, setGlucoseTiming] = useState<GlucoseTiming>('after_lunch_2h');
  const [glucoseNotes, setGlucoseNotes] = useState('');

  // MEAL FORM STATE
  const [mealType, setMealType] = useState<MealTimeType>('lunch');
  const [selectedFoods, setSelectedFoods] = useState<{ food: FoodItem; quantity: number }[]>([
    { food: FOOD_DATABASE[0], quantity: 1 }, // 현미밥
    { food: FOOD_DATABASE[9], quantity: 1 }, // 된장찌개
  ]);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [mealNotes, setMealNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  );

  // EXERCISE FORM STATE
  const [selectedExCategory, setSelectedExCategory] = useState(EXERCISE_CATEGORIES[0]);
  const [exDuration, setExDuration] = useState<number>(25);
  const [exIntensity, setExIntensity] = useState<'light' | 'moderate' | 'vigorous'>('light');
  const [exNotes, setExNotes] = useState('');

  if (!quickAddType) return null;

  // Real-time calculations for glucose
  const currentStatus = evaluateGlucoseStatus(glucoseVal, glucoseTiming, userProfile);

  // Real-time calculations for meal
  const totalCalories = Math.round(
    selectedFoods.reduce((sum, item) => sum + item.food.calories * item.quantity, 0)
  );
  const totalCarbs = Math.round(
    selectedFoods.reduce((sum, item) => sum + item.food.carbs * item.quantity, 0)
  );
  const totalProtein = Math.round(
    selectedFoods.reduce((sum, item) => sum + item.food.protein * item.quantity, 0)
  );
  const totalFat = Math.round(
    selectedFoods.reduce((sum, item) => sum + item.food.fat * item.quantity, 0)
  );
  const totalSugar = Math.round(
    selectedFoods.reduce((sum, item) => sum + item.food.sugar * item.quantity, 0)
  );

  const spikeRisk: 'low' | 'moderate' | 'high' =
    totalCarbs > 90 || totalSugar > 20
      ? 'high'
      : totalCarbs > 60 || totalSugar > 12
      ? 'moderate'
      : 'low';

  // Real-time calculations for exercise
  const caloriesBurned = calculateCaloriesBurned(
    selectedExCategory.met,
    userProfile.weight,
    exDuration,
    exIntensity
  );
  const estimatedSugarDrop = estimateSugarDrop(
    selectedExCategory.met,
    exDuration,
    exIntensity
  );

  // Handlers
  const handleSaveGlucose = (e: React.FormEvent) => {
    e.preventDefault();
    addGlucoseRecord({
      timestamp: new Date().toISOString(),
      value: glucoseVal,
      timing: glucoseTiming,
      status: currentStatus.status,
      notes: glucoseNotes.trim() || undefined,
    });
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    closeQuickAdd();
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFoods.length === 0) return;

    let aiFeedback = '균형 잡힌 영양 식단입니다.';
    if (spikeRisk === 'high') {
      aiFeedback = `탄수화물(${totalCarbs}g)과 당류(${totalSugar}g)가 높아 식후 혈당 급상승 위험이 있습니다. 식후 20~30분 가벼운 산책이나 하체 운동을 꼭 진행하세요!`;
    } else if (spikeRisk === 'moderate') {
      aiFeedback = '적정 수준의 탄수화물 식단입니다. 식후 가벼운 활동으로 혈당을 안정화해 보세요.';
    } else {
      aiFeedback = '풍부한 단백질과 식이섬유로 혈당 스파이크 위험이 낮고 훌륭합니다.';
    }

    addMealRecord({
      timestamp: new Date().toISOString(),
      type: mealType,
      items: selectedFoods,
      totalCalories,
      totalCarbs,
      totalProtein,
      totalFat,
      totalSugar,
      photoUrl: photoUrl || undefined,
      notes: mealNotes.trim() || undefined,
      spikeRisk,
      aiFeedback,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    closeQuickAdd();
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    addExerciseRecord({
      timestamp: new Date().toISOString(),
      exerciseName: selectedExCategory.name,
      exerciseType: selectedExCategory.type,
      durationMinutes: exDuration,
      intensity: exIntensity,
      caloriesBurned,
      estimatedBloodSugarDrop: estimatedSugarDrop,
      notes: exNotes.trim() || undefined,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    closeQuickAdd();
  };

  // Add food from search
  const addFoodItem = (food: FoodItem) => {
    const existing = selectedFoods.find((i) => i.food.id === food.id);
    if (existing) {
      setSelectedFoods(
        selectedFoods.map((i) =>
          i.food.id === food.id ? { ...i, quantity: Math.round((i.quantity + 0.5) * 10) / 10 } : i
        )
      );
    } else {
      setSelectedFoods([...selectedFoods, { food, quantity: 1 }]);
    }
  };

  const removeFoodItem = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter((i) => i.food.id !== foodId));
  };

  const filteredFoods = FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="quick-tab-glucose"
              onClick={() => setActiveTab('glucose')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'glucose'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              } ${seniorMode ? 'text-base py-2.5' : ''}`}
            >
              <Activity className="w-4 h-4" />
              <span>혈당 기록</span>
            </button>

            <button
              id="quick-tab-meal"
              onClick={() => setActiveTab('meal')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'meal'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              } ${seniorMode ? 'text-base py-2.5' : ''}`}
            >
              <Utensils className="w-4 h-4" />
              <span>식단 기록</span>
            </button>

            <button
              id="quick-tab-exercise"
              onClick={() => setActiveTab('exercise')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'exercise'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              } ${seniorMode ? 'text-base py-2.5' : ''}`}
            >
              <Footprints className="w-4 h-4" />
              <span>운동 기록</span>
            </button>
          </div>

          <button
            id="quick-close-btn"
            onClick={closeQuickAdd}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* ===================== GLUCOSE TAB ===================== */}
          {activeTab === 'glucose' && (
            <form onSubmit={handleSaveGlucose} className="space-y-6">
              {/* Value Input Section with Big Stepper */}
              <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 text-center">
                <label className="block text-xs sm:text-sm font-semibold text-rose-800 mb-2">
                  측정 혈당 수치 (mg/dL)
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGlucoseVal((prev) => Math.max(40, prev - 5))}
                    className="w-12 h-12 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-lg hover:bg-rose-100 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    -5
                  </button>

                  <div className="relative">
                    <input
                      id="glucose-value-input"
                      type="number"
                      value={glucoseVal}
                      onChange={(e) => setGlucoseVal(Number(e.target.value))}
                      className="w-36 text-center text-4xl sm:text-5xl font-black text-slate-900 bg-white border-2 border-rose-300 rounded-2xl py-2 focus:ring-4 focus:ring-rose-200 focus:outline-hidden"
                      min="30"
                      max="600"
                    />
                    <span className="text-xs text-slate-500 font-bold block mt-1">mg/dL</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGlucoseVal((prev) => Math.min(500, prev + 5))}
                    className="w-12 h-12 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-lg hover:bg-rose-100 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    +5
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs sm:text-sm font-bold shadow-xs">
                  <span className={`px-2.5 py-0.5 rounded-full border ${currentStatus.badgeClass}`}>
                    {currentStatus.label}
                  </span>
                  <span className="text-slate-600 font-normal text-xs">{currentStatus.advice}</span>
                </div>
              </div>

              {/* Timing Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  측정 시점 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'fasting', label: '🌅 아침 공복' },
                    { id: 'after_breakfast_2h', label: '🍳 아침 식후 2시간' },
                    { id: 'before_lunch', label: '☀️ 점심 식전' },
                    { id: 'after_lunch_2h', label: '🍱 점심 식후 2시간' },
                    { id: 'before_dinner', label: '🌙 저녁 식전' },
                    { id: 'after_dinner_2h', label: '🍲 저녁 식후 2시간' },
                    { id: 'bedtime', label: '🛌 취침 전' },
                    { id: 'night', label: '🌌 야간/새벽' },
                    { id: 'random', label: '🕒 수시 측정' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGlucoseTiming(item.id as GlucoseTiming)}
                      className={`p-2.5 text-xs sm:text-sm rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        glucoseTiming === item.id
                          ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  메모 (선택)
                </label>
                <input
                  type="text"
                  placeholder="예: 기상 직후 측정, 어제 과식 여파, 컨디션 양호 등"
                  value={glucoseNotes}
                  onChange={(e) => setGlucoseNotes(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                id="save-glucose-btn"
                className={`w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  seniorMode ? 'text-lg py-4' : 'text-base'
                }`}
              >
                <Check className="w-5 h-5" />
                <span>혈당 기록 저장하기</span>
              </button>
            </form>
          )}

          {/* ===================== MEAL TAB ===================== */}
          {activeTab === 'meal' && (
            <form onSubmit={handleSaveMeal} className="space-y-6">
              {/* Meal Type Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  끼니 구분
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'breakfast', label: '🍳 아침' },
                    { id: 'lunch', label: '🍱 점심' },
                    { id: 'dinner', label: '🍲 저녁' },
                    { id: 'snack', label: '☕ 간식' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMealType(m.id as MealTimeType)}
                      className={`py-2 text-center text-xs sm:text-sm rounded-xl border font-bold transition-all cursor-pointer ${
                        mealType === m.id
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition Summary Bar */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900">식단 영양소 실시간 합계</span>
                  <div className="flex items-center gap-1.5">
                    {spikeRisk === 'high' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                        <AlertTriangle className="w-3 h-3" /> 혈당 스파이크 주의
                      </span>
                    ) : spikeRisk === 'moderate' ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        보통 혈당 부담
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        안정적 저당 식단
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center pt-1">
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-slate-500 block">총 칼로리</span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">{totalCalories}</span>
                    <span className="text-[10px] text-slate-400 block">kcal</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-amber-700 block font-semibold">탄수화물</span>
                    <span className="font-extrabold text-sm sm:text-base text-amber-800">{totalCarbs}g</span>
                    <span className="text-[10px] text-slate-400 block">목표 ~70g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-rose-700 block font-semibold">당류</span>
                    <span className="font-extrabold text-sm sm:text-base text-rose-800">{totalSugar}g</span>
                    <span className="text-[10px] text-slate-400 block">&lt; 15g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-blue-700 block font-semibold">단백질</span>
                    <span className="font-extrabold text-sm sm:text-base text-blue-800">{totalProtein}g</span>
                    <span className="text-[10px] text-slate-400 block">권장 25g+</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-amber-100">
                    <span className="text-[11px] text-slate-600 block">지방</span>
                    <span className="font-extrabold text-sm sm:text-base text-slate-800">{totalFat}g</span>
                    <span className="text-[10px] text-slate-400 block">불포화</span>
                  </div>
                </div>
              </div>

              {/* Selected Foods List */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  선택된 메뉴 ({selectedFoods.length}개)
                </label>
                {selectedFoods.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    아래 음식 사전에서 드신 음식을 검색하여 추가해 주세요.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedFoods.map((item) => (
                      <div
                        key={item.food.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{item.food.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                item.food.giLevel === 'low'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.food.giLevel === 'medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              GI {item.food.giLevel === 'low' ? '낮음' : item.food.giLevel === 'medium' ? '보통' : '높음'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {item.food.portion} × {item.quantity}인분 ({Math.round(item.food.calories * item.quantity)} kcal · 탄수{' '}
                            {Math.round(item.food.carbs * item.quantity)}g)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFoods(
                                selectedFoods.map((f) =>
                                  f.food.id === item.food.id
                                    ? { ...f, quantity: Math.max(0.5, Math.round((f.quantity - 0.5) * 10) / 10) }
                                    : f
                                )
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFoods(
                                selectedFoods.map((f) =>
                                  f.food.id === item.food.id
                                    ? { ...f, quantity: Math.round((f.quantity + 0.5) * 10) / 10 }
                                    : f
                                )
                              )
                            }
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFoodItem(item.food.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Food Search & Quick Add */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  음식 검색 및 빠른 추가
                </label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="현미밥, 된장찌개, 닭가슴살, 쌈채소, 계란 등 검색"
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/70 rounded-xl border border-slate-200">
                  {filteredFoods.slice(0, 12).map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => addFoodItem(food)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      <span>{food.name}</span>
                      <span className="text-[10px] text-slate-400">({food.calories}kcal)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>식단 사진 (선택)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {photoUrl && (
                      <img
                        src={photoUrl}
                        alt="식단 미리보기"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                    )}
                    <div className="text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() =>
                          setPhotoUrl(
                            photoUrl
                              ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
                              : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                          )
                        }
                        className="text-amber-700 font-semibold underline cursor-pointer"
                      >
                        사진 변경/업로드
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">식단 사진 기록 보관용</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    식사 메모
                  </label>
                  <input
                    type="text"
                    placeholder="예: 쌈채소 먼저 섭취, 밥 반 공기 남김"
                    value={mealNotes}
                    onChange={(e) => setMealNotes(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Save Meal Button */}
              <button
                type="submit"
                id="save-meal-btn"
                className={`w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  seniorMode ? 'text-lg py-4' : 'text-base'
                }`}
              >
                <Check className="w-5 h-5" />
                <span>식단 기록 완료 (식후 2시간 알림 예약)</span>
              </button>
            </form>
          )}

          {/* ===================== EXERCISE TAB ===================== */}
          {activeTab === 'exercise' && (
            <form onSubmit={handleSaveExercise} className="space-y-6">
              {/* Exercise Category Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  운동 종목 선택 (식후 혈당 강하 효과 검증)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXERCISE_CATEGORIES.map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setSelectedExCategory(ex)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedExCategory.id === ex.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{ex.name}</div>
                      <div
                        className={`text-[11px] mt-1 ${
                          selectedExCategory.id === ex.id ? 'text-slate-900 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {ex.type === 'cardio' ? '유산소' : ex.type === 'strength' ? '근력' : '유연성'} · MET {ex.met}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Exercise Benefit Metric Card */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 mb-2 text-amber-950 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>예상 효과 시뮬레이션 (체중 {userProfile.weight}kg 기준)</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-xs text-slate-500 block">소모 칼로리</span>
                    <span className="text-2xl font-black text-amber-800">{caloriesBurned}</span>
                    <span className="text-xs text-slate-500"> kcal</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-xs text-slate-500 block">예상 혈당 강하치</span>
                    <span className="text-2xl font-black text-emerald-600">-{estimatedSugarDrop}</span>
                    <span className="text-xs text-slate-500"> mg/dL</span>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900 mt-2.5 leading-relaxed bg-amber-100/60 p-2 rounded-lg">
                  💡 {selectedExCategory.description} ({selectedExCategory.recommendedTiming})
                </p>
              </div>

              {/* Duration Buttons */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  운동 시간: <span className="text-amber-800 font-bold">{exDuration}분</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setExDuration(mins)}
                      className={`py-2 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer transition-colors ${
                        exDuration === mins
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mins}분
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  운동 강도
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: '가벼움 (대화 가능)' },
                    { id: 'moderate', label: '보통 (약간 숨참)' },
                    { id: 'vigorous', label: '격렬함 (땀 흠뻑)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExIntensity(lvl.id as any)}
                      className={`py-2 text-xs sm:text-sm rounded-xl font-medium border cursor-pointer ${
                        exIntensity === lvl.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  운동 메모 (선택)
                </label>
                <input
                  type="text"
                  placeholder="예: 점심 식후 30분 시점에 공원 2바퀴 산책함"
                  value={exNotes}
                  onChange={(e) => setExNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Save Exercise Button */}
              <button
                type="submit"
                id="save-exercise-btn"
                className={`w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  seniorMode ? 'text-lg py-4' : 'text-base'
                }`}
              >
                <Check className="w-5 h-5" />
                <span>운동 기록 저장하기</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
