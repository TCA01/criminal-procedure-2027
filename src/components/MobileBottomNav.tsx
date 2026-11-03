import React from 'react';
import {
  BookOpen,
  Scale,
  Train,
  Swords,
  Hash,
  FileCheck2,
} from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types/criminal';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  wrongNoteCount: number;
  themeMode: ThemeMode;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  wrongNoteCount,
  themeMode,
}) => {
  const isNight = themeMode === 'night';
  const isEbook = themeMode === 'ebook';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'study',
      label: '단원학습',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'simulator',
      label: '대법관',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'subway',
      label: '노선도',
      icon: <Train className="w-5 h-5" />,
    },
    {
      id: 'vs',
      label: 'VS배틀',
      icon: <Swords className="w-5 h-5" />,
    },
    {
      id: 'numbers',
      label: '숫자사전',
      icon: <Hash className="w-5 h-5" />,
    },
    {
      id: 'exam',
      label: '모의고사',
      icon: <FileCheck2 className="w-5 h-5" />,
      badge: wrongNoteCount > 0 ? wrongNoteCount : undefined,
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-xl transition-colors shadow-lg ${
        isNight
          ? 'bg-slate-900/95 border-slate-800 text-slate-300'
          : isEbook
          ? 'bg-[#f4ebd8]/95 border-[#d6c7b0] text-[#2c2620]'
          : 'bg-white/95 border-slate-200 text-slate-700'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-6 h-14 items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center leading-none">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
