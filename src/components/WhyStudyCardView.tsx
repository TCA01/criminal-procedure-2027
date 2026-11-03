import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Scale,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Bookmark,
  BookmarkCheck,
  AlertOctagon,
  Sparkles,
  Lightbulb,
  HelpCircle,
  Layers,
  Languages,
} from 'lucide-react';
import {
  CurriculumModuleMeta,
  GoldenPrinciple,
  LegalTermTranslation,
  ThemeMode,
  WhyStudyNode,
} from '../types/criminal';

interface WhyStudyCardViewProps {
  modulesMeta: CurriculumModuleMeta[];
  selectedModuleId: string;
  setSelectedModuleId: (id: string) => void;
  nodes: WhyStudyNode[];
  goldenPrinciples: GoldenPrinciple[];
  legalTerms: LegalTermTranslation[];
  themeMode: ThemeMode;
  bookmarkedNodeIds: string[];
  toggleBookmarkNode: (id: string) => void;
  searchQuery: string;
}

export const WhyStudyCardView: React.FC<WhyStudyCardViewProps> = ({
  modulesMeta,
  selectedModuleId,
  setSelectedModuleId,
  nodes,
  goldenPrinciples,
  legalTerms,
  themeMode,
  bookmarkedNodeIds,
  toggleBookmarkNode,
  searchQuery,
}) => {
  // 김옥현 법령풀이집 인터랙티브 토글 상태
  const [blankMode, setBlankMode] = useState<boolean>(false);
  const [showTraps, setShowTraps] = useState<boolean>(true);
  const [revealedKeywords, setRevealedKeywords] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, 'O' | 'X'>>({});
  const [termCategoryFilter, setTermCategoryFilter] = useState<string>('전체');
  const [showTermDictionary, setShowTermDictionary] = useState<boolean>(true);

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const toggleKeywordReveal = (key: string) => {
    setRevealedKeywords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetBlankReveals = () => {
    setRevealedKeywords({});
  };

  const cardBg = isNight
    ? 'bg-slate-900 border-slate-700 text-slate-100'
    : isEbook
    ? 'bg-[#fdfaf2] border-[#d6cbb5] text-[#1e1b18]'
    : 'bg-white border-slate-200 text-slate-900';

  const subtleBg = isNight
    ? 'bg-slate-800/80 border-slate-700'
    : isEbook
    ? 'bg-[#f3ead6] border-[#d6cbb5]'
    : 'bg-slate-50 border-slate-200';

  const termCategories = [
    '전체',
    '총칙·주체',
    '소송행위·치유',
    '수사·강제처분',
    '공소·공판',
    '증거법',
    '재판·상소·집행',
  ];

  const filteredTerms = legalTerms.filter((t) => {
    const matchesCat = termCategoryFilter === '전체' || t.category === termCategoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.term.toLowerCase().includes(q) ||
      t.oneSecTranslation.toLowerCase().includes(q) ||
      t.everydayAnalogy.toLowerCase().includes(q) ||
      t.examTrapPoint.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-8">
      {/* 1. 7대 학습 모듈 선택 탭 & 김옥현 인터랙티브 컨트롤 바 */}
      <div className={`p-5 rounded-3xl border shadow-sm space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              김옥현 법령풀이집 × 4단계 왜(Why) 이해 엔진
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              단원별 왜(Why) 그런지 이해하는 큰글씨 마스터
            </h2>
          </div>

          {/* 김옥현 인라인 컨트롤 스위치: 빈칸(빵꾸) 모드 & 오답함정 보이기/숨기기 */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setBlankMode(!blankMode);
                if (blankMode) resetBlankReveals();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all shadow-sm ${
                blankMode
                  ? 'bg-blue-600 text-white border-blue-700 ring-4 ring-blue-400/30'
                  : isNight
                  ? 'bg-slate-800 border-blue-500/60 text-blue-300 hover:bg-slate-700'
                  : 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100'
              }`}
            >
              {blankMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span>
                {blankMode ? '🕳️ 핵심어 빈칸(빵꾸) 모드 켜짐 (클릭해 확인)' : '🕳️ 핵심어 빈칸(빵꾸) 모드 켜기'}
              </span>
            </button>

            <button
              onClick={() => setShowTraps(!showTraps)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-sm sm:text-base border-2 transition-all shadow-sm ${
                showTraps
                  ? 'bg-rose-600 text-white border-rose-700'
                  : isNight
                  ? 'bg-slate-800 border-rose-500/60 text-rose-300 hover:bg-slate-700'
                  : 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100'
              }`}
            >
              <AlertOctagon className="w-5 h-5" />
              <span>{showTraps ? '🚨 출제자 오답함정(.trap) 표시 중' : '🚨 출제자 오답함정(.trap) 숨김'}</span>
            </button>
          </div>
        </div>

        {/* 모듈 선택 그리드 / 모바일 가로 스크롤 */}
        <div className="flex overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 pt-2 scrollbar-none">
          {modulesMeta.map((m) => {
            const active = selectedModuleId === m.id && !searchQuery.trim();
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`min-w-[220px] sm:min-w-0 shrink-0 sm:shrink text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  active
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.01]'
                    : isNight
                    ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-blue-500'
                    : isEbook
                    ? 'bg-[#f6efe0] border-[#d3c5a8] text-[#1e1b18] hover:border-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-500 hover:bg-blue-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        active ? 'bg-white/20 text-white' : 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      MODULE {m.moduleNumber}
                    </span>
                    <span className={`text-xs font-bold ${active ? 'text-blue-100' : 'opacity-70'}`}>
                      {m.articleRange}
                    </span>
                  </div>
                  <div className="font-extrabold text-base leading-snug">{m.shortTitle}</div>
                </div>
                <div className={`text-xs mt-2 font-semibold ${active ? 'text-blue-100' : 'opacity-75'}`}>
                  {m.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module 1 선택 시: 5대 황금원리 배너 + 초보자용 법률 한자어 40선 1초 번역기 사전 */}
      {(selectedModuleId === 'module1' || searchQuery.trim() !== '') && (
        <section className={`p-6 rounded-3xl border shadow-sm space-y-6 ${cardBg}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-current/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-sm">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">
                  초보자용 법률 한자어·외계어 40선 『1초 일상어 번역기 & 비유 사전』
                </h3>
                <p className="text-sm opacity-80 font-medium">
                  낯선 일본식 한자 법률용어 때문에 막히셨나요? 먼저 일상 언어로 1초 번역하고 시험 함정까지 한눈에 잡으세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTermDictionary(!showTermDictionary)}
              className="px-4 py-2 rounded-xl font-extrabold text-sm bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
            >
              {showTermDictionary ? '사전 접기 ▲' : `법률 한자어 40선 펼치기 (${filteredTerms.length}개) ▼`}
            </button>
          </div>

          {showTermDictionary && (
            <>
              {/* 5대 황금원리 요약 카드 (Module 1 전용) */}
              {!searchQuery.trim() && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {goldenPrinciples.map((gp) => (
                    <div
                      key={gp.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between ${
                        isNight
                          ? 'bg-indigo-950/40 border-indigo-700/60'
                          : 'bg-gradient-to-b from-indigo-50/90 to-white border-indigo-200'
                      }`}
                    >
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white mb-2">
                          황금원리 {gp.number}
                        </span>
                        <h4 className="font-black text-lg leading-snug mb-1.5">{gp.title}</h4>
                        <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                          “{gp.oneLineCore}”
                        </p>
                        <p className="text-sm opacity-85 leading-relaxed">{gp.judgeMindset}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-indigo-500/20 flex flex-wrap gap-1">
                        {gp.connectedTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 카테고리 필터 */}
              <div className="flex flex-wrap items-center gap-2">
                {termCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTermCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-extrabold transition-all ${
                      termCategoryFilter === cat
                        ? 'bg-amber-600 text-white shadow-sm'
                        : `${subtleBg} border hover:border-amber-500`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 40선 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.map((term, idx) => (
                  <div
                    key={term.id}
                    className={`p-5 rounded-2xl border-2 transition-all space-y-2.5 ${subtleBg}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 mr-2">
                          #{idx + 1} · {term.category}
                        </span>
                        {term.relatedArticle && (
                          <span className="text-xs font-bold opacity-75">{term.relatedArticle}</span>
                        )}
                        <h4 className="text-xl font-black mt-1">
                          {term.term}{' '}
                          <span className="text-sm font-semibold opacity-70">({term.hanjaOrOrigin})</span>
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/25">
                      <span className="text-xs font-black text-blue-700 dark:text-blue-300 block mb-0.5">
                        ⚡ 1초 일상어 번역
                      </span>
                      <p className="font-extrabold text-blue-950 dark:text-blue-100 leading-relaxed">
                        “{term.oneSecTranslation}”
                      </p>
                    </div>

                    <p className="leading-relaxed opacity-95">
                      <strong className="font-extrabold text-emerald-700 dark:text-emerald-400">
                        💬 30초 비유:{' '}
                      </strong>
                      {term.everydayAnalogy}
                    </p>

                    <div className="pt-1">
                      <span className="trap">🚨 출제 함정: {term.examTrapPoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* 2. 단원별 4단계 왜(Why) 이해 카드 리스트 */}
      <div className="space-y-10">
        {nodes.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center space-y-3 ${cardBg}`}>
            <HelpCircle className="w-12 h-12 mx-auto text-blue-500 opacity-80" />
            <h3 className="text-2xl font-black">조건에 맞는 학습 단원이 없습니다.</h3>
            <p className="opacity-75">검색어를 지우거나 북마크 필터를 해제해 보세요.</p>
          </div>
        ) : (
          nodes.map((node, nodeIdx) => {
            const isBookmarked = bookmarkedNodeIds.includes(node.id);
            return (
              <article
                key={node.id}
                id={node.id}
                className={`rounded-3xl border-2 shadow-md overflow-hidden transition-all ${cardBg}`}
              >
                {/* 카드 헤더 */}
                <div
                  className={`p-6 sm:p-8 border-b-2 ${
                    isNight
                      ? 'bg-slate-800/90 border-slate-700'
                      : isEbook
                      ? 'bg-[#f2e8cf] border-[#d6cbb5]'
                      : 'bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-blue-500 text-white">
                        {node.partLabel}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-black ${
                          node.importance === 'S'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        중요도 {node.importance}급 · {node.frequencyBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmarkNode(node.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
                        isBookmarked
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-white/15 hover:bg-white/25 text-current border border-current/20'
                      }`}
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck className="w-5 h-5" />
                          <span>취약원리 북마크됨</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-5 h-5" />
                          <span>북마크 저장</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                    {nodeIdx + 1}. {node.title}
                  </h3>
                  <p className="mt-2 text-base sm:text-lg opacity-90 font-semibold leading-relaxed">
                    {node.subtitle}
                  </p>

                  {/* 2026.10.02 / 2027.02.05 개정 필수 반영 알림 */}
                  {node.amendmentAlert && (
                    <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-100 flex items-start gap-3">
                      <Sparkles className="w-6 h-6 shrink-0 text-emerald-300 mt-0.5" />
                      <div>
                        <strong className="font-black block text-emerald-200">
                          🚨 [2027. 02. 05. 법령 기준일 필수 반영 개정사항]
                        </strong>
                        <p className="font-bold leading-relaxed">{node.amendmentAlert}</p>
                      </div>
                    </div>
                  )}

                  {/* 2027.08.05 / 2027.12.31 시행 예정 시험 범위 제외 참고 알림 */}
                  {node.exclusionAlert && (
                    <div className="mt-3 p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-100 flex items-start gap-3">
                      <AlertOctagon className="w-6 h-6 shrink-0 text-amber-300 mt-0.5" />
                      <div>
                        <strong className="font-black block text-amber-200">
                          ⚠️ [2027년 중순 시험 범위 제외 참고 — 혼동 금지!]
                        </strong>
                        <p className="font-bold leading-relaxed">{node.exclusionAlert}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 카드 본문: 4단계 왜(Why) 구조 */}
                <div className="p-6 sm:p-8 lg:p-10 space-y-10">
                  {/* [1단계: 외계어 1초 번역 & 30초 일상 상황극] */}
                  <section className={`p-6 sm:p-7 rounded-3xl border-2 space-y-4 ${subtleBg}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl text-sm font-black bg-indigo-600 text-white">
                        1단계
                      </span>
                      <MessageSquareQuote className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-xl sm:text-2xl font-black">
                        외계어 1초 번역 & 30초 일상 상황극
                      </h4>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-600/10 border-l-8 border-indigo-600">
                      <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                        ⚡ 한 줄 1초 번역
                      </div>
                      <p className="font-black text-xl sm:text-2xl leading-relaxed">
                        “{node.analogyStory.oneSecTranslation}”
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="text-sm font-extrabold opacity-75">
                        🎬 등장인물: {node.analogyStory.characters}
                      </div>
                      <div className="space-y-2.5">
                        {node.analogyStory.storyDialogue.map((line, i) => (
                          <p
                            key={i}
                            className={`p-3.5 rounded-2xl border leading-relaxed font-medium ${
                              isNight
                                ? 'bg-slate-900/90 border-slate-700'
                                : 'bg-white border-slate-200/90 shadow-sm'
                            }`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <strong className="font-black text-amber-800 dark:text-amber-300">
                          🧠 머릿속에 남길 단 하나의 그림:{' '}
                        </strong>
                        <span className="font-bold">{node.analogyStory.coreMentalPicture}</span>
                      </div>
                    </div>
                  </section>

                  {/* [2단계: 왜(Why) 이건 되고(O), 왜 저건 안 될까(X)? — 판사의 속마음 저울] */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl text-sm font-black bg-emerald-600 text-white">
                        2단계
                      </span>
                      <Scale className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-xl sm:text-2xl font-black">
                        왜(Why) 이건 되고(O), 왜 저건 안 될까(X)? — 대법관의 속마음 저울
                      </h4>
                    </div>

                    <div className={`p-5 rounded-2xl border-2 ${subtleBg}`}>
                      <strong className="font-black text-blue-600 dark:text-blue-400 block mb-1">
                        ⚖️ 대법원의 근본 판단 기준 (Core Philosophy)
                      </strong>
                      <p className="font-bold leading-relaxed">{node.whyPrinciple.corePhilosophy}</p>
                    </div>

                    {/* 좌측 O vs 우측 X 2단 대비 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 좌측: 인정/적법/치유 O */}
                      <div
                        className={`p-6 rounded-3xl border-2 space-y-4 ${
                          isNight
                            ? 'bg-emerald-950/30 border-emerald-700/70'
                            : 'bg-emerald-50/70 border-emerald-300'
                        }`}
                      >
                        <div className="border-b pb-3 border-emerald-500/30">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white mb-1.5">
                            🟢 인정 / 적법 / 치유 O
                          </span>
                          <h5 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                            {node.whyPrinciple.allowSide.title}
                          </h5>
                          <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                            👉 {node.whyPrinciple.allowSide.reasonHeadline}
                          </p>
                        </div>

                        <ul className="space-y-3">
                          {node.whyPrinciple.allowSide.items.map((item, idx) => (
                            <li
                              key={idx}
                              className={`p-4 rounded-2xl border ${
                                isNight
                                  ? 'bg-slate-900/90 border-emerald-800/60'
                                  : 'bg-white border-emerald-200 shadow-sm'
                              }`}
                            >
                              <div className="font-black text-emerald-700 dark:text-emerald-300 mb-1">
                                ✔ {item.caseTitle}
                              </div>
                              <div className="leading-relaxed opacity-95">
                                <span className="font-extrabold">왜냐하면(Why): </span>
                                {item.because}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 우측: 부정/위법/치유 X */}
                      <div
                        className={`p-6 rounded-3xl border-2 space-y-4 ${
                          isNight
                            ? 'bg-rose-950/30 border-rose-700/70'
                            : 'bg-rose-50/70 border-rose-300'
                        }`}
                      >
                        <div className="border-b pb-3 border-rose-500/30">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white mb-1.5">
                            🔴 부정 / 위법 / 치유 X
                          </span>
                          <h5 className="text-xl font-black text-rose-900 dark:text-rose-200">
                            {node.whyPrinciple.denySide.title}
                          </h5>
                          <p className="text-sm font-extrabold text-rose-700 dark:text-rose-300 mt-1">
                            👉 {node.whyPrinciple.denySide.reasonHeadline}
                          </p>
                        </div>

                        <ul className="space-y-3">
                          {node.whyPrinciple.denySide.items.map((item, idx) => (
                            <li
                              key={idx}
                              className={`p-4 rounded-2xl border ${
                                isNight
                                  ? 'bg-slate-900/90 border-rose-800/60'
                                  : 'bg-white border-rose-200 shadow-sm'
                              }`}
                            >
                              <div className="font-black text-rose-700 dark:text-rose-300 mb-1">
                                ✖ {item.caseTitle}
                              </div>
                              <div className="leading-relaxed opacity-95">
                                <span className="font-extrabold">왜냐하면(Why): </span>
                                {item.because}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 시험장 1초 구분 골든팁 */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/15 to-indigo-600/15 border-2 border-blue-500/40">
                      <span className="font-black text-blue-700 dark:text-blue-300 block mb-1">
                        🏆 현직 교정직 수험생을 위한 시험장 1초 컷 공식
                      </span>
                      <p className="font-extrabold leading-relaxed">{node.whyPrinciple.goldenTip}</p>
                    </div>
                  </section>

                  {/* [3단계: 김옥현 법령풀이집 스타일 인라인 조문·판례 뷰어] */}
                  <section className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-xl text-sm font-black bg-blue-600 text-white">
                          3단계
                        </span>
                        <BookOpenCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h4 className="text-xl sm:text-2xl font-black">
                          김옥현 법령풀이집 스타일 인라인 조문·판례 뷰어
                        </h4>
                      </div>
                      <div className="text-xs sm:text-sm font-bold opacity-80">
                        <span className="kw mr-2">파란 밑줄(.kw) = 핵심 키워드/기한</span>
                        <span className="trap">빨간 괄호(.trap) = 출제자 바꿔치기 함정</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {node.statuteAndCases.map((sc) => {
                        const isExcluded = sc.badge === '시험범위제외참고';
                        const isAmended = sc.badge === '2026·2027개정';
                        return (
                          <div
                            key={sc.id}
                            className={`p-6 rounded-3xl border-2 space-y-3 transition-all ${
                              isExcluded
                                ? 'bg-amber-500/10 border-amber-500/50'
                                : isAmended
                                ? 'bg-emerald-500/10 border-emerald-500/50'
                                : subtleBg
                            }`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-black ${
                                  sc.badge === '전원합의체'
                                    ? 'bg-purple-600 text-white'
                                    : sc.badge === '2026·2027개정'
                                    ? 'bg-emerald-600 text-white'
                                    : sc.badge === '시험범위제외참고'
                                    ? 'bg-amber-600 text-white'
                                    : sc.badge === '조문'
                                    ? 'bg-blue-600 text-white'
                                    : sc.badge === '규칙/준칙'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-700 text-white'
                                }`}
                              >
                                {sc.badge}
                              </span>
                              <h5 className="font-black text-lg sm:text-xl">{sc.title}</h5>
                              {sc.caseNumber && (
                                <span className="text-xs sm:text-sm font-bold opacity-75 px-2.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                                  [{sc.caseNumber}]
                                </span>
                              )}
                            </div>

                            {/* 인라인 세그먼트 렌더링 (.kw / .trap / .amended / .excluded) */}
                            <div
                              className={`p-5 rounded-2xl border leading-[2.05] ${
                                isNight
                                  ? 'bg-slate-900 border-slate-700'
                                  : 'bg-white border-slate-200/90 shadow-sm'
                              }`}
                            >
                              {sc.segments.map((seg, sIdx) => {
                                const segKey = `${sc.id}-${sIdx}`;
                                if (seg.type === 'kw') {
                                  const isHidden = blankMode && !revealedKeywords[segKey];
                                  return (
                                    <span
                                      key={segKey}
                                      onClick={() => blankMode && toggleKeywordReveal(segKey)}
                                      className={isHidden ? 'kw-blank' : 'kw cursor-pointer'}
                                      title={
                                        blankMode
                                          ? '클릭하여 빈칸 정답 확인'
                                          : seg.note || '핵심 키워드'
                                      }
                                    >
                                      {seg.text}
                                    </span>
                                  );
                                }
                                if (seg.type === 'trap') {
                                  if (!showTraps) return null;
                                  return (
                                    <span key={segKey} className="trap" title={seg.note || '출제 함정 주의'}>
                                      {seg.text}
                                    </span>
                                  );
                                }
                                if (seg.type === 'amended') {
                                  return (
                                    <span key={segKey} className="amended-badge">
                                      {seg.text}
                                    </span>
                                  );
                                }
                                if (seg.type === 'excluded') {
                                  return (
                                    <span
                                      key={segKey}
                                      className="inline-block px-2 py-0.5 mx-1 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-sm"
                                    >
                                      {seg.text}
                                    </span>
                                  );
                                }
                                return <span key={segKey}>{seg.text}</span>;
                              })}
                            </div>

                            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-blue-700 dark:text-blue-300 pt-1">
                              <span>📌 한 줄 핵심 결론:</span>
                              <span>{sc.keyTakeaway}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* [4단계: 방금 이해한 원리로 1초 만에 푸는 실전 기출 즉석 체커] */}
                  <section className={`p-6 sm:p-7 rounded-3xl border-2 space-y-5 ${subtleBg}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-xl text-sm font-black bg-purple-600 text-white">
                          4단계
                        </span>
                        <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h4 className="text-xl sm:text-2xl font-black">
                          방금 이해한 원리로 1초 만에 푸는 실전 기출 OX 즉석 체커
                        </h4>
                      </div>
                      <span className="text-xs sm:text-sm font-bold opacity-75">
                        O 또는 X 버튼을 눌러 즉시 확인하세요!
                      </span>
                    </div>

                    <div className="space-y-4">
                      {node.instantQuiz.map((q, qIdx) => {
                        const selected = quizAnswers[q.id];
                        const isAnswered = selected !== undefined;
                        const isCorrect = selected === q.answer;

                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                              isNight ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-purple-600/15 text-purple-700 dark:text-purple-300">
                                Q{qIdx + 1} · {q.sourceBadge}
                              </span>
                              {q.highlightTrap && (
                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                                  🎯 함정 포인트: {q.highlightTrap}
                                </span>
                              )}
                            </div>

                            <p className="font-bold leading-relaxed">{q.statement}</p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <button
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: 'O' }))}
                                className={`px-6 py-2.5 rounded-xl font-black text-base transition-all border-2 ${
                                  selected === 'O'
                                    ? q.answer === 'O'
                                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                                      : 'bg-rose-600 text-white border-rose-700 shadow-md'
                                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                                }`}
                              >
                                ⭕ 맞다 (O)
                              </button>
                              <button
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: 'X' }))}
                                className={`px-6 py-2.5 rounded-xl font-black text-base transition-all border-2 ${
                                  selected === 'X'
                                    ? q.answer === 'X'
                                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                                      : 'bg-rose-600 text-white border-rose-700 shadow-md'
                                    : 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20'
                                }`}
                              >
                                ❌ 틀리다 (X)
                              </button>
                            </div>

                            {isAnswered && (
                              <div
                                className={`mt-3 p-4 rounded-2xl border-2 flex items-start gap-3 ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                                    : 'bg-rose-500/10 border-rose-500/40 text-rose-950 dark:text-rose-100'
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600 mt-0.5" />
                                ) : (
                                  <XCircle className="w-6 h-6 shrink-0 text-rose-600 mt-0.5" />
                                )}
                                <div className="space-y-1">
                                  <div className="font-black">
                                    {isCorrect
                                      ? `정답입니다! (정답: ${q.answer})`
                                      : `아쉽습니다! 정답은 [${q.answer}] 입니다.`}
                                  </div>
                                  <p className="leading-relaxed font-medium">{q.whyExplanation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
