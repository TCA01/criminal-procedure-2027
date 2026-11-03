import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ThemeMode, WhyStudyNode } from '../types/criminal';

interface ZenStudyViewProps {
  node: WhyStudyNode;
  nodeIndex: number;
  totalNodes: number;
  stepIndex: number;
  setStepIndex: (step: number) => void;
  onPrevNode: () => void;
  onNextNode: () => void;
  themeMode: ThemeMode;
}

export const ZenStudyView: React.FC<ZenStudyViewProps> = ({
  node,
  nodeIndex,
  totalNodes,
  stepIndex,
  setStepIndex,
  onPrevNode,
  onNextNode,
  themeMode,
}) => {
  // 김옥현 법령풀이집 인터랙티브 상태
  const [blankMode, setBlankMode] = useState<boolean>(false);
  const [showTraps, setShowTraps] = useState<boolean>(true);
  const [revealedKeywords, setRevealedKeywords] = useState<Record<string, boolean>>({});

  // OX 퀴즈 풀이 상태
  const [quizAnswers, setQuizAnswers] = useState<Record<number, 'O' | 'X'>>({});

  // 모바일 터치 스와이프 상태
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isDark = themeMode === 'night';
  const totalSteps = 4; // 0: 상황극, 1: 왜원리, 2: 조문판례, 3: OX퀴즈

  // 키보드 좌우 방향키로 장 넘김 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepIndex, nodeIndex]);

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // 다음 단원으로 넘어가며 첫 번째 단계로 리셋
      onNextNode();
      setStepIndex(0);
      setQuizAnswers({});
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      // 이전 단원으로 넘어가며 마지막 단계로
      onPrevNode();
      setStepIndex(totalSteps - 1);
      setQuizAnswers({});
    }
  };

  // 모바일 스와이프 제스처
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const toggleKeywordReveal = (key: string) => {
    setRevealedKeywords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-3xl mx-auto px-4 py-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. 상단 미니멀 안내 바 */}
      <div className="flex items-center justify-between text-xs font-bold opacity-60 pb-3 border-b border-current/10">
        <div className="flex items-center gap-2">
          <span className="font-mono">
            단원 {nodeIndex + 1} / {totalNodes}
          </span>
          <span>·</span>
          <span>중요도 {node.importance}급 · {node.frequencyBadge}</span>
        </div>

        {/* 2027.02.05 개정 배지 */}
        {node.amendmentAlert && (
          <span className="text-[#C53D33] dark:text-[#E05347] font-black flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            2027. 2. 5. 개정 반영
          </span>
        )}
      </div>

      {/* 2. 중앙 단일 몰입형 카드 (Step 0 ~ Step 3) */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10 zen-fade" key={`${node.id}-${stepIndex}`}>
        {/* ========================================================================= */}
        {/* STEP 0: 1초 일상어 번역 & 30초 상황극 */}
        {/* ========================================================================= */}
        {stepIndex === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#C53D33] dark:text-[#E05347] uppercase">
                Step 1 · 외계어 1초 일상어 번역
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                “{node.analogyStory.oneSecTranslation}”
              </h2>
            </div>

            {/* 30초 일상 상황극 */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#181818] border-white/10 text-[#EDEAE3]'
                  : 'bg-white border-black/5 text-[#181818] shadow-sm'
              }`}
            >
              <div className="text-xs font-extrabold opacity-50 mb-3">
                🎬 등장인물: {node.analogyStory.characters}
              </div>
              <div className="space-y-3 font-medium leading-relaxed text-base sm:text-lg">
                {node.analogyStory.storyDialogue.map((line, idx) => (
                  <p key={idx} className="border-l-2 border-[#C53D33]/30 pl-3.5 py-0.5">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* 머릿속에 남길 단 하나의 그림 */}
            <div className="p-4 rounded-xl border border-[#C53D33]/20 bg-[#C53D33]/5 text-sm sm:text-base font-bold flex items-start gap-2.5">
              <span className="hanko-seal px-1.5 py-0.5 text-[10px] shrink-0 mt-0.5">핵심</span>
              <p className="leading-relaxed">
                <strong>단 하나의 기억 그림:</strong> {node.analogyStory.coreMentalPicture}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: 왜(Why) 이건 되고 저건 안 될까? — 대법관의 속마음 저울 */}
        {/* ========================================================================= */}
        {stepIndex === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#C53D33] dark:text-[#E05347] uppercase">
                Step 2 · 대법관의 속마음 인과관계 저울
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                ⚖️ {node.whyPrinciple.corePhilosophy}
              </h2>
            </div>

            {/* 좌우 대조 저울 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 인정/적법 O */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                    : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-600 text-white">
                    인정 · 적법 O
                  </span>
                </div>
                <h3 className="font-black text-lg sm:text-xl leading-tight">
                  {node.whyPrinciple.allowSide.title}
                </h3>
                <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  왜 봐줄까? ➔ {node.whyPrinciple.allowSide.reasonHeadline}
                </div>
                <div className="space-y-2 pt-1 border-t border-emerald-500/20">
                  {node.whyPrinciple.allowSide.items.map((item, i) => (
                    <div key={i} className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                      <strong>{item.caseTitle}:</strong> {item.because}
                    </div>
                  ))}
                </div>
              </div>

              {/* 부정/위법 X */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isDark
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-100'
                    : 'bg-rose-50/70 border-rose-200/80 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white">
                    부정 · 위법 X
                  </span>
                </div>
                <h3 className="font-black text-lg sm:text-xl leading-tight">
                  {node.whyPrinciple.denySide.title}
                </h3>
                <div className="text-xs font-extrabold text-rose-700 dark:text-rose-400">
                  왜 절대 안 봐줄까? ➔ {node.whyPrinciple.denySide.reasonHeadline}
                </div>
                <div className="space-y-2 pt-1 border-t border-rose-500/20">
                  {node.whyPrinciple.denySide.items.map((item, i) => (
                    <div key={i} className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                      <strong>{item.caseTitle}:</strong> {item.because}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 1초 골든 팁 */}
            <div className="p-4 rounded-xl border border-current/10 bg-current/5 text-sm sm:text-base font-bold flex items-start gap-2.5">
              <span className="hanko-seal px-1.5 py-0.5 text-[10px] shrink-0 mt-0.5">비결</span>
              <p className="leading-relaxed">
                <strong>1초 판별법:</strong> {node.whyPrinciple.goldenTip}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: 조문 및 핵심 판례 (김옥현 빈칸 & 오답함정 모드) */}
        {/* ========================================================================= */}
        {stepIndex === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-3">
              <div>
                <span className="text-xs font-black tracking-widest text-[#C53D33] dark:text-[#E05347] uppercase">
                  Step 3 · 핵심 조문 및 판례
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  김옥현 법령풀이집 원문 정밀 독해
                </h2>
              </div>

              {/* 미니멀 인라인 스위치: 빈칸 모드 & 함정 보이기 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBlankMode(!blankMode)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    blankMode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-current/20 opacity-70 hover:opacity-100'
                  }`}
                  title="핵심어 빈칸 가리기"
                >
                  {blankMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{blankMode ? '빈칸 켜짐' : '빈칸 가리기'}</span>
                </button>

                <button
                  onClick={() => setShowTraps(!showTraps)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    showTraps
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-current/20 opacity-70 hover:opacity-100'
                  }`}
                  title="출제 함정 표시"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{showTraps ? '함정 보임' : '함정 숨김'}</span>
                </button>
              </div>
            </div>

            {/* 조문·판례 카드 목록 */}
            <div className="space-y-4">
              {node.statuteAndCases.map((sc, scIdx) => (
                <div
                  key={sc.id || scIdx}
                  className={`p-6 rounded-2xl border transition-all space-y-3 ${
                    isDark
                      ? 'bg-[#181818] border-white/10 text-[#EDEAE3]'
                      : 'bg-white border-black/5 text-[#181818] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {sc.badge}
                    </span>
                    {sc.caseNumber && (
                      <span className="text-xs font-bold opacity-60">{sc.caseNumber}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-black">{sc.title}</h3>

                  {/* 하이라이트 원문 텍스트 */}
                  <div className="leading-loose text-base sm:text-lg font-medium">
                    {sc.segments.map((seg, sIdx) => {
                      const segKey = `${node.id}-${scIdx}-${sIdx}`;
                      const isRevealed = revealedKeywords[segKey];

                      if (seg.type === 'kw') {
                        if (blankMode && !isRevealed) {
                          return (
                            <span
                              key={sIdx}
                              onClick={() => toggleKeywordReveal(segKey)}
                              className="kw-blank"
                              title="클릭하여 키워드 확인"
                            >
                              [ ??? ]
                            </span>
                          );
                        }
                        return (
                          <span
                            key={sIdx}
                            onClick={() => blankMode && toggleKeywordReveal(segKey)}
                            className="kw cursor-pointer"
                          >
                            {seg.text}
                          </span>
                        );
                      }

                      if (seg.type === 'trap') {
                        if (!showTraps) return null;
                        return (
                          <span key={sIdx} className="trap">
                            {seg.text}
                          </span>
                        );
                      }

                      return <span key={sIdx}>{seg.text}</span>;
                    })}
                  </div>

                  {/* 핵심 요약 */}
                  <div className="p-3 rounded-xl bg-current/5 border border-current/10 text-xs sm:text-sm font-bold flex items-start gap-2">
                    <span className="hanko-seal px-1.5 py-0.2 text-[9px] shrink-0 mt-0.5">요약</span>
                    <p className="leading-relaxed">{sc.keyTakeaway}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: 실전 기출 즉석 OX 지문 (도장 쾅 손맛) */}
        {/* ========================================================================= */}
        {stepIndex === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-[#C53D33] dark:text-[#E05347] uppercase">
                Step 4 · 실전 기출 즉석 OX 체커
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                방금 이해한 원리로 1초 만에 풀리는 실전 지문
              </h2>
            </div>

            {/* 문항 목록 */}
            <div className="space-y-4">
              {node.instantQuiz.map((quiz, qIdx) => {
                const userAnswer = quizAnswers[qIdx];
                const isAnswered = userAnswer !== undefined;
                const isCorrect = isAnswered && userAnswer === quiz.answer;

                return (
                  <div
                    key={quiz.id || qIdx}
                    className={`p-6 rounded-2xl border transition-all space-y-4 ${
                      isDark
                        ? 'bg-[#181818] border-white/10 text-[#EDEAE3]'
                        : 'bg-white border-black/5 text-[#181818] shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#C53D33]/10 text-[#C53D33] dark:text-[#E05347]">
                        {quiz.sourceBadge} · 지문 {qIdx + 1}
                      </span>
                      {isAnswered && (
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {isCorrect ? '정답입니다! 🎯' : '오답입니다 ⚠️'}
                        </span>
                      )}
                    </div>

                    <p className="text-base sm:text-lg font-bold leading-relaxed">
                      {quiz.statement}
                    </p>

                    {/* O / X 버튼 2개 */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: 'O' }))}
                        className={`py-3.5 rounded-xl border-2 font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-2 ${
                          userAnswer === 'O'
                            ? isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                              : 'bg-rose-600 text-white border-rose-600'
                            : isDark
                            ? 'border-white/15 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-black/10 hover:border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>O (옳음)</span>
                      </button>

                      <button
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: 'X' }))}
                        className={`py-3.5 rounded-xl border-2 font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-2 ${
                          userAnswer === 'X'
                            ? isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                              : 'bg-rose-600 text-white border-rose-600'
                            : isDark
                            ? 'border-white/15 hover:border-rose-500 text-rose-400 hover:bg-rose-500/10'
                            : 'border-black/10 hover:border-rose-600 text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle className="w-5 h-5" />
                        <span>X (틀림)</span>
                      </button>
                    </div>

                    {/* 해설 상자 (도장 찍히듯 등장) */}
                    {isAnswered && (
                      <div
                        className={`p-4 rounded-xl border leading-relaxed text-sm sm:text-base zen-fade ${
                          isCorrect
                            ? isDark
                              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                              : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : isDark
                            ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="font-black mb-1 flex items-center gap-1.5">
                          <span className="hanko-seal px-1.5 py-0.2 text-[9px]">해설</span>
                          <span>정답: {quiz.answer}</span>
                        </div>
                        <p className="font-medium opacity-90">{quiz.whyExplanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 3. 하단 젠 내비게이션 바 (이전 / 엔소 점 진행률 / 다음) */}
      <footer
        className="pt-4 border-t border-current/10 flex items-center justify-between gap-4 sticky bottom-0 bg-inherit"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 16px))' }}
      >
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-current/15 text-xs sm:text-sm font-extrabold opacity-75 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전</span>
        </button>

        {/* 4단계 스텝 엔소/점 인디케이터 */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStepIndex(s)}
              className={`transition-all rounded-full ${
                stepIndex === s
                  ? 'w-7 h-2.5 bg-[#C53D33] dark:bg-[#E05347]'
                  : 'w-2.5 h-2.5 bg-current/20 hover:bg-current/40'
              }`}
              title={`단계 ${s + 1}로 이동`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#C53D33] dark:bg-[#E05347] text-white text-xs sm:text-sm font-black shadow hover:opacity-90 transition-opacity"
        >
          <span>{stepIndex === totalSteps - 1 ? '다음 단원' : '다음'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
