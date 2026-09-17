import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  FileText,
  Send,
  Users,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShareModal: React.FC = () => {
  const {
    isShareOpen,
    setIsShareOpen,
    userProfile,
    glucoseRecords,
    mealRecords,
    exerciseRecords,
    roleMode,
    seniorMode,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [kakaoSent, setKakaoSent] = useState(false);

  if (!isShareOpen) return null;

  // Recent 3 days average
  const inRangeCount = glucoseRecords.filter((g) => g.value >= 70 && g.value <= 180).length;
  const tir = Math.round((inRangeCount / (glucoseRecords.length || 1)) * 100);
  const latestG = glucoseRecords[0];

  const shareText = `[당당케어 당뇨 건강 리포트 공유]
👤 환자: ${userProfile.name} (${userProfile.age}세 · ${userProfile.diabetesType === 'type2' ? '2형 당뇨' : '1형 당뇨'})
🎯 최근 혈당 목표 범위 달성률(TIR): ${tir}%
🩸 최근 혈당: ${latestG ? `${latestG.value} mg/dL (${latestG.timing})` : '기록 없음'}
🏃 누적 운동: 총 ${exerciseRecords.length}회 실천 (총 ${exerciseRecords.reduce((a, b) => a + b.durationMinutes, 0)}분)
🥗 식단 관리: 평균 탄수화물 섭취 안정권 유지 중

상세 건강 추이는 당당케어에서 확인하세요.
${window.location.origin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleKakaoShare = () => {
    setKakaoSent(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setKakaoSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-bold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                가족 및 주치의 건강 리포트 공유
              </h3>
              <p className="text-xs text-slate-500">
                혈당 기록과 식단·운동 상관관계 데이터를 신속하게 전송합니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Preview Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed">
            {shareText}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Kakao share mock */}
            <button
              onClick={handleKakaoShare}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                kakaoSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FEE500] hover:bg-[#FDD800] text-[#191919]'
              } ${seniorMode ? 'text-base py-3.5' : 'text-sm'}`}
            >
              {kakaoSent ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>카카오톡 전송 완료! (가족에게 안심 알림 전송됨)</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>카카오톡으로 가족·보호자에게 전송</span>
                </>
              )}
            </button>

            {/* Copy text */}
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                seniorMode ? 'text-base py-3.5' : 'text-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">리포트 텍스트 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>진료 상담용 텍스트 복사</span>
                </>
              )}
            </button>

            {/* Print Friendly */}
            <button
              onClick={() => {
                setIsShareOpen(false);
                window.print();
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>종이 인쇄 / PDF 저장</span>
            </button>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">보호자 대리 케어 안내</strong>
              <p className="mt-0.5 text-amber-800">
                상단 메뉴의 '모드 변경'을 통해 부모님(이영희 님)의 혈당과 식단을 원격으로 대신 입력하고 추이를 확인할 수도 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
