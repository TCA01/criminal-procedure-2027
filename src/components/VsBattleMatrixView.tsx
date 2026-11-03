import React, { useState } from 'react';
import { Swords, Zap, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { ThemeMode, VsBattleItem } from '../types/criminal';

interface VsBattleMatrixViewProps {
  battles: VsBattleItem[];
  themeMode: ThemeMode;
  searchQuery: string;
}

export const VsBattleMatrixView: React.FC<VsBattleMatrixViewProps> = ({
  battles,
  themeMode,
  searchQuery,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const categories = [
    '전체',
    '총칙·소송행위',
    '수사·강제처분',
    '공소·공판',
    '증거법',
    '상소·특별절차·집행',
  ];

  const filteredBattles = battles.filter((b) => {
    const matchCat = categoryFilter === '전체' || b.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.whyConfusing.toLowerCase().includes(q) ||
      b.leftSide.label.toLowerCase().includes(q) ||
      b.rightSide.label.toLowerCase().includes(q) ||
      b.oneSecKillTip.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

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
      {/* 상단 헤더 & 카테고리 필터 */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm space-y-4 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-600 to-purple-700 text-white shadow-md">
              <Swords className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-700 dark:text-rose-300">
                <Sparkles className="w-3.5 h-3.5" />
                시험장에서 가장 많이 바꿔치기하는 쌍둥이 40쌍 총정리
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                ⚔️ 헷갈리는 쌍둥이 개념 『VS 일대일 배틀 도감 (40대 비교 매트릭스)』
              </h2>
              <p className="text-sm opacity-80 font-medium">
                비슷해 보이지만 결론이 정반대인 40쌍의 개념을 1:1로 맞붙여 ‘왜(Why) 다른지’ 단번에 구분합니다.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 font-black text-sm">
            현재 표시: {filteredBattles.length} / {battles.length} 쌍
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
                categoryFilter === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : `${subtleBg} border hover:border-rose-500`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 40대 배틀 카드 리스트 */}
      <div className="space-y-6">
        {filteredBattles.map((battle) => (
          <article
            key={battle.id}
            className={`p-6 sm:p-8 rounded-3xl border-2 shadow-sm space-y-5 ${cardBg}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 border-current/10">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-rose-600 text-white">
                  BATTLE #{battle.battleNumber}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-bold bg-blue-600/15 text-blue-700 dark:text-blue-300">
                  {battle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black">{battle.title}</h3>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${subtleBg}`}>
              <strong className="font-black text-amber-600 dark:text-amber-400">
                🤔 왜 수험생들이 맨날 헷갈릴까?{' '}
              </strong>
              <span className="font-semibold">{battle.whyConfusing}</span>
            </div>

            {/* 좌우 1:1 VS 대비 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative">
              {/* Left Side */}
              <div
                className={`p-5 sm:p-6 rounded-3xl border-2 space-y-3 ${
                  isNight
                    ? 'bg-blue-950/30 border-blue-700/70'
                    : 'bg-blue-50/70 border-blue-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 border-blue-500/30">
                  <h4 className="text-xl font-black text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{battle.leftSide.label}</span>
                  </h4>
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white">
                    {battle.leftSide.verdictBadge}
                  </span>
                </div>

                <ul className="space-y-2">
                  {battle.leftSide.corePoints.map((pt, idx) => (
                    <li key={idx} className="font-bold leading-relaxed flex items-start gap-2">
                      <span className="text-blue-600 font-black">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`p-3.5 rounded-2xl border mt-2 ${
                    isNight ? 'bg-slate-900 border-blue-800' : 'bg-white border-blue-200'
                  }`}
                >
                  <strong className="font-black text-blue-700 dark:text-blue-300">
                    💡 왜(Why):{' '}
                  </strong>
                  <span className="font-medium">{battle.leftSide.whyReason}</span>
                </div>
              </div>

              {/* Right Side */}
              <div
                className={`p-5 sm:p-6 rounded-3xl border-2 space-y-3 ${
                  isNight
                    ? 'bg-rose-950/30 border-rose-700/70'
                    : 'bg-rose-50/70 border-rose-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 border-rose-500/30">
                  <h4 className="text-xl font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{battle.rightSide.label}</span>
                  </h4>
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                    {battle.rightSide.verdictBadge}
                  </span>
                </div>

                <ul className="space-y-2">
                  {battle.rightSide.corePoints.map((pt, idx) => (
                    <li key={idx} className="font-bold leading-relaxed flex items-start gap-2">
                      <span className="text-rose-600 font-black">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`p-3.5 rounded-2xl border mt-2 ${
                    isNight ? 'bg-slate-900 border-rose-800' : 'bg-white border-rose-200'
                  }`}
                >
                  <strong className="font-black text-rose-700 dark:text-rose-300">
                    💡 왜(Why):{' '}
                  </strong>
                  <span className="font-medium">{battle.rightSide.whyReason}</span>
                </div>
              </div>
            </div>

            {/* 1초 킬팁 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-rose-500/15 border-2 border-amber-500/40 flex items-start gap-2.5">
              <Zap className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <strong className="font-black text-amber-800 dark:text-amber-300">
                  ⚡ 시험장 1초 컷 공식:{' '}
                </strong>
                <span className="font-extrabold">{battle.oneSecKillTip}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
