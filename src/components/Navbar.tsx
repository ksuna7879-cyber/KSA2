import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Utensils,
  Footprints,
  FileBarChart2,
  BookOpen,
  Bell,
  Share2,
  Type,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    seniorMode,
    toggleSeniorMode,
    roleMode,
    setRoleMode,
    userProfile,
    currentTab,
    setCurrentTab,
    notifications,
    unreadCount,
    markNotificationAsRead,
    setIsShareOpen,
    openQuickAdd,
    isLoginHistoryOpen,
    setIsLoginHistoryOpen,
    currentProvider,
    loginHistory,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner for Senior / Caregiver Info */}
      <div className="bg-slate-900 text-slate-100 text-sm px-3 sm:px-4 py-2 flex justify-between items-center transition-all overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0">
            {roleMode === 'self' ? '👤 본인 모드' : '👵 보호자 대리 모드'}
          </span>
          <span className="font-semibold whitespace-nowrap text-sm sm:text-base">
            {userProfile.name} ({userProfile.age}세 · {userProfile.diabetesType === 'type2' ? '2형 당뇨' : userProfile.diabetesType === 'type1' ? '1형 당뇨' : '전당뇨'})
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300 whitespace-nowrap text-xs sm:text-sm">
            목표 공복 {userProfile.targetFastingMin}~{userProfile.targetFastingMax} / 식후 ≤{userProfile.targetPostMealMax} mg/dL
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
          {/* Login Provider & History Badge Button */}
          <button
            id="open-login-history-banner-btn"
            onClick={() => setIsLoginHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700 whitespace-nowrap shrink-0"
            title="소셜 로그인 상태 및 접속 이력 확인"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                currentProvider === 'kakao'
                  ? 'bg-[#FEE500]'
                  : currentProvider === 'naver'
                  ? 'bg-[#03C75A]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="hidden xs:inline font-bold whitespace-nowrap">
              {currentProvider === 'kakao' ? '카카오' : currentProvider === 'naver' ? '네이버' : '구글'}
            </span>
            <span className="text-slate-200 whitespace-nowrap font-medium">로그인 기록</span>
          </button>

          {/* Senior Mode Toggle with high visual prominence */}
          <button
            id="toggle-senior-mode-btn"
            onClick={toggleSeniorMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              seniorMode
                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 shadow-xs'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="고령층 및 시니어를 위한 큰 글씨와 큰 터치 영역 모드"
          >
            <Type className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{seniorMode ? '큰글씨 모드 ON' : '큰글씨 모드'}</span>
          </button>

          {/* Role Switch Dropdown */}
          <div className="relative shrink-0">
            <button
              id="switch-role-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">모드 변경</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  관리 대상 선택
                </div>
                <button
                  onClick={() => {
                    setRoleMode('self');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    roleMode === 'self' ? 'font-bold text-emerald-600 bg-emerald-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold">김철수 (본인)</div>
                    <div className="text-[11px] text-slate-500">58세 · 2형 당뇨</div>
                  </div>
                  {roleMode === 'self' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => {
                    setRoleMode('caregiver');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    roleMode === 'caregiver' ? 'font-bold text-emerald-600 bg-emerald-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold">이영희 (어머니 대리 관리)</div>
                    <div className="text-[11px] text-slate-500">74세 · 가족 대리 기록</div>
                  </div>
                  {roleMode === 'caregiver' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="brand-logo-btn"
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold tracking-tight text-slate-900 whitespace-nowrap ${seniorMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                  당당케어
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                  DangDang
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden 2xl:block whitespace-nowrap">
                당뇨를 당당하게 관리하는 식단·운동·혈당 통합 솔루션
              </p>
            </div>
          </button>
        </div>

        {/* Primary Navigation Tabs with Korean Line-break & Whitespace Optimization */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shrink-0">
          <button
            id="tab-nav-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'dashboard'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <Activity className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
            <span className="whitespace-nowrap">대시보드</span>
          </button>

          <button
            id="tab-nav-glucose"
            onClick={() => setCurrentTab('glucose')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'glucose'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span className="whitespace-nowrap">혈당 기록</span>
          </button>

          <button
            id="tab-nav-meals"
            onClick={() => setCurrentTab('meals')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'meals'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <Utensils className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
            <span className="whitespace-nowrap">식단 관리</span>
          </button>

          <button
            id="tab-nav-exercise"
            onClick={() => setCurrentTab('exercise')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'exercise'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <Footprints className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
            <span className="whitespace-nowrap">운동 관리</span>
          </button>

          <button
            id="tab-nav-correlation"
            onClick={() => setCurrentTab('correlation')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'correlation'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <FileBarChart2 className="w-4 h-4 xl:w-5 xl:h-5 text-emerald-600 shrink-0" />
            <span className="whitespace-nowrap">상관관계 리포트</span>
          </button>

          <button
            id="tab-nav-guides"
            onClick={() => setCurrentTab('guides')}
            className={`px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              currentTab === 'guides'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            } ${seniorMode ? 'text-base xl:text-lg px-3.5 py-2.5 font-bold' : ''}`}
          >
            <BookOpen className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
            <span className="whitespace-nowrap">당뇨 정보·홈트</span>
          </button>
        </nav>

        {/* Action buttons on the right */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Record CTA */}
          <div className="relative group shrink-0">
            <button
              id="quick-add-btn"
              onClick={() => openQuickAdd('glucose')}
              className={`inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                seniorMode ? 'px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg' : 'px-3.5 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base'
              }`}
            >
              <Sparkles className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
              <span className="whitespace-nowrap">+ 기록하기</span>
            </button>
          </div>

          {/* Share Report */}
          <button
            id="share-report-top-btn"
            onClick={() => setIsShareOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="가족/주치의와 리포트 공유"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Login History / Security */}
          <button
            id="login-history-top-btn"
            onClick={() => setIsLoginHistoryOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="로그인 이력 및 보안 센터"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </button>

          {/* Notification Drawer Button */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              title="알림 센터"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800 text-sm">알림 센터</span>
                    {unreadCount > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount}개 안읽음
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifMenu(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      도착한 알림이 없습니다.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-xs text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500">
                    💡 식후 2시간 혈당 측정 및 약 복용 알림이 자동 생성됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2.5 px-1">
        <button
          id="mob-nav-dashboard"
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
            currentTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Activity className="w-5 h-5 mb-0.5" />
          <span className="whitespace-nowrap">대시보드</span>
        </button>

        <button
          id="mob-nav-glucose"
          onClick={() => setCurrentTab('glucose')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
            currentTab === 'glucose' ? 'text-rose-600 font-bold' : 'text-slate-600'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[11px] text-white font-bold mb-0.5">
            mg
          </span>
          <span className="whitespace-nowrap">혈당</span>
        </button>

        <button
          id="mob-nav-meals"
          onClick={() => setCurrentTab('meals')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
            currentTab === 'meals' ? 'text-amber-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Utensils className="w-5 h-5 mb-0.5" />
          <span className="whitespace-nowrap">식단</span>
        </button>

        <button
          id="mob-nav-exercise"
          onClick={() => setCurrentTab('exercise')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
            currentTab === 'exercise' ? 'text-amber-700 font-bold' : 'text-slate-600'
          }`}
        >
          <Footprints className="w-5 h-5 mb-0.5" />
          <span className="whitespace-nowrap">운동</span>
        </button>

        <button
          id="mob-nav-correlation"
          onClick={() => setCurrentTab('correlation')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
            currentTab === 'correlation' ? 'text-purple-600 font-bold' : 'text-slate-600'
          }`}
        >
          <FileBarChart2 className="w-5 h-5 mb-0.5" />
          <span className="whitespace-nowrap">리포트</span>
        </button>
      </div>
    </header>
  );
};
