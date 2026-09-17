import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GlucoseManager } from './components/GlucoseManager';
import { MealManager } from './components/MealManager';
import { ExerciseManager } from './components/ExerciseManager';
import { CorrelationReportView } from './components/CorrelationReportView';
import { EducationAndGuides } from './components/EducationAndGuides';
import { QuickAddModal } from './components/QuickAddModal';
import { ShareModal } from './components/ShareModal';
import { LoginHistoryModal } from './components/LoginHistoryModal';
import { Plus, Activity, Utensils, Footprints } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentTab, seniorMode, openQuickAdd } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50/70 transition-all ${
        seniorMode ? 'text-slate-950 text-lg font-medium leading-relaxed' : 'text-slate-800 text-base leading-relaxed'
      }`}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'glucose' && <GlucoseManager />}
        {currentTab === 'meals' && <MealManager />}
        {currentTab === 'exercise' && <ExerciseManager />}
        {currentTab === 'correlation' && <CorrelationReportView />}
        {currentTab === 'guides' && <EducationAndGuides />}
      </main>

      {/* Floating Action Quick Add for Mobile / Easy Access */}
      <div className="fixed bottom-6 right-6 z-30 lg:hidden flex flex-col gap-2">
        <button
          onClick={() => openQuickAdd('glucose')}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer border-2 border-white"
          title="빠른 기록 추가"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modals */}
      <QuickAddModal />
      <ShareModal />
      <LoginHistoryModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-600">
            당당케어 (DangDang Care) · 당뇨 식단 및 운동 통합 혈당 관리 서비스
          </p>
          <p>
            본 서비스는 의학적 진단이나 처방을 대체하지 않으며, 일상적인 혈당 기록 및 건강 생활 습관 유지를 지원합니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
