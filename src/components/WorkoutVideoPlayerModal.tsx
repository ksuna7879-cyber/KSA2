import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  TrendingDown,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Tv,
  Film,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

export interface WorkoutVideoItem {
  id: string;
  title: string;
  target: string;
  durationMinutes: number;
  difficulty: string;
  effect: string;
  thumbnail: string;
  videoUrl: string;
  youtubeEmbedUrl: string;
  estimatedCalories: number;
  estimatedDrop: number;
  steps: string[];
  tips: string;
}

interface WorkoutVideoPlayerModalProps {
  workout: WorkoutVideoItem;
  onClose: () => void;
}

export const WorkoutVideoPlayerModal: React.FC<WorkoutVideoPlayerModalProps> = ({
  workout,
  onClose,
}) => {
  const { addExerciseRecord, seniorMode } = useApp();

  // Player mode: 'html5' (direct video file) or 'youtube' (embedded stream)
  const [playerMode, setPlayerMode] = useState<'html5' | 'youtube'>('html5');

  // Video playback states for HTML5
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Live Timer states (Countdown)
  const totalSecondsInitial = workout.durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSecondsInitial);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  // Active step tracker
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, remainingSeconds]);

  // Sync active step based on progress
  useEffect(() => {
    const elapsedSeconds = totalSecondsInitial - remainingSeconds;
    const progressFraction = elapsedSeconds / (totalSecondsInitial || 1);
    const calculatedStep = Math.min(
      Math.floor(progressFraction * workout.steps.length),
      workout.steps.length - 1
    );
    setCurrentStepIndex(Math.max(0, calculatedStep));
  }, [remainingSeconds, totalSecondsInitial, workout.steps.length]);

  // Video play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsTimerActive(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
        setIsTimerActive(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // One-click save to exercise diary
  const handleSaveToDiary = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((totalSecondsInitial - remainingSeconds) / 60)
    );
    const minutesToRecord = elapsedMinutes >= 3 ? elapsedMinutes : workout.durationMinutes;

    addExerciseRecord({
      exerciseName: workout.title,
      exerciseType: 'strength',
      durationMinutes: minutesToRecord,
      intensity: 'moderate',
      caloriesBurned: workout.estimatedCalories,
      estimatedBloodSugarDrop: workout.estimatedDrop,
      notes: `[홈트레이닝 영상 시청 완료] ${workout.target} 자극 · ${workout.effect}`,
      timestamp: new Date().toISOString(),
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-black text-white tracking-tight ${seniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                  {workout.title}
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-emerald-950">
                  {workout.difficulty}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                타깃: {workout.target} · <span className="text-emerald-300 font-semibold">{workout.effect}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Player mode toggle buttons */}
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setPlayerMode('html5')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerMode === 'html5'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>기본 플레이어</span>
              </button>
              <button
                onClick={() => setPlayerMode('youtube')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  playerMode === 'youtube'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>유튜브 모드</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* 1. VIDEO SCREEN AREA */}
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg aspect-video flex items-center justify-center group border border-slate-800">
            {playerMode === 'html5' ? (
              <>
                <video
                  ref={videoRef}
                  src={workout.videoUrl}
                  poster={workout.thumbnail}
                  controls
                  autoPlay
                  loop
                  playsInline
                  onPlay={() => {
                    setIsPlaying(true);
                    setIsTimerActive(true);
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                    setIsTimerActive(false);
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Custom Overlay Quick Speed Control Badge */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white shadow-lg">
                  <span className="text-slate-300">재생속도:</span>
                  {[0.75, 1.0, 1.25].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        playbackSpeed === speed
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      title={speed === 0.75 ? '시니어 맞춤 천천히 따라하기' : `${speed}배속`}
                    >
                      {speed === 0.75 ? '0.75x(시니어)' : `${speed}x`}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <iframe
                src={`${workout.youtubeEmbedUrl}?autoplay=1&enablejsapi=1`}
                title={workout.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Mobile player mode switch */}
          <div className="sm:hidden flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPlayerMode('html5')}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                playerMode === 'html5' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              기본 플레이어
            </button>
            <button
              onClick={() => setPlayerMode('youtube')}
              className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                playerMode === 'youtube' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              유튜브 모드
            </button>
          </div>

          {/* 2. REAL-TIME WORKOUT COACH & COUNTDOWN STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timer Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950 to-yellow-950 text-white shadow-md flex flex-col justify-between border border-amber-900/50">
              <div className="flex items-center justify-between text-xs text-yellow-200 font-semibold mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  남은 운동 시간
                </span>
                <span className="bg-amber-800/80 px-2 py-0.5 rounded text-[11px] font-bold">
                  총 {workout.durationMinutes}분
                </span>
              </div>

              <div className="my-2 text-center">
                <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                  {formatTime(remainingSeconds)}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-amber-800/60">
                <button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isTimerActive
                      ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  }`}
                >
                  {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerActive ? '일시정지' : '타이머 재개'}</span>
                </button>
                <button
                  onClick={() => {
                    setRemainingSeconds(totalSecondsInitial);
                    setIsTimerActive(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="타이머 리셋"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>처음부터</span>
                </button>
              </div>
            </div>

            {/* Calories & Blood Sugar Expected Drop Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 border border-emerald-200 flex flex-col justify-between">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>혈당 강하 & 에너지 소비 예측</span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-1">
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/80 text-center shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>예상 소모 칼로리</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                    ~{workout.estimatedCalories} <span className="text-xs text-slate-500 font-bold">kcal</span>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-emerald-200/80 text-center shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>예상 혈당 강하</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                    -{workout.estimatedDrop} <span className="text-xs text-slate-500 font-bold">mg/dL</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-emerald-800 leading-snug mt-2">
                💡 식후 30분~1시간 시점에 실시하면 혈당 스파이크를 최대 50%까지 방어합니다.
              </p>
            </div>

            {/* Doctor/Trainer Tip Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Info className="w-4 h-4 text-amber-600" />
                <span>전문의 코칭 & 안전 수칙</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1.5">
                <p>{workout.tips}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-200/80 text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                <span>⚠️ 어지럽거나 식은땀이 나면 즉시 중단하고 혈당을 측정하세요.</span>
              </div>
            </div>
          </div>

          {/* 3. STEP-BY-STEP ACTION INSTRUCTIONS */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-bold text-slate-900 ${seniorMode ? 'text-lg' : 'text-base'}`}>
                운동 순서 및 동작별 가이드 ({workout.steps.length}단계)
              </h4>
              <span className="text-xs font-semibold text-slate-500">
                현재: {currentStepIndex + 1} / {workout.steps.length}단계 진행 중
              </span>
            </div>

            <div className="space-y-2.5">
              {workout.steps.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                        : isPassed
                        ? 'bg-white border-slate-200 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-slate-500'}`}>
                          {idx + 1}단계 동작
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                            현재 진행 중
                          </span>
                        )}
                      </div>
                      <p className={`text-sm sm:text-base leading-relaxed mt-0.5 ${
                        isCurrent ? 'font-bold text-slate-900' : 'text-slate-700'
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>영상을 보며 운동을 완료한 후, 아래 버튼을 눌러 오늘 운동 다이어리에 등록하세요.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              닫기
            </button>

            <button
              id="save-completed-workout-btn"
              onClick={handleSaveToDiary}
              disabled={isSaved}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-700 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-98'
              }`}
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>{isSaved ? '✓ 오늘 운동 기록 완료!' : '운동 완료 & 다이어리 기록하기'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
