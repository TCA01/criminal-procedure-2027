import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bookmark,
  BookmarkCheck,
  Type,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, FontScale, ThemeMode, WhyStudyNode } from '../types/criminal';

interface ZenHeaderProps {
  currentNode?: WhyStudyNode;
  currentStepIndex: number; // 0: 상황극, 1: 왜원리, 2: 조문판례, 3: OX퀴즈
  totalSteps: number;
  activeTab: ActiveTab;
  onOpenMenu: () => void;
  fontScale: FontScale;
  onChangeFontScale: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ZenHeader: React.FC<ZenHeaderProps> = ({
  currentNode,
  currentStepIndex,
  totalSteps,
  activeTab,
  onOpenMenu,
  fontScale,
  onChangeFontScale,
  themeMode,
  onToggleTheme,
  isBookmarked,
  onToggleBookmark,
}) => {
  const isDark = themeMode === 'night';

  const stepLabels = ['1초 상황극', '왜(Why) 저울', '조문·판례', '실전 OX'];

  const tabTitleMap: Record<ActiveTab, string> = {
    study: currentNode ? `${currentNode.partLabel} · ${currentNode.title}` : '단원별 왜(Why) 마스터',
    simulator: '내가 대법관이다! 판결 시뮬레이터',
    subway: '형사소송 1~9호선 절차 노선도',
    vs: 'VS 일대일 배틀 도감 40선',
    numbers: '숫자·기한·주체 1초 사전',
    exam: '40문항 실전 모의고사 & 처방전',
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-colors border-b ${
        isDark
          ? 'bg-[#121212]/95 border-white/10 text-[#EDEAE3]'
          : 'bg-[#FAF7F2]/95 border-black/5 text-[#181818]'
      } backdrop-blur-md`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* 좌측: 붉은 낙관 도장 버튼 (메뉴 열기) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMenu}
            className="group flex items-center gap-2 p-1 rounded-xl transition-transform active:scale-95"
            title="전체 메뉴 및 단원 목차"
          >
            <div className="hanko-seal w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
              刑訴
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold opacity-60 tracking-tight leading-none">2027 교정직 6급</div>
              <div className="text-xs font-black tracking-tight mt-0.5">형사소송법</div>
            </div>
          </button>
        </div>

        {/* 중앙: 현재 단원명 & 단계 (선택된 단원 단일 집중) */}
        <div className="flex-1 text-center min-w-0 px-2">
          {activeTab === 'study' && currentNode ? (
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold opacity-60 truncate">
                <span>{currentNode.partLabel}</span>
                <span>·</span>
                <span className="text-[#C53D33] dark:text-[#E05347] font-black">
                  {stepLabels[currentStepIndex] || `단계 ${currentStepIndex + 1}`} ({currentStepIndex + 1}/{totalSteps})
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black truncate tracking-tight">
                {currentNode.title}
              </h1>
            </div>
          ) : (
            <h1 className="text-sm sm:text-base font-black truncate tracking-tight">
              {tabTitleMap[activeTab]}
            </h1>
          )}
        </div>

        {/* 우측 미니멀 컨트롤: 글자크기(Aa), 테마(해/달), 북마크 */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {activeTab === 'study' && (
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition-all ${
                isBookmarked
                  ? 'text-[#C53D33] dark:text-[#E05347]'
                  : 'opacity-50 hover:opacity-100'
              }`}
              title={isBookmarked ? '취약원리 북마크 해제' : '취약원리 북마크 저장'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={onChangeFontScale}
            className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl border border-current/15 text-xs font-black opacity-80 hover:opacity-100 transition-opacity"
            title={`글자 크기 변경 (현재: ${fontScale})`}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="uppercase text-[11px]">{fontScale}</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl opacity-75 hover:opacity-100 transition-opacity"
            title={isDark ? '화지(Washi) 라이트 모드' : '수묵(Sumi) 다크 모드'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
