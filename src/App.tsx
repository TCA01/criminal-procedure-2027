import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveTab,
  CurriculumModuleMeta,
  FontScale,
  ThemeMode,
  WhyStudyNode,
} from './types/criminal';
import { ZenHeader } from './components/ZenHeader';
import { ZenStudyView } from './components/ZenStudyView';
import { ZenDrawer } from './components/ZenDrawer';
import { InstallAppModal } from './components/InstallAppModal';

import { SupremeCourtSimulator } from './components/SupremeCourtSimulator';
import { SubwayFlowMap } from './components/SubwayFlowMap';
import { VsBattleMatrixView } from './components/VsBattleMatrixView';
import { NumberDictionaryView } from './components/NumberDictionaryView';
import { MockExamAndPrescriptionView } from './components/MockExamAndPrescriptionView';

import {
  goldenPrinciples,
  legalTermsDictionary,
  module1StudyNodes,
  numberDictionary,
  vsBattleMatrix,
} from './data/module1_principles_and_terms';
import { module2StudyNodes } from './data/module2_part1_court_and_subjects';
import { module3StudyNodes } from './data/module3_part1_acts_and_defects';
import { module4StudyNodes } from './data/module4_part2_investigation';
import { module5StudyNodes } from './data/module5_part2_indictment_and_trial';
import { module6StudyNodes } from './data/module6_part2_evidence_and_verdict';
import { module7StudyNodes } from './data/module7_part3_4_5_appeal_and_execution';
import {
  examQuestions,
  subwayLines,
  supremeCourtCases,
} from './data/module8_exam_bank_and_simulator';

