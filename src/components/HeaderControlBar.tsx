import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Train,
  Swords,
  Hash,
  FileCheck2,
  Sun,
  BookMarked,
  Moon,
  Search,
  BookmarkCheck,
  Sparkles,
  X,
  Smartphone,
  SlidersHorizontal,
} from 'lucide-react';
import { ActiveTab, FontScale, ThemeMode } from '../types/criminal';
import { MobileSettingsDrawer } from './MobileSettingsDrawer';

interface HeaderControlBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bookmarkCount: number;
  wrongNoteCount: number;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (v: boolean) => void;
  onOpenInstallModal: () => void;
}

export const HeaderControlBar: React.FC<HeaderControlBarProps> = ({
  activeTab,
  setActiveTab,
  fontScale,
  setFontScale,
  themeMode,
  setThemeMode,
  searchQuery,
  setSearchQuery,
  bookmarkCount,
  wrongNoteCount,
  showBookmarksOnly,
  setShowBookmarksOnly,
  onOpenInstallModal,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const navItems: { id: ActiveTab; label: string; subLabel: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'study',
      label: '1. 단원별 왜(Why) 마스터',
      subLabel: '제1~5편 4단계 카드',
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'simulator',
      label: '2. 내가 대법관이다!',
      subLabel: '판결 시뮬레이터 30선',
      icon: <Scale className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'subway',
      label: '3. 형사소송 노선도',
      subLabel: '1~9호선 흐름도',
      icon: <Train className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'vs',
      label: '4. VS 배틀 도감',
      subLabel: '쌍둥이 개념 40대 비교',
      icon: <Swords className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'numbers',
      label: '5. 숫자·기한 사전',
      subLabel: '1초 필터 & 플래시',
      icon: <Hash className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'exam',
      label: '6. 40문항 모의 & 처방전',
      subLabel: '실전 모의 150문항',
      icon: <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: wrongNoteCount > 0 ? wrongNoteCount : undefined,
    },
  ];

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          isNight
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-lg'
            : isEbook
            ? 'bg-[#f4ebd8]/95 border-[#d8cbbb] text-[#1e1b18] shadow-sm'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
        } backdrop-blur-md`}
      >
        {/* 모바일 상단 바 (md 미만 전용) */}
        <div className="md:hidden px-3.5 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow">
              형소
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight">형소법 2027</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white">
                  2027.2.5. 기준
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={`p-2 rounded-xl transition-colors ${
                mobileSearchOpen || searchQuery
                  ? 'bg-blue-600 text-white shadow'
                  : isNight
                  ? 'bg-slate-800 text-slate-300'
                  : isEbook
                  ? 'bg-[#ebe1c8] text-slate-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
              title="검색"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isNight
                  ? 'bg-slate-800 text-slate-300'
                  : isEbook
                  ? 'bg-[#ebe1c8] text-slate-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
              title="글자크기 및 테마 설정"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Aa</span>
            </button>

            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-transform"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>앱 설치</span>
            </button>
          </div>
        </div>

        {/* 모바일 검색창 확장 영역 */}
        {mobileSearchOpen && (
          <div
            className={`md:hidden px-3.5 pb-3 pt-1 border-t flex flex-col gap-2 ${
              isNight ? 'border-slate-800 bg-slate-950/60' : isEbook ? 'border-[#dfd3b8] bg-[#efe5ce]/70' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="키워드, 조문, 판례 검색..."
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isNight
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                    : isEbook
                    ? 'bg-[#fdfaf2] border-[#dacbb5] text-[#1e1b18] placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-500'
                  : isNight
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : isEbook
                  ? 'bg-[#ebe1c8] border-[#dacbb5] text-slate-800'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                <span>북마크한 취약 원리만 모아보기</span>
              </div>
              <span className="font-extrabold">{bookmarkCount}개</span>
            </button>
          </div>
        )}

        {/* 데스크톱/태블릿 상단 바 (md 이상 전용) */}
        <div className="hidden md:block">
          {/* 상단 1단: 타이틀 + 2027.02.05 법령기준일 배지 + 글자크기 + 3대 테마 + 앱설치 */}
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md">
                형소
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-lg lg:text-xl tracking-tight">
                    2027 교정직 6급(교감) 승진 · 형사소송법 왜(Why) 큰글씨 마스터
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    2027. 02. 05. 기준 엄수
                  </span>
                </div>
                <p className={`text-xs font-medium ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                  제312조제3항 내용인정 일원화(2026.10.2.) · 재정신청 지법합의부(2027.2.5.) 반영 | 판례 75% + 조문·규칙 25%
                </p>
              </div>
            </div>

            {/* 가독성 컨트롤: 글자 크기 + 테마 + 앱설치 버튼 */}
            <div className="flex items-center gap-2">
              {/* 글자 크기 조절 */}
              <div
                className={`flex items-center rounded-xl p-1 border ${
                  isNight ? 'bg-slate-800 border-slate-700' : isEbook ? 'bg-[#ebe1c8] border-[#cbbba0]' : 'bg-slate-100 border-slate-300'
                }`}
                role="group"
                aria-label="글자 크기 조절"
              >
                {(
                  [
                    { key: 'sm', label: '18px' },
                    { key: 'base', label: '큰글씨 20px' },
                    { key: 'lg', label: '특대 24px' },
                    { key: 'xl', label: '초특대 28px' },
                  ] as { key: FontScale; label: string }[]
                ).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFontScale(item.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all ${
                      fontScale === item.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isNight
                        ? 'text-slate-300 hover:bg-slate-700'
                        : 'text-slate-700 hover:bg-white/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* 3가지 눈 보호 테마 */}
              <div
                className={`flex items-center rounded-xl p-1 border ${
                  isNight ? 'bg-slate-800 border-slate-700' : isEbook ? 'bg-[#ebe1c8] border-[#cbbba0]' : 'bg-slate-100 border-slate-300'
                }`}
                role="group"
                aria-label="화면 테마 선택"
              >
                <button
                  onClick={() => setThemeMode('paper')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    themeMode === 'paper' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'opacity-70 hover:opacity-100'
                  }`}
                  title="종이책 라이트 모드"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>종이책</span>
                </button>
                <button
                  onClick={() => setThemeMode('ebook')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    themeMode === 'ebook'
                      ? 'bg-[#fdfaf2] text-[#1e1b18] shadow-sm font-extrabold border border-[#d6cbb5]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title="미색 이북 모드"
                >
                  <BookMarked className="w-3.5 h-3.5 text-amber-700" />
                  <span>미색이북</span>
                </button>
                <button
                  onClick={() => setThemeMode('night')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    themeMode === 'night' ? 'bg-indigo-600 text-white shadow-sm font-extrabold' : 'opacity-70 hover:opacity-100'
                  }`}
                  title="야간 당직 다크 모드"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>야간당직</span>
                </button>
              </div>

              {/* 스마트폰 앱 설치 버튼 */}
              <button
                onClick={onOpenInstallModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
                title="스마트폰에 앱으로 설치하기"
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 폰에 앱 설치</span>
              </button>
            </div>
          </div>

          {/* 상단 2단: 6대 탭 + 실시간 검색 + 북마크 */}
          <div
            className={`border-t ${
              isNight ? 'border-slate-800 bg-slate-950/60' : isEbook ? 'border-[#dfd3b8] bg-[#efe5ce]/70' : 'border-slate-200 bg-slate-50/90'
            }`}
          >
            <div className="max-w-[1600px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
              <nav className="flex flex-wrap items-center gap-1.5">
                {navItems.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs lg:text-sm transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-md'
                          : isNight
                          ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          : isEbook
                          ? 'bg-[#fdfaf2] text-[#2b2620] hover:bg-white border border-[#d6cbb5]'
                          : 'bg-white text-slate-800 hover:bg-blue-50 border border-slate-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <div className="relative w-64 lg:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="조문, 판례, 개념 통합 검색..."
                    className={`w-full pl-9 pr-8 py-1.5 rounded-xl text-xs lg:text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isNight
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                        : isEbook
                        ? 'bg-[#fdfaf2] border-[#dacbb5] text-[#1e1b18] placeholder-slate-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                    showBookmarksOnly
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : isNight
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : isEbook
                      ? 'bg-[#fdfaf2] border-[#dacbb5] text-slate-800 hover:bg-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="북마크된 취약원리 필터"
                >
                  <BookmarkCheck className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'text-white' : 'text-amber-500'}`} />
                  <span>취약원리 {bookmarkCount > 0 ? `(${bookmarkCount})` : ''}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 보기 설정 드로어 */}
      <MobileSettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontScale={fontScale}
        setFontScale={setFontScale}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
    </>
  );
};
