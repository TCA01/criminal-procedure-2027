import React, { useState } from 'react';
import {
  FileCheck2,
  Stethoscope,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  BookOpen,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { ExamQuestion, ThemeMode } from '../types/criminal';

interface MockExamAndPrescriptionViewProps {
  questions: ExamQuestion[];
  themeMode: ThemeMode;
  wrongQuestionIds: string[];
  addWrongQuestionId: (id: string) => void;
  removeWrongQuestionId: (id: string) => void;
  clearWrongQuestions: () => void;
  onJumpToModule: (moduleId: string) => void;
  searchQuery: string;
}

type ExamTabKey =
  | 'mock_2027_1'
  | 'mock_2027_2'
  | 'mock_2027_3'
  | 'past_2026_5th'
  | 'past_2026_7th'
  | 'wrong_note';

export const MockExamAndPrescriptionView: React.FC<MockExamAndPrescriptionViewProps> = ({
  questions,
  themeMode,
  wrongQuestionIds,
  addWrongQuestionId,
  removeWrongQuestionId,
  clearWrongQuestions,
  onJumpToModule,
  searchQuery,
}) => {
  const [selectedSet, setSelectedSet] = useState<ExamTabKey>('mock_2027_1');
  const [userAnswers, setUserAnswers] = useState<Record<string, 1 | 2 | 3 | 4>>({});
  const [examMode, setExamMode] = useState<'instant' | 'real_omr'>('instant');
  const [omrSubmitted, setOmrSubmitted] = useState<boolean>(false);

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const setTabs: { id: ExamTabKey; label: string; desc: string }[] = [
    {
      id: 'mock_2027_1',
      label: '🏆 2027 6급 실전 모의 제1회 (40문항)',
      desc: '전 범위 핵심 조문·전원합의체 판례 황금비율 (75:25)',
    },
    {
      id: 'mock_2027_2',
      label: '🔥 2027 6급 실전 모의 제2회 (40문항)',
      desc: '2026.10.2. / 2027.2.5. 최신 개정법 + 고난도 함정 집중',
    },
    {
      id: 'mock_2027_3',
      label: '🎯 2027 6급 파이널 모의 제3회 (40문항)',
      desc: '실전 동형 통합 + 제5편 재판의 집행·특별절차 마스터',
    },
    {
      id: 'past_2026_5th',
      label: '📜 2026 교정 5급(교정관) 기출 복원',
      desc: '2026 실제 승진 기출 (2027.2.5. 개정 기준으로 해설 보정)',
    },
    {
      id: 'past_2026_7th',
      label: '📜 2026 교정 7급(교위) 기출 복원',
      desc: '2026 실제 승진 기출 (2027.2.5. 개정 기준으로 해설 보정)',
    },
    {
      id: 'wrong_note',
      label: `💊 나만의 오답 원리 처방전 (${wrongQuestionIds.length})`,
      desc: '내가 틀렸던 문제와 근본 원리(Why) 반복 복습 큐',
    },
  ];

  const currentQuestions = questions.filter((q) => {
    const matchSet =
      selectedSet === 'wrong_note'
        ? wrongQuestionIds.includes(q.id)
        : q.examSetId === selectedSet;
    const sq = searchQuery.trim().toLowerCase();
    const matchSearch =
      !sq ||
      q.questionStem.toLowerCase().includes(sq) ||
      q.category.toLowerCase().includes(sq) ||
      q.prescription.corePrincipleTitle.toLowerCase().includes(sq) ||
      q.choices.some((c) => c.text.toLowerCase().includes(sq));
    return matchSet && matchSearch;
  });

  const handleSelectOption = (q: ExamQuestion, num: 1 | 2 | 3 | 4) => {
    setUserAnswers((prev) => ({ ...prev, [q.id]: num }));
    if (num !== q.answerNumber) {
      addWrongQuestionId(q.id);
    }
  };

  const resetCurrentSet = () => {
    const next = { ...userAnswers };
    currentQuestions.forEach((q) => {
      delete next[q.id];
    });
    setUserAnswers(next);
    setOmrSubmitted(false);
  };

  // 점수 계산
  const answeredCount = currentQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  const correctCount = currentQuestions.filter(
    (q) => userAnswers[q.id] === q.answerNumber
  ).length;
  const scorePoints =
    currentQuestions.length > 0
      ? Math.round((correctCount / currentQuestions.length) * 100)
      : 0;

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

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* 상단 컨트롤 & 회차 선택 */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm space-y-5 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                2027 개편 40문항 4지선다 완벽 대응 · 오답 자동 처방 시스템
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                📝 실전 40문항 모의고사 & 『오답 원리 처방전 (Spaced Repetition)』
              </h2>
              <p className="text-sm opacity-80 font-medium">
                문제를 틀리면 단순히 정답만 보여주는 것이 아니라, [💊 왜 틀렸을까? 원리 처방전 카드]가 즉시 열리고 오답노트에 자동 저장됩니다.
              </p>
            </div>
          </div>

          {/* 풀이 모드 스위치 & 점수판 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center p-1 rounded-2xl border ${subtleBg}`}>
              <button
                onClick={() => {
                  setExamMode('instant');
                  setOmrSubmitted(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  examMode === 'instant'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                ⚡ 즉시 해설 & 처방 모드
              </button>
              <button
                onClick={() => {
                  setExamMode('real_omr');
                  setOmrSubmitted(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  examMode === 'real_omr'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                ⏱️ 실전 OMR 일괄채점 모드
              </button>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-black text-base">
                진행 {answeredCount}/{currentQuestions.length} · 정답 {correctCount}개 ({scorePoints}점)
              </span>
            </div>

            <button
              onClick={resetCurrentSet}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold border ${subtleBg}`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>현재 회차 다시 풀기</span>
            </button>
          </div>
        </div>

        {/* 시험 회차 탭 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {setTabs.map((t) => {
            const active = selectedSet === t.id;
            const isWrongTab = t.id === 'wrong_note';
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedSet(t.id);
                  setOmrSubmitted(false);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  active
                    ? isWrongTab
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                      : 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : `${subtleBg} hover:border-emerald-500`
                }`}
              >
                <div className="font-black text-base leading-snug">{t.label}</div>
                <div
                  className={`text-xs mt-1.5 font-semibold ${
                    active ? 'text-white/90' : 'opacity-75'
                  }`}
                >
                  {t.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* 실전 OMR 모드일 때 일괄 채점 버튼 */}
        {examMode === 'real_omr' && currentQuestions.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-600/10 border-2 border-blue-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="font-bold">
              📋 실전 OMR 모드입니다. 40문항의 답안을 모두 선택한 뒤 우측 [답안지 제출 및 일괄 채점] 버튼을 누르세요!
            </div>
            <button
              onClick={() => setOmrSubmitted(true)}
              className="px-6 py-2.5 rounded-xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            >
              {omrSubmitted ? `채점 완료! (${scorePoints}점)` : '답안지 제출 및 일괄 채점하기'}
            </button>
          </div>
        )}

        {/* 오답노트 탭일 때 전체 비우기 컨트롤 */}
        {selectedSet === 'wrong_note' && wrongQuestionIds.length > 0 && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
            <span className="font-extrabold text-rose-700 dark:text-rose-300">
              💡 틀렸던 문제의 원리 처방전을 읽고 완전히 이해했다면 [오답노트에서 졸업(삭제)] 버튼을 누르세요!
            </span>
            <button
              onClick={clearWrongQuestions}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-rose-600 text-white hover:bg-rose-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>오답노트 전체 비우기</span>
            </button>
          </div>
        )}
      </div>

      {/* 문항 리스트 */}
      {currentQuestions.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-3 ${cardBg}`}>
          <Stethoscope className="w-12 h-12 mx-auto text-emerald-500 opacity-85" />
          <h3 className="text-2xl font-black">
            {selectedSet === 'wrong_note'
              ? '현재 오답노트에 저장된 취약 문제가 없습니다!'
              : '검색 조건에 맞는 문항이 없습니다.'}
          </h3>
          <p className="opacity-75">
            {selectedSet === 'wrong_note'
              ? '모의고사나 기출문제를 풀다가 틀리는 문항이 생기면 자동으로 이곳에 원리 처방전과 함께 등록됩니다.'
              : '다른 검색어나 회차를 선택해 보세요.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {currentQuestions.map((q) => {
            const picked = userAnswers[q.id];
            const showFeedback =
              (examMode === 'instant' && picked !== undefined) ||
              (examMode === 'real_omr' && omrSubmitted) ||
              selectedSet === 'wrong_note';
            const isCorrect = picked === q.answerNumber;

            return (
              <article
                key={q.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 shadow-sm space-y-6 ${cardBg}`}
              >
                {/* 문항 헤더 */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 border-current/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 rounded-xl text-sm font-black bg-blue-600 text-white">
                      문 {q.questionNumber}
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                      {q.category}
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-bold opacity-75 bg-black/5 dark:bg-white/10">
                      {q.sourceTag}
                    </span>
                  </div>

                  {selectedSet === 'wrong_note' && (
                    <button
                      onClick={() => removeWrongQuestionId(q.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>원리 정복 완료 (오답노트 졸업)</span>
                    </button>
                  )}
                </div>

                {/* 문제 발문 */}
                <h3 className="text-xl sm:text-2xl font-black leading-relaxed">
                  {q.questionNumber}. {q.questionStem}
                </h3>

                {/* 4지선다 선택지 */}
                <div className="space-y-3">
                  {q.choices.map((ch) => {
                    const isPicked = picked === ch.num;
                    const isAnswer = ch.num === q.answerNumber;

                    let btnStyle = `${subtleBg} hover:border-blue-500`;
                    if (showFeedback) {
                      if (isAnswer) {
                        btnStyle =
                          'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100';
                      } else if (isPicked && !isAnswer) {
                        btnStyle =
                          'bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-100';
                      }
                    } else if (isPicked) {
                      btnStyle = 'bg-blue-600 text-white border-blue-700 shadow-md';
                    }

                    return (
                      <div key={ch.num} className="space-y-2">
                        <button
                          onClick={() => handleSelectOption(q, ch.num)}
                          className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${btnStyle}`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 border ${
                              isPicked
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-black/5 dark:bg-white/10 border-current/20'
                            }`}
                          >
                            {ch.num}
                          </span>
                          <div className="flex-1 font-bold leading-relaxed">{ch.text}</div>
                        </button>

                        {/* 선지별 상세 왜(Why) 해설 */}
                        {showFeedback && (
                          <div
                            className={`ml-6 p-3.5 rounded-2xl border text-sm sm:text-base leading-relaxed ${
                              isAnswer
                                ? 'bg-emerald-500/10 border-emerald-500/30 font-bold'
                                : 'opacity-90 bg-black/5 dark:bg-white/5 border-current/10'
                            }`}
                          >
                            <span
                              className={`font-black mr-2 ${
                                isAnswer
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isAnswer ? `✔ [정답 선지 ${ch.num}번 해설]` : `• [선지 ${ch.num}번 해설]`}
                            </span>
                            {ch.whyOptionExplanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* [💊 왜 틀렸을까? 원리 처방전 카드] */}
                {showFeedback && (
                  <div
                    className={`p-6 rounded-3xl border-4 space-y-4 ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/60'
                        : 'bg-rose-500/10 border-rose-500/70'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                        ) : (
                          <Stethoscope className="w-7 h-7 text-rose-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                            {isCorrect
                              ? `정답(${q.answerNumber}번) 적중! 핵심 원리 확인`
                              : `오답 발생 (정답: ${q.answerNumber}번) · 나만의 오답노트 자동 저장됨`}
                          </span>
                          <h4 className="text-xl font-black">
                            💊 왜 틀렸을까? 원리 처방전 — {q.prescription.corePrincipleTitle}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => onJumpToModule(q.prescription.relatedModuleId)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>이 단원 개념 카드로 복습하러 가기</span>
                      </button>
                    </div>

                    <p className="leading-relaxed font-semibold">
                      {q.prescription.whyYouMissedIt}
                    </p>

                    <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                      <div>
                        <strong className="font-black text-amber-800 dark:text-amber-300">
                          💉 시험장 1초 백신 문장:{' '}
                        </strong>
                        <span className="font-extrabold">{q.prescription.oneLineVaccine}</span>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
