export type ThemeMode = 'paper' | 'ebook' | 'night';
export type FontScale = 'sm' | 'base' | 'lg' | 'xl'; // 가-(18px) | 기본 큰글씨(20px) | 특대(24px) | 초특대(28px)

export type ActiveTab =
  | 'study'       // 1. 단원별 4단계 왜(Why) 이해 리더 (Module 1~7)
  | 'simulator'   // 2. 내가 대법관이다! 판결 시뮬레이터 (30케이스)
  | 'subway'      // 3. 형사소송 1~9호선 인터랙티브 지하철 노선도
  | 'vs'          // 4. 헷갈리는 쌍둥이 개념 VS 일대일 배틀 도감 (40쌍)
  | 'numbers'     // 5. 숫자·기한·주체 1초 필터 사전 & 플래시카드
  | 'exam';       // 6. 실전 40문항 모의고사 & 2026 승진기출 & 오답 원리 처방전

export interface InlineSegment {
  type: 'text' | 'kw' | 'trap' | 'amended' | 'excluded';
  text: string;
  note?: string;
}

export interface StatuteOrCaseItem {
  id: string;
  badge: '조문' | '규칙/준칙' | '전원합의체' | '핵심판례' | '2026·2027개정' | '시험범위제외참고';
  title: string;
  caseNumber?: string;
  segments: InlineSegment[];
  keyTakeaway: string;
}

export interface InstantOXQuiz {
  id: string;
  sourceBadge: string;
  statement: string;
  answer: 'O' | 'X';
  whyExplanation: string;
  highlightTrap?: string;
}

export interface WhyStudyNode {
  id: string;
  moduleId: string;
  partLabel: string;
  title: string;
  subtitle: string;
  importance: 'S' | 'A' | 'B';
  frequencyBadge: string;
  amendmentAlert?: string;
  exclusionAlert?: string;
  // [1단계: 외계어 1초 번역 & 30초 일상 상황극]
  analogyStory: {
    oneSecTranslation: string;
    characters: string;
    storyDialogue: string[];
    coreMentalPicture: string;
  };
  // [2단계: 왜(Why) 이건 되고(O), 왜 저건 안 될까(X)? — 판사의 속마음 저울]
  whyPrinciple: {
    corePhilosophy: string;
    allowSide: {
      title: string;
      reasonHeadline: string;
      items: { caseTitle: string; because: string }[];
    };
    denySide: {
      title: string;
      reasonHeadline: string;
      items: { caseTitle: string; because: string }[];
    };
    goldenTip: string;
  };
  // [3단계: 김옥현 법령풀이집 스타일 인라인 조문·판례 뷰어]
  statuteAndCases: StatuteOrCaseItem[];
  // [4단계: 방금 이해한 원리로 1초 만에 푸는 실전 기출 즉석 체커]
  instantQuiz: InstantOXQuiz[];
}

// Module 1: 5대 황금원리 & 초보자용 법률 한자어 40선 번역기
export interface LegalTermTranslation {
  id: string;
  term: string;
  hanjaOrOrigin: string;
  category: '총칙·주체' | '소송행위·치유' | '수사·강제처분' | '공소·공판' | '증거법' | '재판·상소·집행';
  oneSecTranslation: string;
  everydayAnalogy: string;
  examTrapPoint: string;
  relatedArticle?: string;
}

export interface GoldenPrinciple {
  id: string;
  number: number;
  title: string;
  oneLineCore: string;
  judgeMindset: string;
  connectedTopics: string[];
  goldenQuote: string;
}

// 4. VS 일대일 배틀 도감 (40대 비교 매트릭스)
export interface VsBattleItem {
  id: string;
  battleNumber: number;
  category: '총칙·소송행위' | '수사·강제처분' | '공소·공판' | '증거법' | '상소·특별절차·집행';
  title: string;
  whyConfusing: string;
  leftSide: {
    label: string;
    verdictBadge: string;
    corePoints: string[];
    whyReason: string;
  };
  rightSide: {
    label: string;
    verdictBadge: string;
    corePoints: string[];
    whyReason: string;
  };
  oneSecKillTip: string;
}

