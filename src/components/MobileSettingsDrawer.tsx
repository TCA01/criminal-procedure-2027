import React from 'react';
import { X, Sun, BookMarked, Moon, Type, Sparkles } from 'lucide-react';
import { FontScale, ThemeMode } from '../types/criminal';

interface MobileSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const MobileSettingsDrawer: React.FC<MobileSettingsDrawerProps> = ({
  isOpen,
  onClose,
  fontScale,
  setFontScale,
  themeMode,
  setThemeMode,
}) => {
  if (!isOpen) return null;

  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const fontOptions: { key: FontScale; label: string; px: string; desc: string }[] = [
    { key: 'sm', label: '18px', px: '18px', desc: '작은 글씨 (일반 본문)' },
    { key: 'base', label: '20px', px: '20px', desc: '기본 큰글씨 (추천)' },
    { key: 'lg', label: '24px', px: '24px', desc: '특대 큰글씨 (피로 해소)' },
    { key: 'xl', label: '28px', px: '28px', desc: '초특대 (시원한 시야)' },
  ];

  const themeOptions: { key: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'paper', label: '종이책 라이트', icon: <Sun className="w-5 h-5 text-amber-500" />, desc: '선명하고 깨끗한 백색' },
    { key: 'ebook', label: '미색 이북', icon: <BookMarked className="w-5 h-5 text-amber-700" />, desc: '눈부심 없는 따뜻한 종이 질감' },
    { key: 'night', label: '야간 당직 다크', icon: <Moon className="w-5 h-5 text-indigo-400" />, desc: '어두운 야간 근무 최적화' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl p-6 transition-all ${
          isNight
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : isEbook
            ? 'bg-[#fcf8f0] border-[#d8cbbb] text-[#1e1b18]'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <h3 className="font-black text-lg tracking-tight">보기 설정 (글자·화면)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 글자 크기 선택 */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>노안·피로 제로 큰글씨 크기</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {fontOptions.map((opt) => {
              const active = fontScale === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setFontScale(opt.key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                      : isNight
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700/80'
                      : isEbook
                      ? 'bg-[#f4ebd8] border-[#dac9b3] hover:bg-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-black text-base">{opt.label}</div>
                  <div className={`text-[11px] mt-0.5 ${active ? 'text-blue-100' : 'opacity-70'}`}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 테마 모드 선택 */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-black text-blue-600 dark:text-blue-400">3대 눈 보호 화면 테마</div>
          <div className="space-y-2">
            {themeOptions.map((opt) => {
              const active = themeMode === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setThemeMode(opt.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                      : isNight
                      ? 'bg-slate-800 border-slate-700 hover:bg-slate-700/80'
                      : isEbook
                      ? 'bg-[#f4ebd8] border-[#dac9b3] hover:bg-white'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {opt.icon}
                    <div className="text-left">
                      <div className="font-black text-sm">{opt.label}</div>
                      <div className={`text-[11px] ${active ? 'text-blue-100' : 'opacity-70'}`}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                  {active && <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/20">적용됨</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800 font-extrabold text-sm shadow hover:opacity-90 transition-opacity"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
