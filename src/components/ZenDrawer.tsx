import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Scale,
  Train,
  Swords,
  Hash,
  FileCheck2,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';
import { ActiveTab, CurriculumModuleMeta, ThemeMode, WhyStudyNode } from '../types/criminal';

interface ZenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  modulesMeta: CurriculumModuleMeta[];
  allNodes: WhyStudyNode[];
  currentNodeId: string;
  onSelectNode: (nodeId: string) => void;
  wrongNoteCount: number;
  themeMode: ThemeMode;
  onOpenInstallModal: () => void;
}

export const ZenDrawer: React.FC<ZenDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  modulesMeta,
  allNodes,
  currentNodeId,
  onSelectNode,
  wrongNoteCount,
  themeMode,
  onOpenInstallModal,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string>('module1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allNodes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.subtitle.toLowerCase().includes(q) ||
        n.analogyStory.oneSecTranslation.toLowerCase().includes(q) ||
        n.whyPrinciple.corePhilosophy.toLowerCase().includes(q) ||
        n.statuteAndCases.some((sc) => sc.title.toLowerCase().includes(q) || sc.keyTakeaway.toLowerCase().includes(q))
    );
  }, [allNodes, searchQuery]);

  if (!isOpen) return null;

  const isDark = themeMode === 'night';

  const navTabs: { id: ActiveTab; label: string; sub: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'study',
      label: '1. 단원별 왜(Why) 마스터',
      sub: '56개 단원 4단계 몰입형 카드',
      icon: <BookOpen className="w-5 h-5 text-[#C53D33] dark:text-[#E05347]" />,
    },
    {
      id: 'simulator',
      label: '2. 내가 대법관이다!',
      sub: '사건 판결 시뮬레이터 30선',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'subway',
      label: '3. 형사소송 노선도',
      sub: '1~9호선 전 절차 흐름도',
      icon: <Train className="w-5 h-5" />,
    },
    {
      id: 'vs',
      label: '4. VS 배틀 도감',
      sub: '헷갈리는 쌍둥이 개념 40대 비교',
      icon: <Swords className="w-5 h-5" />,
    },
    {
      id: 'numbers',
      label: '5. 숫자·기한 사전',
      sub: '1초 필터 & 이유 플래시카드',
      icon: <Hash className="w-5 h-5" />,
    },
    {
      id: 'exam',
      label: '6. 40문항 모의 & 처방전',
      sub: '2026기출 + 실전3회 150문항',
      icon: <FileCheck2 className="w-5 h-5" />,
      badge: wrongNoteCount > 0 ? wrongNoteCount : undefined,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* 바깥 영역 터치 시 닫기 */}
      <div className="flex-1" onClick={onClose} />

      {/* 서랍 본체 */}
      <div
        className={`w-full max-w-sm sm:max-w-md h-full flex flex-col justify-between shadow-2xl transition-all ${
          isDark
            ? 'bg-[#181818] border-l border-white/10 text-[#EDEAE3]'
            : 'bg-[#FAF7F2] border-l border-black/10 text-[#181818]'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* 서랍 헤더 */}
        <div className="p-5 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="hanko-seal w-9 h-9 text-xs font-black">
              刑訴
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight leading-tight">형소법 2027</h2>
              <p className="text-[11px] opacity-60">2027. 02. 05. 법령 기준일 엄수</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 서랍 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 6대 인터랙티브 학습 모드 */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black tracking-wider uppercase opacity-50 px-2 mb-2">
              학습 모드 선택
            </div>
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                    isActive
                      ? 'bg-[#C53D33] text-white border-[#C53D33] shadow-md font-black'
                      : 'border-current/5 hover:border-current/15 hover:bg-current/5 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : ''}>{tab.icon}</span>
                    <div>
                      <div className="text-sm">{tab.label}</div>
                      <div className={`text-[11px] ${isActive ? 'text-white/80' : 'opacity-60'}`}>
                        {tab.sub}
                      </div>
                    </div>
                  </div>
                  {tab.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 7대 모듈 및 56개 단원 목차 */}
          <div className="space-y-3 pt-3 border-t border-current/10">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-black tracking-wider uppercase opacity-50">
                단원 바로가기 (총 56개 단원)
              </span>
              <span className="text-[10px] font-mono opacity-50">56 Nodes</span>
            </div>

            {/* 실시간 단원 키워드 검색창 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="단원명, 판례, 조문 키워드 검색..."
                className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#C53D33] ${
                  isDark
                    ? 'bg-[#121212] border-white/10 text-white placeholder-white/30'
                    : 'bg-white border-black/10 text-black placeholder-black/40'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 opacity-50 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 검색 결과가 있을 때 */}
            {searchQuery.trim() !== '' && (
              <div className="space-y-1 p-2 rounded-xl border border-current/10 bg-current/5 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-bold opacity-60 px-1 mb-1">
                  검색 결과 {filteredNodes.length}건
                </div>
                {filteredNodes.length === 0 ? (
                  <div className="text-xs opacity-50 py-3 text-center">일치하는 단원이 없습니다.</div>
                ) : (
                  filteredNodes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setActiveTab('study');
                        onSelectNode(n.id);
                        onClose();
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs font-bold hover:bg-[#C53D33] hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{n.title}</span>
                      <span className="text-[10px] opacity-70 shrink-0">{n.partLabel}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 검색어가 없을 때는 기존 7대 모듈 아코디언 표시 */}
            {searchQuery.trim() === '' &&
              modulesMeta.map((mod) => {
              const isExpanded = expandedModuleId === mod.id;
              const moduleNodes = allNodes.filter((n) => n.moduleId === mod.id);

              return (
                <div key={mod.id} className="rounded-xl border border-current/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedModuleId(isExpanded ? '' : mod.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-current/5 transition-colors font-bold text-xs"
                  >
                    <div>
                      <span className="font-mono text-[#C53D33] dark:text-[#E05347] mr-1.5 font-black">
                        M{mod.moduleNumber}
                      </span>
                      <span>{mod.shortTitle}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-current/5 border-t border-current/10">
                      {moduleNodes.map((n, idx) => {
                        const isCurrent = currentNodeId === n.id && activeTab === 'study';
                        return (
                          <button
                            key={n.id}
                            onClick={() => {
                              setActiveTab('study');
                              onSelectNode(n.id);
                              onClose();
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                              isCurrent
                                ? 'bg-[#C53D33] text-white font-black'
                                : 'hover:bg-current/10 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <span className="truncate pr-2">
                              {idx + 1}. {n.title}
                            </span>
                            <span className="text-[10px] opacity-60 shrink-0 font-mono">
                              {n.importance}급
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 서랍 하단: 스마트폰 앱 설치(PWA) 바로가기 */}
        <div className="p-4 border-t border-current/10">
          <button
            onClick={() => {
              onClose();
              onOpenInstallModal();
            }}
            className="w-full py-3 rounded-2xl bg-current/5 hover:bg-current/10 border border-current/15 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-[#C53D33] dark:text-[#E05347]" />
            <span>스마트폰 홈 화면에 앱(PWA) 설치</span>
          </button>
        </div>
      </div>
    </div>
  );
};