const STORAGE_KEYS = {
  FONT_SCALE: 'crim2027_font_scale',
  THEME_MODE: 'crim2027_theme_mode',
  BOOKMARKS: 'crim2027_bookmarked_nodes',
  WRONG_NOTES: 'crim2027_wrong_questions',
  NODE_INDEX: 'crim2027_node_index',
  STEP_INDEX: 'crim2027_step_index',
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  // All 56 study nodes
  const allStudyNodes: WhyStudyNode[] = useMemo(
    () => [
      ...module1StudyNodes,
      ...module2StudyNodes,
      ...module3StudyNodes,
      ...module4StudyNodes,
      ...module5StudyNodes,
      ...module6StudyNodes,
      ...module7StudyNodes,
    ],
    []
  );

  // 7대 모듈 메타
  const modulesMeta: CurriculumModuleMeta[] = useMemo(
    () => [
      {
        id: 'module1',
        moduleNumber: 1,
        shortTitle: '5대 황금원리 & 법률용어 40선',
        fullTitle: 'Module 1: 형사소송법 5대 황금원리 + 법률 한자어 40선 번역기',
        articleRange: '입문·핵심원리',
        description: `5대 원리 카드 + 한자어 40선 사전`,
        nodeCount: module1StudyNodes.length,
      },
      {
        id: 'module2',
        moduleNumber: 2,
        shortTitle: '총칙① 법원·피고인·변호인',
        fullTitle: 'Module 2: 법원 관할, 제척·기피(전심관여), 성명모용 vs 위장출석, 변호인 대리권·국선변호',
        articleRange: '제1조~제36조',
        description: `관할·전심관여·성명모용 (${module2StudyNodes.length}단원)`,
        nodeCount: module2StudyNodes.length,
      },
      {
        id: 'module3',
        moduleNumber: 3,
        shortTitle: '총칙② 하자치유·송달·구속·보석',
        fullTitle: 'Module 3: 소송행위 하자의 치유, 배타적 증명력, 재소자 특칙, 구속기간·보석',
        articleRange: '제37조~제194조의5',
        description: `하자치유·재소자특칙·보석 (${module3StudyNodes.length}단원)`,
        nodeCount: module3StudyNodes.length,
      },
      {
        id: 'module4',
        moduleNumber: 4,
        shortTitle: '수사·체포구속·압수수색',
        fullTitle: 'Module 4: 함정수사, 친고죄 고소불가분, 체포 3유형, 영장전 대면조사, 적부심, 전자정보압수',
        articleRange: '제195조~제245조의10',
        description: `고소·체포구속·적부심·전자정보 (${module4StudyNodes.length}단원)`,
        nodeCount: module4StudyNodes.length,
      },
      {
        id: 'module5',
        moduleNumber: 5,
        shortTitle: '공소·재정신청(2027개정)·공판',
        fullTitle: 'Module 5: 재정신청(지방법원 본원 합의부!), 공소장일본주의, 공소시효, 공소장변경',
        articleRange: '제246조~제306조',
        description: `재정신청개정·공소시효·공소장변경 (${module5StudyNodes.length}단원)`,
        nodeCount: module5StudyNodes.length,
      },
      {
        id: 'module6',
        moduleNumber: 6,
        shortTitle: '증거법(312조3항 일원화)·재판',
        fullTitle: 'Module 6: 위수증, 자백배제, 전문법칙(피신조서 내용인정 일원화), 보강·탄핵, 기판력',
        articleRange: '제307조~제337조',
        description: `피신조서내용인정일원화·보강·탄핵 (${module6StudyNodes.length}단원)`,
        nodeCount: module6StudyNodes.length,
      },
      {
        id: 'module7',
        moduleNumber: 7,
        shortTitle: '상소·비상구제·재판집행',
        fullTitle: 'Module 7: 불이익변경금지, 준항고, 재심·비상상고, 약식·즉결, 제5편 재판의 집행',
        articleRange: '제338조~제493조',
        description: `상소·약식즉결·재판집행 (${module7StudyNodes.length}단원)`,
        nodeCount: module7StudyNodes.length,
      },
    ],
    []
  );

  // 현재 단원 및 단계 인덱스 (이전 학습 위치 자동 복원)
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NODE_INDEX);
    const num = saved ? parseInt(saved, 10) : 0;
    return isNaN(num) || num < 0 || num >= allStudyNodes.length ? 0 : num;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEP_INDEX);
    const num = saved ? parseInt(saved, 10) : 0;
    return isNaN(num) || num < 0 || num > 3 ? 0 : num;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NODE_INDEX, currentNodeIndex.toString());
  }, [currentNodeIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEP_INDEX, currentStepIndex.toString());
  }, [currentStepIndex]);

  // 글자 크기 (기본: 20px 큰글씨)
  const [fontScale, setFontScale] = useState<FontScale>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SCALE) as FontScale | null;
    return saved || 'base';
  });

  // 테마 (화지 미색 paper / 수묵 숯빛 night)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode | null;
    return saved || 'paper';
  });

  // 북마크 & 오답노트
  const [bookmarkedNodeIds, setBookmarkedNodeIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WRONG_NOTES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SCALE, fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedNodeIds));
  }, [bookmarkedNodeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WRONG_NOTES, JSON.stringify(wrongQuestionIds));
  }, [wrongQuestionIds]);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
      }
      setDeferredPrompt(null);
    }
  };

  const currentNode = allStudyNodes[currentNodeIndex];

  const toggleBookmarkNode = (id: string) => {
    setBookmarkedNodeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCycleFontScale = () => {
    const scales: FontScale[] = ['sm', 'base', 'lg', 'xl'];
    const nextIdx = (scales.indexOf(fontScale) + 1) % scales.length;
    setFontScale(scales[nextIdx]);
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'night' ? 'paper' : 'night'));
  };

  const handleSelectNodeById = (nodeId: string) => {
    const idx = allStudyNodes.findIndex((n) => n.id === nodeId);
    if (idx !== -1) {
      setCurrentNodeIndex(idx);
      setCurrentStepIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevNode = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextNode = () => {
    if (currentNodeIndex < allStudyNodes.length - 1) {
      setCurrentNodeIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const themeClass =
    themeMode === 'night'
      ? 'theme-zen-dark bg-[#121212] text-[#EDEAE3]'
      : 'theme-zen-light bg-[#FAF7F2] text-[#181818]';

  const fontScaleClass = `font-scale-${fontScale}`;

  return (
    <div className={`min-h-screen transition-colors ${themeClass} ${fontScaleClass} flex flex-col`}>
      {/* 1. 일본 이키 & 젠 스타일 극소 상단 헤더 */}
      <ZenHeader
        currentNode={currentNode}
        currentStepIndex={currentStepIndex}
        totalSteps={4}
        activeTab={activeTab}
        onOpenMenu={() => setIsDrawerOpen(true)}
        fontScale={fontScale}
        onChangeFontScale={handleCycleFontScale}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        isBookmarked={currentNode ? bookmarkedNodeIds.includes(currentNode.id) : false}
        onToggleBookmark={() => currentNode && toggleBookmarkNode(currentNode.id)}
      />

      {/* 2. 본문 영역 (단일 지문/이야기 집중 뷰) */}
      <div className="flex-1">
        {activeTab === 'study' && currentNode && (
          <ZenStudyView
            node={currentNode}
            nodeIndex={currentNodeIndex}
            totalNodes={allStudyNodes.length}
            stepIndex={currentStepIndex}
            setStepIndex={setCurrentStepIndex}
            onPrevNode={handlePrevNode}
            onNextNode={handleNextNode}
            themeMode={themeMode}
          />
        )}

        {/* 대법관 시뮬레이터 30선 */}
        {activeTab === 'simulator' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <SupremeCourtSimulator
              cases={supremeCourtCases}
              themeMode={themeMode}
              searchQuery=""
            />
          </div>
        )}

        {/* 형사소송 1~9호선 지하철 노선도 */}
        {activeTab === 'subway' && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <SubwayFlowMap
              lines={subwayLines}
              themeMode={themeMode}
              onJumpToModule={(modId: string) => {
                setActiveTab('study');
                const modNode = allStudyNodes.find((n) => n.moduleId === modId);
                if (modNode) handleSelectNodeById(modNode.id);
              }}
            />
          </div>
        )}

        {/* 40쌍 VS 일대일 배틀 도감 */}
        {activeTab === 'vs' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <VsBattleMatrixView
              battles={vsBattleMatrix}
              themeMode={themeMode}
              searchQuery=""
            />
          </div>
        )}

        {/* 숫자·기한·주체 사전 */}
        {activeTab === 'numbers' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <NumberDictionaryView
              entries={numberDictionary}
              themeMode={themeMode}
              searchQuery=""
            />
          </div>
        )}

        {/* 40문항 실전 모의고사 & 처방전 */}
        {activeTab === 'exam' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <MockExamAndPrescriptionView
              questions={examQuestions}
              themeMode={themeMode}
              wrongQuestionIds={wrongQuestionIds}
              addWrongQuestionId={(id) => setWrongQuestionIds((p) => (p.includes(id) ? p : [...p, id]))}
              removeWrongQuestionId={(id) => setWrongQuestionIds((p) => p.filter((x) => x !== id))}
              clearWrongQuestions={() => setWrongQuestionIds([])}
              onJumpToModule={(modId: string) => {
                setActiveTab('study');
                const modNode = allStudyNodes.find((n) => n.moduleId === modId);
                if (modNode) handleSelectNodeById(modNode.id);
              }}
              searchQuery=""
            />
          </div>
        )}
      </div>

      {/* 3. 붉은 인주 낙관 메뉴 서랍 (단원 목차 & 모드 전환) */}
      <ZenDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        modulesMeta={modulesMeta}
        allNodes={allStudyNodes}
        currentNodeId={currentNode ? currentNode.id : ''}
        onSelectNode={handleSelectNodeById}
        wrongNoteCount={wrongQuestionIds.length}
        themeMode={themeMode}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* 스마트폰 앱 설치(PWA) 안내 모달 */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        themeMode={themeMode}
        deferredPrompt={deferredPrompt}
        onInstallClick={handleInstallClick}
        isStandalone={isStandalone}
      />
    </div>
  );
};

export default App;
