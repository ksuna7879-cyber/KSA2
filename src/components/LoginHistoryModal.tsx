import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoginProvider, LoginHistoryRecord } from '../types';
import {
  ShieldCheck,
  X,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  KeyRound,
  ShieldAlert,
  Laptop,
  Radio,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginHistoryModal: React.FC = () => {
  const {
    isLoginHistoryOpen,
    setIsLoginHistoryOpen,
    loginHistory,
    isLoggedIn,
    currentProvider,
    login,
    logout,
    terminateOtherSessions,
    deleteLoginRecord,
    userProfile,
    seniorMode,
  } = useApp();

  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'history' | 'security'>('history');
  const [securityAlertsEnabled, setSecurityAlertsEnabled] = useState(true);

  if (!isLoginHistoryOpen) return null;

  const filteredHistory = loginHistory.filter((item) => {
    if (filterProvider === 'all') return true;
    return item.provider === filterProvider;
  });

  const getProviderInfo = (provider: LoginProvider) => {
    switch (provider) {
      case 'kakao':
        return {
          name: '카카오톡',
          bg: 'bg-[#FEE500]',
          text: 'text-[#191919]',
          border: 'border-yellow-400',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        };
      case 'naver':
        return {
          name: '네이버',
          bg: 'bg-[#03C75A]',
          text: 'text-white',
          border: 'border-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'google':
        return {
          name: '구글',
          bg: 'bg-white',
          text: 'text-slate-800',
          border: 'border-slate-300',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'email':
      default:
        return {
          name: '이메일 계정',
          bg: 'bg-slate-800',
          text: 'text-white',
          border: 'border-slate-700',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const handleSwitchLogin = (prov: LoginProvider) => {
    login(prov);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const currentDeviceRecord = loginHistory.find((h) => h.isCurrentDevice) || loginHistory[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-black text-slate-900 ${seniorMode ? 'text-2xl' : 'text-lg'}`}>
                  로그인 기록 & 보안 센터
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  보안 정상
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                내 계정의 최근 로그인 이력, 접속 기기, IP 위치를 실시간으로 확인하고 관리합니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginHistoryOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-200 px-5 pt-3 bg-white text-xs sm:text-sm font-semibold gap-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>로그인 이력 목록 ({loginHistory.length}건)</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>소셜 계정 연결 & 보안 설정</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Active Device Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-yellow-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-2xs text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {currentDeviceRecord ? currentDeviceRecord.deviceName : 'Chrome / Windows 11'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-2xs">
                    현재 기기
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span>IP: {currentDeviceRecord?.ipAddress || '211.234.52.18'}</span>
                  <span>위치: {currentDeviceRecord?.location || '대한민국 서울특별시'}</span>
                  <span>인증: {getProviderInfo(currentProvider).name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={terminateOtherSessions}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                title="현재 기기 외 모든 세션 강제 종료"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>다른 기기 일괄 로그아웃</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Detailed Login History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500">
                  최근 30일간의 로그인 활동 기록
                </span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {['all', 'kakao', 'naver', 'google'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterProvider(p)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        filterProvider === p
                          ? 'bg-white text-slate-900 shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {p === 'all' ? '전체' : p === 'kakao' ? '카카오' : p === 'naver' ? '네이버' : '구글'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Table / Cards */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="p-3 pl-4">로그인 일시</th>
                      <th className="p-3">수단</th>
                      <th className="p-3">접속 기기 및 브라우저</th>
                      <th className="p-3">IP 주소 및 추정 위치</th>
                      <th className="p-3">상태</th>
                      <th className="p-3 text-right pr-4">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item) => {
                      const pInfo = getProviderInfo(item.provider);
                      const d = new Date(item.timestamp);
                      const dateFormatted = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            item.isCurrentDevice ? 'bg-amber-50/60' : ''
                          }`}
                        >
                          <td className="p-3 pl-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                            {dateFormatted}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${pInfo.badge}`}>
                              {pInfo.name}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {item.deviceName.includes('iPhone') || item.deviceName.includes('Galaxy') ? (
                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>{item.deviceName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">
                            <div className="font-mono text-[11px]">{item.ipAddress}</div>
                            <div className="text-[10px] text-slate-400">{item.location}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {item.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>정상 로그인</span>
                              </span>
                            ) : item.status === 'blocked' ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                                <span>차단/종료됨</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                <span>의심 감지</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right pr-4 whitespace-nowrap">
                            {!item.isCurrentDevice && (
                              <button
                                onClick={() => deleteLoginRecord(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                                title="이력 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>
                  💡 본인이 접속하지 않은 낯선 기기나 의심스러운 IP가 있을 경우 즉시 <strong>'다른 기기 일괄 로그아웃'</strong>을 실행하세요.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: Social Login Simulation & Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">
                  소셜 간편 로그인 테스트 & 계정 연동
                </h4>
                <p className="text-xs text-slate-500">
                  원클릭으로 로그인 방식을 전환하고 새로운 로그인 기록 생성을 실시간으로 테스트할 수 있습니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Kakao */}
                  <button
                    onClick={() => handleSwitchLogin('kakao')}
                    className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      currentProvider === 'kakao'
                        ? 'border-yellow-500 bg-yellow-50/60 ring-2 ring-yellow-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#FEE500] text-slate-900 flex items-center justify-center font-bold text-xs">
                        K
                      </span>
                      <div className="text-left">
                        <span className="block text-slate-900 font-bold">카카오 간편 로그인</span>
                        <span className="text-[10px] text-slate-500">
                          {currentProvider === 'kakao' ? '현재 접속 중' : '클릭 시 카카오 로그인'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Naver */}
                  <button
                    onClick={() => handleSwitchLogin('naver')}
                    className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      currentProvider === 'naver'
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#03C75A] text-white flex items-center justify-center font-bold text-xs">
                        N
                      </span>
                      <div className="text-left">
                        <span className="block text-slate-900 font-bold">네이버 간편 로그인</span>
                        <span className="text-[10px] text-slate-500">
                          {currentProvider === 'naver' ? '현재 접속 중' : '클릭 시 네이버 로그인'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Google */}
                  <button
                    onClick={() => handleSwitchLogin('google')}
                    className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      currentProvider === 'google'
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs">
                        G
                      </span>
                      <div className="text-left">
                        <span className="block text-slate-900 font-bold">구글 간편 로그인</span>
                        <span className="text-[10px] text-slate-500">
                          {currentProvider === 'google' ? '현재 접속 중' : '클릭 시 구글 로그인'}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security Preferences */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <span>계정 보안 환경 설정</span>
                </h4>

                <div className="flex items-center justify-between py-2 border-b border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">새로운 환경 로그인 알림</span>
                    <span className="text-slate-500">낯선 브라우저나 새로운 스마트폰에서 접속 시 즉시 알림</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityAlertsEnabled}
                    onChange={(e) => setSecurityAlertsEnabled(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">2단계 추가 본인 인증 (2FA)</span>
                    <span className="text-slate-500">로그인 시 등록된 휴대폰 SMS 또는 카카오 인증톡 확인</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    보호 중 (설정됨)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            사용자 ID: {userProfile.name} (ksuna7879@gmail.com)
          </span>
          <button
            onClick={() => setIsLoginHistoryOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
