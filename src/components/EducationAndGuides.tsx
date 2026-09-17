import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HEALTH_GUIDES } from '../data/mockData';
import { WorkoutVideoPlayerModal, WorkoutVideoItem } from './WorkoutVideoPlayerModal';
import {
  BookOpen,
  Video,
  Apple,
  AlertOctagon,
  ChevronRight,
  Play,
  CheckCircle,
  ExternalLink,
  Flame,
  TrendingDown,
  Clock,
  Sparkles,
  Tv
} from 'lucide-react';

export const EducationAndGuides: React.FC = () => {
  const { seniorMode } = useApp();
  const [activeTab, setActiveTab] = useState<'gi' | 'workout' | 'emergency'>('workout');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutVideoItem | null>(null);
  const [workoutFilter, setWorkoutFilter] = useState<'all' | 'post_meal' | 'cardio' | 'stretch'>('all');

  const homeWorkouts: WorkoutVideoItem[] = [
    {
      id: 'w1',
      title: '식후 10분! 거실 의자 스쿼트 & 가자미근 까치발 들기',
      target: '허벅지 대퇴사두근, 종아리 가자미근',
      durationMinutes: 10,
      difficulty: '초급 (시니어 안심)',
      effect: '식후 혈당 피크 30~50 mg/dL 억제',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/Pj1L78pE_xU',
      estimatedCalories: 65,
      estimatedDrop: 35,
      steps: [
        '의자 끝에 편안히 걸터앉아 양손을 가슴 앞에 모읍니다.',
        '발바닥 전체로 바닥을 밀며 천천히 일어선 후 1초간 정지합니다.',
        '엉덩이를 뒤로 빼며 천천히 의자에 살짝 닿을 때까지 앉습니다. (15회 반복)',
        '의자 등받이를 잡고 발뒤꿈치를 높이 들어올려 종아리 가자미근을 수축합니다. (20회 반복)',
      ],
      tips: '가자미근은 체내 포도당을 가장 활발하게 소모하는 근육입니다. 무릎 관절에 체중 부담 없이 식후 혈당 스파이크를 즉시 진정시킵니다.'
    },
    {
      id: 'w2',
      title: '무릎 관절에 무리 없는 제자리 파워 워킹 & 팔 휘두르기',
      target: '전신 유산소 및 심폐 지구력',
      durationMinutes: 15,
      difficulty: '초급 (관절 보호)',
      effect: '인슐린 저항성 완화 및 전신 혈류 개선',
      thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/50kH47ZztHs',
      estimatedCalories: 95,
      estimatedDrop: 40,
      steps: [
        '바른 자세로 서서 복부에 가볍게 힘을 줍니다.',
        '무릎을 골반 높이까지 천천히 올리며 팔을 앞뒤로 90도 각도로 힘차게 흔듭니다.',
        '호흡을 내뱉으며 리듬감 있게 15분간 유지합니다. (층간소음 없이 매트 위에서 권장)',
        '마무리로 가볍게 보폭을 줄이며 심박수를 정상화합니다.',
      ],
      tips: '발뒤꿈치부터 발바닥 전체로 부드럽게 딛는 롤링 보행을 유지하면 관절에 충격이 전혀 없습니다.'
    },
    {
      id: 'w3',
      title: '취침 전 5분 전신 릴랙스 스트레칭 & 횡격막 호흡',
      target: '코르티솔 완화, 수면 혈당 안정',
      durationMinutes: 5,
      difficulty: '초급 (침대 위 가능)',
      effect: '스트레스성 아침 공복 혈당 상승(새벽 현상) 완화',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/1f8yoFFdkLU',
      estimatedCalories: 30,
      estimatedDrop: 15,
      steps: [
        '침대에 누워 양 무릎을 가슴 쪽으로 끌어안아 허리를 부드럽게 이완합니다.',
        '코로 4초간 들이마시고 배를 부풀린 뒤, 입으로 6초간 천천히 내쉽니다.',
        '온몸의 근육 긴장을 풀고 편안한 호흡으로 수면에 들어갑니다.',
      ],
      tips: '스트레스 호르몬인 코르티솔 분비를 억제하여 밤사이 간에서 포도당이 과다 방출되는 것을 막아줍니다.'
    },
    {
      id: 'w4',
      title: '식후 즉시 7분! 상체 밴드 & 벽 밀기 저항 운동',
      target: '가슴, 어깨, 등 상체 근육군',
      durationMinutes: 7,
      difficulty: '초중급 (상체 근력)',
      effect: '근육 내 포도당 글리코겐 저장소 활성화',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/4KvhL3x0u1c',
      estimatedCalories: 50,
      estimatedDrop: 25,
      steps: [
        '벽에서 한 걸음 떨어져 서서 양손을 어깨너비로 벽에 짚습니다.',
        '천천히 팔꿈치를 굽혀 가슴이 벽에 닿을 듯 내려갔다가 1초 멈춘 후 밀어냅니다.',
        '탄성 밴드를 양손으로 잡고 가슴 높이에서 좌우로 벌려 견갑골을 모읍니다. (12회 2세트)',
        '어깨를 가볍게 털어주며 긴장을 풀어줍니다.',
      ],
      tips: '하체 관절이 불편한 날에도 상체 큰 근육들을 사용하여 혈중 포도당을 빠르게 흡수시킵니다.'
    },
    {
      id: 'w5',
      title: '혈액순환 림프 마사지 & 발목 펌핑 운동',
      target: '하지 말초 순환, 발목 관절, 족부 건강',
      durationMinutes: 8,
      difficulty: '초급 (당뇨발 예방)',
      effect: '당뇨발 예방, 붓기 완화 및 말초 신경 혈류 촉진',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/kL8_m1gA6z8',
      estimatedCalories: 40,
      estimatedDrop: 20,
      steps: [
        '의자에 앉아 양 발끝을 몸 쪽으로 최대한 당겼다가 반대로 쭉 펴줍니다. (30회)',
        '발목으로 큰 원을 그리듯 시계 방향과 반시계 방향으로 각각 10회 회전합니다.',
        '발바닥과 종아리를 가볍게 손으로 쓸어올리며 림프 순환을 돕습니다.',
        '발가락으로 수건을 집어 올리는 훈련으로 발바닥 소근육을 자극합니다.',
      ],
      tips: '당뇨 환자에게 가장 중요한 발 관리(당뇨발) 예방 운동으로, 말초 혈관 수축을 방지하고 상처 발생 위험을 낮춥니다.'
    }
  ];

  const filteredWorkouts = homeWorkouts.filter((w) => {
    if (workoutFilter === 'post_meal') return w.id === 'w1' || w.id === 'w4';
    if (workoutFilter === 'cardio') return w.id === 'w2';
    if (workoutFilter === 'stretch') return w.id === 'w3' || w.id === 'w5';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
              📚
            </div>
            <h2 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              당뇨 지식 & 홈트레이닝 가이드
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            당뇨 관리에 검증된 식재료 정보와 실내 홈트레이닝, 응급 대처법을 제공합니다.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('gi')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'gi' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            식재료 & GI 정보
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'workout' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            홈트레이닝 영상
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'emergency' ? 'bg-rose-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            저혈당 응급 수칙
          </button>
        </div>
      </div>

      {/* TAB 1: GI & FOOD INFO */}
      {activeTab === 'gi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HEALTH_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className={`p-5 rounded-2xl border bg-gradient-to-br ${guide.bgClass} shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border text-slate-700">{guide.category}</span>
                    <span>읽는 시간 {guide.readTime}</span>
                  </div>

                  <h3 className={`font-bold text-slate-900 leading-snug mb-2 ${seniorMode ? 'text-lg' : 'text-base'}`}>
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {guide.summary}
                  </p>

                  <div className="space-y-1.5">
                    {guide.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick GI Comparison Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className={`font-bold text-slate-900 mb-3 ${seniorMode ? 'text-xl' : 'text-base'}`}>
              주요 식품별 혈당지수(GI) 비교표
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>착한 저GI 식품 (55 이하)</span>
                </div>
                <p className="text-emerald-800 mb-2">혈당을 완만히 올리고 인슐린 과다 분비를 방지합니다.</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• 귀리, 보리, 현미밥</li>
                  <li>• 두부, 콩류, 계란, 닭가슴살</li>
                  <li>• 시금치, 브로콜리, 양배추, 오이</li>
                  <li>• 아몬드, 호두, 사과(반쪽), 블루베리</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>보통 GI 식품 (56 ~ 69)</span>
                </div>
                <p className="text-amber-800 mb-2">적정 섭취량을 지키고 채소와 함께 드세요.</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• 고구마, 삶은 단호박</li>
                  <li>• 호밀빵, 통밀빵</li>
                  <li>• 바나나(덜 익은 것), 포도</li>
                  <li>• 메밀국수 (순메밀)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="font-bold text-rose-900 text-sm mb-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span>주의 고GI 식품 (70 이상)</span>
                </div>
                <p className="text-rose-800 mb-2">식후 급격한 혈당 스파이크를 유발하므로 제한 권장.</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• 흰쌀밥, 찹쌀떡, 식빵</li>
                  <li>• 짜장면, 떡볶이, 라면</li>
                  <li>• 구운 감자, 수박, 믹스커피</li>
                  <li>• 탄산음료, 과일 주스, 과자</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKOUT VIDEOS */}
      {activeTab === 'workout' && (
        <div className="space-y-6">
          {/* Workout Filter Tabs & Guide Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-amber-900/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 text-xs font-bold border border-yellow-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>당뇨 맞춤 홈트레이닝 영상 클래스</span>
              </div>
              <h3 className={`font-black tracking-tight ${seniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                영상을 재생하고 동작을 따라하며 식후 혈당을 안전하게 낮추세요
              </h3>
              <p className="text-xs sm:text-sm text-yellow-100/90 mt-1">
                재생 버튼을 누르면 실시간 타이머, 동작 코칭, 혈당 강하 예측과 함께 영상이 즉시 재생됩니다.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-amber-900/60 text-xs font-bold shrink-0">
              <button
                onClick={() => setWorkoutFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  workoutFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'text-yellow-200 hover:text-white'
                }`}
              >
                전체 ({homeWorkouts.length})
              </button>
              <button
                onClick={() => setWorkoutFilter('post_meal')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  workoutFilter === 'post_meal' ? 'bg-emerald-600 text-white font-bold' : 'text-yellow-200 hover:text-white'
                }`}
              >
                식후 혈당 방어
              </button>
              <button
                onClick={() => setWorkoutFilter('cardio')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  workoutFilter === 'cardio' ? 'bg-amber-500 text-slate-950 font-black' : 'text-yellow-200 hover:text-white'
                }`}
              >
                실내 유산소
              </button>
              <button
                onClick={() => setWorkoutFilter('stretch')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  workoutFilter === 'stretch' ? 'bg-purple-600 text-white font-bold' : 'text-yellow-200 hover:text-white'
                }`}
              >
                스트레칭·당뇨발
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkouts.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail and Play Overlay */}
                  <div
                    onClick={() => setSelectedWorkout(w)}
                    className="h-48 relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={w.thumbnail}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/25 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                        <Play className="w-6 h-6 ml-1 fill-emerald-600 text-emerald-600" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{w.durationMinutes}분 영상</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center justify-between">
                      <span className="text-emerald-400">{w.effect}</span>
                      <span className="text-amber-300">-{w.estimatedDrop} mg/dL</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{w.difficulty}</span>
                      <span>자극: {w.target}</span>
                    </div>

                    <h3 className={`font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors ${seniorMode ? 'text-xl' : 'text-base sm:text-lg'}`}>
                      {w.title}
                    </h3>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold">소모 칼로리</div>
                          <div className="font-extrabold text-slate-900">~{w.estimatedCalories} kcal</div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold">예상 혈당 강하</div>
                          <div className="font-extrabold text-emerald-700">-{w.estimatedDrop} mg/dL</div>
                        </div>
                      </div>
                    </div>

                    {/* Step summary list */}
                    <div className="space-y-1 pt-1">
                      {w.steps.slice(0, 2).map((step, idx) => (
                        <p key={idx} className="text-xs text-slate-600 leading-relaxed truncate">
                          <strong className="text-blue-600">{idx + 1}.</strong> {step}
                        </p>
                      ))}
                      {w.steps.length > 2 && (
                        <p className="text-[11px] text-slate-400 font-medium">
                          외 {w.steps.length - 2}단계 코칭 포함
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <button
                    onClick={() => setSelectedWorkout(w)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>영상 재생 & 동작 따라하기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Video Player Modal */}
      {selectedWorkout && (
        <WorkoutVideoPlayerModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}

      {/* TAB 3: EMERGENCY PROTOCOL */}
      {activeTab === 'emergency' && (
        <div className="bg-white p-6 rounded-2xl border-2 border-rose-300 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h3 className={`font-black text-rose-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                저혈당(70 mg/dL 미만) 응급 대처 15-15 법칙
              </h3>
              <p className="text-xs text-rose-700">식은땀, 손떨림, 어지럼증, 가슴 두근거림 시 즉각 조치</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase block mb-1">1단계 (즉시 섭취)</span>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">단순당 15g 즉시 섭취</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                오렌지주스 반 컵(100ml), 사탕 3~4알, 콜라 반 캔, 설탕물 1숟가락을 즉시 섭취합니다. (지방이 많은 초콜릿은 흡수가 느려 비권장)
              </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase block mb-1">2단계 (안정 & 대기)</span>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">15분간 편안히 휴식</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                움직이지 말고 자리에 앉거나 누워 휴식을 취합니다. 음식이 흡수되는 15분 동안 기다립니다.
              </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase block mb-1">3단계 (재측정)</span>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">혈당 재측정 및 확인</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                15분 후 혈당을 다시 측정합니다. 여전히 70mg/dL 미만이라면 1단계를 1회 더 반복하고, 호전되지 않거나 의식이 흐려지면 119에 도움을 요청합니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