// 5. 숫자·기한·주체 1초 필터 사전 & 플래시카드
export type NumberFilterTag =
  | '즉시/지체없이'
  | '24시간/48시간'
  | '3일/5일'
  | '7일'
  | '10일/14일/20일'
  | '30일/60일/90일'
  | '2개월/3개월/6개월'
  | '1년/3년/5년+'
  | '금액(20만/50만/500만)';

export interface NumberDictionaryEntry {
  id: string;
  filterTag: NumberFilterTag;
  numberBadge: string; // 예: "7일 이내", "48시간 이내", "6개월 이상"
  subjectBadge: string; // 예: "피고인/검사", "법무부장관", "관할 경찰서장"
  targetTopic: string; // 예: "재정신청 기각·공소제기 송부 기한", "체포 후 구속영장 청구 기한"
  articleRef: string;
  ruleSummary: string;
  whyThisNumber: string; // "왜 하필 이 숫자인가?" 입법취지 해설
  examTrap: string; // 예: "(⬄3일 이내×)", "(⬄고등법원×)"
}

// 3. 형사소송 1~9호선 인터랙티브 지하철 노선도
export interface SubwayStationNode {
  id: string;
  stationCode: string; // 예: "1-01", "2-03"
  stationName: string;
  keyDeadlines: string[]; // 예: ["48시간 이내 영장청구", "24시간 이내"]
  coreActor: string; // 예: "검사 · 사법경찰관 · 지방법원 판사"
  oneSecSummary: string;
  whyCorePrinciple: string;
  killerTraps: string[];
  linkedModuleId: string;
  linkedNodeId?: string;
}

export interface SubwayLine {
  lineNumber: number;
  lineName: string;
  colorHex: string;
  badgeClass: string;
  description: string;
  stations: SubwayStationNode[];
}

// 2. "내가 대법관이다!" 왜(Why) 판결 시뮬레이터 (30케이스)
export interface SupremeCourtCaseSimulatorItem {
  id: string;
  caseNumberLabel: string; // 예: "Case #01 · 대법원 2021도1234 전원합의체"
  category: string;
  title: string;
  storySetup: {
    incidentTitle: string;
    characters: string;
    storyParagraphs: string[];
    prosecutorClaim: string;
    defendantClaim: string;
  };
  step1Question: string;
  step1Options: {
    O: string; // 예: "유효 / 적법 / 치유 인정 (O)"
    X: string; // 예: "무효 / 위법 / 치유 부정 (X)"
  };
  correctVerdict: 'O' | 'X';
  step2Question: string;
  step2ReasonOptions: {
    id: 'A' | 'B' | 'C';
    text: string;
  }[];
  correctReasonId: 'A' | 'B' | 'C';
  rulingSummary: {
    gavelHeadline: string;
    supremeCourtMindset: string;
    examKeySentence: string;
    relatedArticleOrCase: string;
  };
}

// 6. 실전 40문항 모의고사 & 2026년 5·7급 기출 복원 & 오답 원리 처방전
export interface ExamChoice {
  num: 1 | 2 | 3 | 4;
  text: string;
  isCorrectAnswer: boolean;
  whyOptionExplanation: string; // 각 선지별 O/X 이유 해설
}

export interface ExamQuestion {
  id: string;
  examSetId: 'past_2026_5th' | 'past_2026_7th' | 'mock_2027_1' | 'mock_2027_2' | 'mock_2027_3';
  questionNumber: number;
  category: string;
  sourceTag: string; // 예: "2026 교정직 5급(교정관) 승진 기출 복원", "2027 교정 6급 실전 모의 제1회"
  questionStem: string; // 예: "형사소송법상 소송행위의 효력과 하자의 치유에 관한 설명으로 가장 적절하지 않은 것은? (다툼이 있는 경우 판례에 의함)"
  choices: [ExamChoice, ExamChoice, ExamChoice, ExamChoice];
  answerNumber: 1 | 2 | 3 | 4;
  prescription: {
    corePrincipleTitle: string;
    whyYouMissedIt: string; // 왜 틀렸을까? 원리 처방전
    oneLineVaccine: string; // 시험장 1초 백신 문장
    relatedModuleId: string;
  };
}

export interface CurriculumModuleMeta {
  id: string;
  moduleNumber: number;
  shortTitle: string;
  fullTitle: string;
  articleRange: string;
  description: string;
  nodeCount: number;
}
