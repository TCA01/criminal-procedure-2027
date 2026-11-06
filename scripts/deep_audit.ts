import {
  goldenPrinciples,
  legalTermsDictionary,
  module1StudyNodes,
  numberDictionary,
  vsBattleMatrix,
} from '../src/data/module1_principles_and_terms';
import { module2StudyNodes } from '../src/data/module2_part1_court_and_subjects';
import { module3StudyNodes } from '../src/data/module3_part1_acts_and_defects';
import { module4StudyNodes } from '../src/data/module4_part2_investigation';
import { module5StudyNodes } from '../src/data/module5_part2_indictment_and_trial';
import { module6StudyNodes } from '../src/data/module6_part2_evidence_and_verdict';
import { module7StudyNodes } from '../src/data/module7_part3_4_5_appeal_and_execution';
import {
  examQuestions,
  subwayLines,
  supremeCourtCases,
} from '../src/data/module8_exam_bank_and_simulator';

function runDeepAudit() {
  console.log('=== [형사소송법 2027] 스크립트 및 데이터 심층 감사 (Deep Audit) 시작 ===\n');

  const allStudyNodes = [
    ...module1StudyNodes,
    ...module2StudyNodes,
    ...module3StudyNodes,
    ...module4StudyNodes,
    ...module5StudyNodes,
    ...module6StudyNodes,
    ...module7StudyNodes,
  ];

  let errorCount = 0;
  let warnCount = 0;

  // 1. 단원 ID 고유성 검사
  const nodeIds = new Set<string>();
  allStudyNodes.forEach((node, idx) => {
    if (nodeIds.has(node.id)) {
      console.error(`[ERR] 중복된 StudyNode ID 발견: ${node.id} (인덱스 ${idx})`);
      errorCount++;
    }
    nodeIds.add(node.id);
  });
  console.log(`[OK] 전체 56개 단원 ID 고유성 확인 완료 (${nodeIds.size}개)`);

  // 2. 단원 내부 4단계 구조 정밀 검사
  allStudyNodes.forEach((node) => {
    // 1단계 상황극
    if (!node.analogyStory.oneSecTranslation || node.analogyStory.oneSecTranslation.trim() === '') {
      console.error(`[ERR] ${node.id}: 1초 번역(oneSecTranslation) 누락`);
      errorCount++;
    }
    if (!node.analogyStory.storyDialogue || node.analogyStory.storyDialogue.length === 0) {
      console.error(`[ERR] ${node.id}: 상황극 대화(storyDialogue) 누락`);
      errorCount++;
    }

    // 2단계 왜(Why) 원리
    if (!node.whyPrinciple.corePhilosophy || node.whyPrinciple.corePhilosophy.trim() === '') {
      console.error(`[ERR] ${node.id}: 왜 원리 핵심 철학 누락`);
      errorCount++;
    }
    if (!node.whyPrinciple.allowSide.items || node.whyPrinciple.allowSide.items.length === 0) {
      console.error(`[ERR] ${node.id}: 인정(O) 항목 리스트 누락`);
      errorCount++;
    }
    if (!node.whyPrinciple.denySide.items || node.whyPrinciple.denySide.items.length === 0) {
      console.error(`[ERR] ${node.id}: 부정(X) 항목 리스트 누락`);
      errorCount++;
    }

    // 3단계 조문·판례
    if (!node.statuteAndCases || node.statuteAndCases.length === 0) {
      console.error(`[ERR] ${node.id}: statuteAndCases 항목 누락`);
      errorCount++;
    } else {
      node.statuteAndCases.forEach((sc, i) => {
        if (!sc.title || sc.title.trim() === '') {
          console.error(`[ERR] ${node.id} sc[${i}]: title 누락`);
          errorCount++;
        }
        if (!sc.segments || sc.segments.length === 0) {
          console.error(`[ERR] ${node.id} sc[${i}]: segments 누락`);
          errorCount++;
        }
      });
    }

    // 4단계 즉석 OX 퀴즈
    if (!node.instantQuiz || node.instantQuiz.length === 0) {
      console.error(`[ERR] ${node.id}: instantQuiz 항목 누락`);
      errorCount++;
    } else {
      node.instantQuiz.forEach((q, i) => {
        if (q.answer !== 'O' && q.answer !== 'X') {
          console.error(`[ERR] ${node.id} quiz[${i}]: 유효하지 않은 정답 (${q.answer})`);
          errorCount++;
        }
        if (!q.whyExplanation || q.whyExplanation.trim() === '') {
          console.error(`[ERR] ${node.id} quiz[${i}]: 해설 누락`);
          errorCount++;
        }
      });
    }
  });

  // 3. 4지선다 150문항 검사
  const examIds = new Set<string>();
  const validModuleIds = new Set(['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']);

  examQuestions.forEach((q, idx) => {
    if (examIds.has(q.id)) {
      console.error(`[ERR] 중복된 ExamQuestion ID 발견: ${q.id} (인덱스 ${idx})`);
      errorCount++;
    }
    examIds.add(q.id);

    if (![1, 2, 3, 4].includes(q.answerNumber)) {
      console.error(`[ERR] 문제 ${q.id}: 잘못된 정답 번호 (${q.answerNumber})`);
      errorCount++;
    }
    if (!q.choices || q.choices.length !== 4) {
      console.error(`[ERR] 문제 ${q.id}: 보기가 4개가 아님 (${q.choices?.length})`);
      errorCount++;
    } else {
      const correctChoice = q.choices.find((c) => c.num === q.answerNumber);
      if (!correctChoice || !correctChoice.isCorrectAnswer) {
        console.error(`[ERR] 문제 ${q.id}: answerNumber(${q.answerNumber})와 choice의 isCorrectAnswer 불일치`);
        errorCount++;
      }
    }
    if (!q.prescription.whyYouMissedIt || q.prescription.whyYouMissedIt.trim() === '') {
      console.error(`[ERR] 문제 ${q.id}: 처방전 whyYouMissedIt 누락`);
      errorCount++;
    }
    if (!q.prescription.oneLineVaccine || q.prescription.oneLineVaccine.trim() === '') {
      console.error(`[ERR] 문제 ${q.id}: 처방전 oneLineVaccine 누락`);
      errorCount++;
    }
    if (!validModuleIds.has(q.prescription.relatedModuleId)) {
      console.warn(`[WARN] 문제 ${q.id}: 처방전 relatedModuleId (${q.prescription.relatedModuleId}) 비정상`);
      warnCount++;
    }
  });
  console.log(`[OK] 150문항 4지선다 정답/보기 형식 검증 완료 (${examIds.size}문항)`);

  // 4. 대법관 시뮬레이터 30선 검사
  supremeCourtCases.forEach((c) => {
    if (c.correctVerdict !== 'O' && c.correctVerdict !== 'X') {
      console.error(`[ERR] 대법관 시뮬레이터 ${c.id}: 잘못된 결단 (${c.correctVerdict})`);
      errorCount++;
    }
    if (!c.step2ReasonOptions || c.step2ReasonOptions.length !== 3) {
      console.error(`[ERR] 대법관 시뮬레이터 ${c.id}: 이유 옵션이 3개가 아님`);
      errorCount++;
    }
    if (!['A', 'B', 'C'].includes(c.correctReasonId)) {
      console.error(`[ERR] 대법관 시뮬레이터 ${c.id}: 잘못된 이유 ID (${c.correctReasonId})`);
      errorCount++;
    }
    if (!c.rulingSummary.examKeySentence || c.rulingSummary.examKeySentence.trim() === '') {
      console.error(`[ERR] 대법관 시뮬레이터 ${c.id}: examKeySentence 누락`);
      errorCount++;
    }
  });
  console.log(`[OK] 대법관 시뮬레이터 30선 정밀 검증 완료 (${supremeCourtCases.length}케이스)`);

  // 5. 지하철 노선도 9선 검사
  subwayLines.forEach((line) => {
    line.stations.forEach((st) => {
      if (st.nodeId && !nodeIds.has(st.nodeId)) {
        console.warn(`[WARN] 지하철 노선 ${line.lineNumber}호선 역 [${st.name}]: 단원 ID(${st.nodeId}) 매칭 없음`);
        warnCount++;
      }
    });
  });
  console.log(`[OK] 지하철 노선도 9선 정밀 검증 완료 (${subwayLines.length}호선)`);

  // 6. 40쌍 VS 배틀 도감 검사
  vsBattleMatrix.forEach((battle) => {
    if (!battle.leftSide.label || !battle.rightSide.label) {
      console.error(`[ERR] VS 배틀 ${battle.id}: 개념 라벨 누락`);
      errorCount++;
    }
    if (!battle.oneSecKillTip || battle.oneSecKillTip.trim() === '') {
      console.error(`[ERR] VS 배틀 ${battle.id}: 1초 킬러팁 누락`);
      errorCount++;
    }
  });
  console.log(`[OK] 40쌍 VS 일대일 배틀 도감 정밀 검증 완료 (${vsBattleMatrix.length}쌍)`);

  // 7. 숫자·기한 사전 검사
  numberDictionary.forEach((entry) => {
    if (!entry.numberBadge || entry.numberBadge.trim() === '') {
      console.error(`[ERR] 숫자사전 ${entry.id}: numberBadge 누락`);
      errorCount++;
    }
    if (!entry.whyThisNumber || entry.whyThisNumber.trim() === '') {
      console.error(`[ERR] 숫자사전 ${entry.id}: whyThisNumber 누락`);
      errorCount++;
    }
  });
  console.log(`[OK] 숫자·기한 사전 65선 정밀 검증 완료 (${numberDictionary.length}개)`);

  console.log(`\n=== 심층 감사 최종 집계 ===`);
  console.log(`- 치명적 오류 (Errors): ${errorCount}건`);
  console.log(`- 경고 (Warnings): ${warnCount}건`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

runDeepAudit();
