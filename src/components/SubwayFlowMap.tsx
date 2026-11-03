import React, { useState } from 'react';
import {
  Train,
  Clock,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SubwayLine, SubwayStationNode, ThemeMode } from '../types/criminal';

interface SubwayFlowMapProps {
  lines: SubwayLine[];
  themeMode: ThemeMode;
  onJumpToModule: (moduleId: string, nodeId?: string) => void;
}

export const SubwayFlowMap: React.FC<SubwayFlowMapProps> = ({
  lines,
  themeMode,
  onJumpToModule,
}) => {
  const [selectedLineNum, setSelectedLineNum] = useState<number>(1);
  const [selectedStation, setSelectedStation] = useState<SubwayStationNode | null>(
    lines[0]?.stations[0] || null
  );

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const currentLine = lines.find((l) => l.lineNumber === selectedLineNum) || lines[0];

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
      {/* 상단 노선 선택 컨트롤 */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm space-y-5 ${cardBg}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-md">
              <Train className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-teal-500/20 text-teal-700 dark:text-teal-300">
                <Sparkles className="w-3.5 h-3.5" />
                수사 개시부터 재판의 집행까지 전 절차 9호선 한눈에 보기
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                🚇 형사소송 전 절차 인터랙티브 지하철 노선도 (Flow Map)
              </h2>
              <p className="text-sm opacity-80 font-medium">
                노선(1호선~9호선)과 역(Station)을 클릭하면 해당 절차의 핵심 기한, 주체, 왜(Why) 원리와 출제 함정이 즉시 펼쳐집니다!
              </p>
            </div>
          </div>
        </div>

        {/* 1호선 ~ 9호선 탭 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {lines.map((line) => {
            const active = line.lineNumber === selectedLineNum;
            return (
              <button
                key={line.lineNumber}
                onClick={() => {
                  setSelectedLineNum(line.lineNumber);
                  setSelectedStation(line.stations[0] || null);
                }}
                style={{
                  borderColor: active ? line.colorHex : undefined,
                  backgroundColor: active ? line.colorHex : undefined,
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  active
                    ? 'text-white shadow-md scale-[1.02]'
                    : `${subtleBg} hover:scale-[1.01]`
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.22)' : line.colorHex }}
                    className="px-2 py-0.5 rounded-full text-xs font-black text-white"
                  >
                    {line.lineNumber}호선
                  </span>
                  <span className="text-xs font-bold opacity-80">{line.stations.length}개 역</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base mt-1.5 leading-snug">
                  {line.lineName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 노선 다이어그램 & 역 상세 카드 */}
      {currentLine && (
        <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-md space-y-8 ${cardBg}`}>
          {/* 노선 헤더 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-current/10">
            <div className="flex items-center gap-3">
              <span
                style={{ backgroundColor: currentLine.colorHex }}
                className="px-4 py-1.5 rounded-full text-base font-black text-white shadow-sm"
              >
                {currentLine.lineNumber}호선
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">{currentLine.lineName}</h3>
                <p className="text-sm opacity-80 font-medium">{currentLine.description}</p>
              </div>
            </div>
          </div>

          {/* 지하철 노선 트랙 (수평/반응형 그리드 연결) */}
          <div className="relative">
            <div
              style={{ backgroundColor: currentLine.colorHex }}
              className="hidden lg:block absolute top-10 left-8 right-8 h-3 rounded-full opacity-35"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {currentLine.stations.map((st, idx) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    style={{
                      borderColor: isSelected ? currentLine.colorHex : undefined,
                    }}
                    className={`p-4 rounded-3xl border-4 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? isNight
                          ? 'bg-slate-800 shadow-xl scale-[1.03]'
                          : 'bg-white shadow-xl scale-[1.03]'
                        : `${subtleBg} opacity-90 hover:opacity-100`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          style={{ backgroundColor: currentLine.colorHex }}
                          className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                        >
                          역 {st.stationCode}
                        </span>
                        <span className="text-xs font-extrabold opacity-70">STEP {idx + 1}</span>
                      </div>
                      <h4 className="font-black text-lg leading-snug mb-2">{st.stationName}</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {st.keyDeadlines.map((dl, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black bg-blue-600/15 text-blue-700 dark:text-blue-300"
                          >
                            <Clock className="w-3 h-3" />
                            {dl}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs font-bold opacity-80 pt-2 border-t border-current/10">
                      주체: {st.coreActor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 역(Station) 심층 브리핑 패널 */}
          {selectedStation && (
            <div
              style={{ borderColor: currentLine.colorHex }}
              className={`p-6 sm:p-8 rounded-3xl border-4 space-y-6 ${subtleBg}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-current/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      style={{ backgroundColor: currentLine.colorHex }}
                      className="px-3 py-1 rounded-lg text-xs font-black text-white"
                    >
                      {currentLine.lineNumber}호선 · {selectedStation.stationCode}역
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black bg-indigo-600/15 text-indigo-700 dark:text-indigo-300">
                      <UserCheck className="w-3.5 h-3.5" />
                      핵심 주체: {selectedStation.coreActor}
                    </span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black">{selectedStation.stationName}</h4>
                </div>

                <button
                  onClick={() =>
                    onJumpToModule(selectedStation.linkedModuleId, selectedStation.linkedNodeId)
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm sm:text-base bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>이 절차의 4단계 왜(Why) 본문 카드로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 핵심 기한 배지 모음 */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm mr-1">⏱️ 필수 암기 기한·숫자:</span>
                {selectedStation.keyDeadlines.map((dl, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl font-black text-sm bg-blue-600 text-white shadow-sm"
                  >
                    {dl}
                  </span>
                ))}
              </div>

              {/* 1초 요약 & 왜(Why) 핵심 원리 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div
                  className={`p-5 rounded-2xl border ${
                    isNight ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <strong className="font-black text-blue-600 dark:text-blue-400 block mb-1.5">
                    ⚡ 이 역(절차)의 1초 핵심 요약
                  </strong>
                  <p className="font-bold leading-relaxed">{selectedStation.oneSecSummary}</p>
                </div>

                <div
                  className={`p-5 rounded-2xl border ${
                    isNight ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <strong className="font-black text-emerald-600 dark:text-emerald-400 block mb-1.5">
                    ⚖️ 왜(Why) 법이 이렇게 설계되었을까?
                  </strong>
                  <p className="font-bold leading-relaxed">{selectedStation.whyCorePrinciple}</p>
                </div>
              </div>

              {/* 출제자 킬러 함정 리스트 */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span>🚨 이 역에서 수험생이 가장 많이 빠지는 출제 함정</span>
                </div>
                <ul className="space-y-2">
                  {selectedStation.killerTraps.map((trap, tIdx) => (
                    <li key={tIdx} className="font-extrabold leading-relaxed flex items-start gap-2">
                      <span className="text-rose-600 font-black">•</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
