import React, { useState } from 'react';
import {
  Gavel,
  Scale,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { SupremeCourtCaseSimulatorItem, ThemeMode } from '../types/criminal';

interface SupremeCourtSimulatorProps {
  cases: SupremeCourtCaseSimulatorItem[];
  themeMode: ThemeMode;
  searchQuery: string;
}

export const SupremeCourtSimulator: React.FC<SupremeCourtSimulatorProps> = ({
  cases,
  themeMode,
  searchQuery,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [step1Pick, setStep1Pick] = useState<Record<string, 'O' | 'X'>>({});
  const [step2Pick, setStep2Pick] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const categories = ['전체', ...Array.from(new Set(cases.map((c) => c.category)))];

  const filteredCases = cases.filter((c) => {
    const matchCat = categoryFilter === '전체' || c.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.caseNumberLabel.toLowerCase().includes(q) ||
      c.storySetup.incidentTitle.toLowerCase().includes(q) ||
      c.rulingSummary.examKeySentence.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const currentCase = filteredCases[selectedIndex] || filteredCases[0];

  const totalSolved = cases.filter(
    (c) =>
      step1Pick[c.id] === c.correctVerdict && step2Pick[c.id] === c.correctReasonId
  ).length;

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

  if (!currentCase) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className={`p-10 rounded-3xl border text-center ${cardBg}`}>
          조건에 맞는 대법관 시뮬레이터 사건이 없습니다.
        </div>
      </div>
    );
  }

  const pickedVerdict = step1Pick[currentCase.id];
  const pickedReason = step2Pick[currentCase.id];
  const isStep1Correct = pickedVerdict === currentCase.correctVerdict;
  const isStep2Correct = pickedReason === currentCase.correctReasonId;
  const isBothComplete = pickedVerdict !== undefined && pickedReason !== undefined;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
      {/* 상단 배너 & 대법관 판결 스코어보드 */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <Gavel className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                인터랙티브 사건 판결 게임 (총 {cases.length}대 핵심 판례)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                ⚖️ “내가 대법관이다!” — 왜(Why) 판결 시뮬레이터
              </h2>
              <p className="text-sm opacity-80 font-medium">
                1단계 결론(유효 O vs 무효 X)과 2단계 판결 이유(왜냐하면...)까지 모두 맞히면 대법관 판결문이 선고됩니다!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="font-black text-base">
                완벽 선고 완료: {totalSolved} / {cases.length} 건
              </span>
            </div>
            <button
              onClick={() => {
                setStep1Pick({});
                setStep2Pick({});
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold border ${subtleBg}`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>전체 초기화</span>
            </button>
          </div>
        </div>

        {/* 카테고리 필터 & 사건 번호 선택 버튼 */}
        <div className="mt-5 pt-4 border-t border-current/10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  setSelectedIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-extrabold transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : `${subtleBg} border hover:border-blue-500`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {filteredCases.map((c, idx) => {
              const solved =
                step1Pick[c.id] === c.correctVerdict && step2Pick[c.id] === c.correctReasonId;
              const active = idx === selectedIndex;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black border transition-all ${
                    active
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105'
                      : solved
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : `${subtleBg}`
                  }`}
                >
                  #{idx + 1} {c.title.slice(0, 10)}..
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 메인 사건 법정 카드 */}
      <div className={`rounded-3xl border-2 shadow-lg overflow-hidden ${cardBg}`}>
        {/* 사건 헤더 */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-500 text-slate-950">
              {currentCase.caseNumberLabel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-white/15">
              분야: {currentCase.category}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black leading-snug">{currentCase.title}</h3>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* 사건 기록 (Story Setup) */}
          <section className={`p-6 rounded-3xl border-2 space-y-4 ${subtleBg}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xl font-black text-blue-600 dark:text-blue-400">
                📂 사건 기록: {currentCase.storySetup.incidentTitle}
              </h4>
              <span className="text-sm font-bold opacity-80">
                등장인물: {currentCase.storySetup.characters}
              </span>
            </div>

            <div className="space-y-3">
              {currentCase.storySetup.storyParagraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`p-4 rounded-2xl border leading-relaxed font-medium ${
                    isNight ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                <strong className="font-black text-blue-700 dark:text-blue-300 block mb-1">
                  👔 검사 측 주장
                </strong>
                <p className="leading-relaxed font-semibold">{currentCase.storySetup.prosecutorClaim}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                <strong className="font-black text-rose-700 dark:text-rose-300 block mb-1">
                  🛡️ 피고인·변호인 측 주장
                </strong>
                <p className="leading-relaxed font-semibold">{currentCase.storySetup.defendantClaim}</p>
              </div>
            </div>
          </section>

          {/* [1단계: 판결 선택 (유효/적법 O vs 무효/위법 X)] */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-sm font-black bg-blue-600 text-white">
                STEP 1
              </span>
              <h4 className="text-xl sm:text-2xl font-black">{currentCase.step1Question}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['O', 'X'] as const).map((verdict) => {
                const selected = pickedVerdict === verdict;
                const isRight = currentCase.correctVerdict === verdict;
                return (
                  <button
                    key={verdict}
                    onClick={() =>
                      setStep1Pick((prev) => ({ ...prev, [currentCase.id]: verdict }))
                    }
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      selected
                        ? isRight
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                          : 'bg-rose-600 text-white border-rose-700 shadow-md'
                        : `${subtleBg} hover:border-blue-500`
                    }`}
                  >
                    <span className="text-2xl font-black shrink-0">
                      {verdict === 'O' ? '🟢 O' : '🔴 X'}
                    </span>
                    <div>
                      <div className="font-black text-lg">
                        {verdict === 'O'
                          ? currentCase.step1Options.O
                          : currentCase.step1Options.X}
                      </div>
                      {selected && (
                        <div className="text-sm font-extrabold mt-1 opacity-95">
                          {isRight
                            ? '✔ 대법원의 1단계 결론과 일치합니다! 아래 2단계 이유를 선택하세요.'
                            : '✖ 결론이 다릅니다! 반대쪽 입장에서 다시 생각해 보세요.'}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* [2단계: 판결 이유 선택 (왜냐하면...)] */}
          {pickedVerdict !== undefined && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-sm font-black bg-purple-600 text-white">
                  STEP 2
                </span>
                <h4 className="text-xl sm:text-2xl font-black">{currentCase.step2Question}</h4>
              </div>

              <div className="space-y-3">
                {currentCase.step2ReasonOptions.map((opt) => {
                  const selected = pickedReason === opt.id;
                  const isRight = currentCase.correctReasonId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setStep2Pick((prev) => ({ ...prev, [currentCase.id]: opt.id }))
                      }
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                        selected
                          ? isRight
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                            : 'bg-rose-600 text-white border-rose-700 shadow-md'
                          : `${subtleBg} hover:border-purple-500`
                      }`}
                    >
                      <span className="px-3 py-1 rounded-lg font-black text-base bg-black/15 shrink-0">
                        이유 {opt.id}
                      </span>
                      <span className="font-bold leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 대법관 망치 선고 결과 & 원리 해설 */}
          {isBothComplete && (
            <section
              className={`p-6 sm:p-8 rounded-3xl border-4 space-y-4 transition-all ${
                isStep1Correct && isStep2Correct
                  ? 'bg-emerald-500/10 border-emerald-500'
                  : 'bg-amber-500/10 border-amber-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black">
                  <Gavel className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    땅! 땅! 땅! 대법원 최종 판결 선고 (정답: {currentCase.correctVerdict} / 이유 {currentCase.correctReasonId})
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black">
                    {currentCase.rulingSummary.gavelHeadline}
                  </h4>
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border ${
                  isNight ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <strong className="font-black text-blue-600 dark:text-blue-400 block mb-1">
                  🧠 대법관의 속마음 (왜 이렇게 판결했을까?):
                </strong>
                <p className="leading-relaxed font-semibold">
                  {currentCase.rulingSummary.supremeCourtMindset}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-600/15 border border-blue-500/30">
                <strong className="font-black text-blue-800 dark:text-blue-200 block mb-1">
                  🎯 시험장에 그대로 나오는 판례 핵심 문장:
                </strong>
                <p className="font-extrabold leading-relaxed">
                  “{currentCase.rulingSummary.examKeySentence}”
                </p>
                <span className="text-xs font-bold opacity-75 block mt-1">
                  근거 조문·판례: {currentCase.rulingSummary.relatedArticleOrCase}
                </span>
              </div>
            </section>
          )}

          {/* 이전 사건 / 다음 사건 네비게이션 */}
          <div className="flex items-center justify-between pt-4 border-t border-current/10">
            <button
              onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedIndex === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold border ${subtleBg} disabled:opacity-40`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>이전 사건</span>
            </button>
            <span className="font-black text-sm opacity-75">
              {selectedIndex + 1} / {filteredCases.length}
            </span>
            <button
              onClick={() =>
                setSelectedIndex((prev) => Math.min(filteredCases.length - 1, prev + 1))
              }
              disabled={selectedIndex === filteredCases.length - 1}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 shadow-sm"
            >
              <span>다음 사건 판결하기</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
