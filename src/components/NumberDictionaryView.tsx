import React, { useState } from 'react';
import { Hash, RotateCw, Eye, Sparkles, AlertCircle } from 'lucide-react';
import {
  NumberDictionaryEntry,
  NumberFilterTag,
  ThemeMode,
} from '../types/criminal';

interface NumberDictionaryViewProps {
  entries: NumberDictionaryEntry[];
  themeMode: ThemeMode;
  searchQuery: string;
}

export const NumberDictionaryView: React.FC<NumberDictionaryViewProps> = ({
  entries,
  themeMode,
  searchQuery,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const filterTags: ('전체' | NumberFilterTag)[] = [
    '전체',
    '즉시/지체없이',
    '24시간/48시간',
    '3일/5일',
    '7일',
    '10일/14일/20일',
    '30일/60일/90일',
    '2개월/3개월/6개월',
    '1년/3년/5년+',
    '금액(20만/50만/500만)',
  ];

  const filteredEntries = entries.filter((e) => {
    const matchTag = selectedTag === '전체' || e.filterTag === selectedTag;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      e.numberBadge.toLowerCase().includes(q) ||
      e.subjectBadge.toLowerCase().includes(q) ||
      e.targetTopic.toLowerCase().includes(q) ||
      e.ruleSummary.toLowerCase().includes(q) ||
      e.whyThisNumber.toLowerCase().includes(q);
    return matchTag && matchQuery;
  });

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
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

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* 상단 헤더 & 필터 */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md">
              <Hash className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                형사소송법·규칙·수사준칙·특별법 전 범위 숫자·기한·금액 총집합
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                🔢 숫자·기한·주체 『1초 필터 사전 & 이유 플래시카드』
              </h2>
              <p className="text-sm opacity-80 font-medium">
                무작정 숫자를 외우지 마세요! “왜 하필 48시간인지, 왜 하필 7일인지, 왜 6개월인지” 입법 이유를 알면 절대 안 잊어버립니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setFlashcardMode(!flashcardMode);
              setFlippedIds({});
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm sm:text-base border-2 transition-all shadow-sm ${
              flashcardMode
                ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-400/30'
                : `${subtleBg} hover:border-indigo-500`
            }`}
          >
            {flashcardMode ? <Eye className="w-5 h-5" /> : <RotateCw className="w-5 h-5" />}
            <span>
              {flashcardMode
                ? '🃏 암기 플래시카드 모드 켜짐 (카드 클릭 시 숫자 공개)'
                : '🃏 숫자 가리기 플래시카드 암기 모드 켜기'}
            </span>
          </button>
        </div>

        {/* 1초 숫자 필터 버튼 */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : `${subtleBg} border hover:border-indigo-500`
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 숫자 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEntries.map((item) => {
          const isHidden = flashcardMode && !flippedIds[item.id];
          return (
            <div
              key={item.id}
              onClick={() => flashcardMode && toggleFlip(item.id)}
              className={`p-6 rounded-3xl border-2 shadow-sm space-y-4 transition-all ${cardBg} ${
                flashcardMode ? 'cursor-pointer hover:border-indigo-500' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* 숫자 배지 (플래시카드 모드일 때 가림) */}
                  <span
                    className={`px-4 py-1.5 rounded-2xl text-lg font-black shadow-sm transition-all ${
                      isHidden
                        ? 'bg-indigo-600/20 text-transparent border-2 border-dashed border-indigo-500 select-none'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isHidden ? '❓ 몇 일/시간? (클릭)' : item.numberBadge}
                  </span>

                  <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    주체: {item.subjectBadge}
                  </span>
                </div>

                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10">
                  {item.articleRef}
                </span>
              </div>

              <h3 className="text-xl font-black leading-snug">{item.targetTopic}</h3>

              <div className={`p-4 rounded-2xl border leading-relaxed font-semibold ${subtleBg}`}>
                {isHidden
                  ? '💡 플래시카드 암기 모드입니다. 이 절차의 정확한 기한/숫자와 주체를 떠올린 뒤 카드를 클릭해 보세요!'
                  : item.ruleSummary}
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25">
                <strong className="font-black text-blue-700 dark:text-blue-300 block mb-1">
                  🧠 왜(Why) 하필 이 숫자일까?
                </strong>
                <p className="leading-relaxed font-medium">{item.whyThisNumber}</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="trap">🚨 출제 함정: {item.examTrap}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
