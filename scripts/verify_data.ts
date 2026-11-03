import * as fs from 'fs';
import * as path from 'path';
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

function verify() {
  console.log('=== [2027 교정직 6급 형사소송법 마스터 웹앱] 데이터 전수 검증 시작 ===');

  const dataDir = path.join(process.cwd(), 'src', 'data');
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.ts'));

  // 1. Anti-Laziness 스캔 (TODO / 생략 검출)
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    if (content.includes('// TODO') || content.includes('나머지 추가') || content.includes('생략...')) {
      throw new Error(`[Anti-Laziness 위반] ${file} 내부에 미완성 TODO/생략 주석이 발견되었습니다.`);
    }
  }
  console.log(`✔ 1. Anti-Laziness 스캔 통과 (데이터 모듈 파일 ${files.length}개 내 TODO/생략 0건)`);

  // 2. Module 1 정량 검증
  console.log(`- 5대 황금원리: ${goldenPrinciples.length}개`);
  console.log(`- 초보자용 법률 한자어 사전: ${legalTermsDictionary.length}개`);
  console.log(`- VS 일대일 배틀 도감: ${vsBattleMatrix.length}쌍`);
  console.log(`- 숫자·기한·주체 사전: ${numberDictionary.length}개`);

  if (goldenPrinciples.length < 5) throw new Error('5대 황금원리 수량 부족');
  if (legalTermsDictionary.length < 40) throw new Error(`법률 한자어 사전 40선 미달 (${legalTermsDictionary.length})`);
  if (vsBattleMatrix.length < 40) throw new Error(`VS 배틀 도감 40쌍 미달 (${vsBattleMatrix.length})`);
  if (numberDictionary.length < 60) throw new Error(`숫자 사전 60개 미달 (${numberDictionary.length})`);

  // 3. Module 1~7 WhyStudyNode 검증
  const allNodes = [
    ...module1StudyNodes,
    ...module2StudyNodes,
    ...module3StudyNodes,
    ...module4StudyNodes,
    ...module5StudyNodes,
    ...module6StudyNodes,
    ...module7StudyNodes,
  ];
  const totalStatuteCases = allNodes.reduce((acc, n) => acc + n.statuteAndCases.length, 0);
  const totalInstantOX = allNodes.reduce((acc, n) => acc + n.instantQuiz.length, 0);

  console.log(`- 단원별 4단계 Why 학습 노드 총계: ${allNodes.length}개 단원`);
  console.log(`- 인라인 조문·판례 카드(statuteAndCases) 총계: ${totalStatuteCases}개`);
  console.log(`- 단원별 즉석 기출 OX 지문(instantQuiz) 총계: ${totalInstantOX}문항`);

  // 4. Module 8 검증 (지하철 9노선, 대법관 30케이스, 모의고사·기출 문항)
  console.log(`- 지하철 노선도: ${subwayLines.length}개 노선`);
  console.log(`- 내가 대법관이다 시뮬레이터: ${supremeCourtCases.length}케이스`);

  const mock1 = examQuestions.filter((q) => q.examSetId === 'mock_2027_1');
  const mock2 = examQuestions.filter((q) => q.examSetId === 'mock_2027_2');
  const mock3 = examQuestions.filter((q) => q.examSetId === 'mock_2027_3');
  const past5 = examQuestions.filter((q) => q.examSetId === 'past_2026_5th');
  const past7 = examQuestions.filter((q) => q.examSetId === 'past_2026_7th');

  console.log(
    `- 4지선다 문제은행 총계: ${examQuestions.length}문항 (모의1회: ${mock1.length}, 모의2회: ${mock2.length}, 모의3회: ${mock3.length}, 2026 5급기출: ${past5.length}, 2026 7급기출: ${past7.length})`
  );

  if (subwayLines.length !== 9) throw new Error(`지하철 노선도 9호선 미달 (${subwayLines.length})`);
  if (supremeCourtCases.length < 30) throw new Error(`대법관 시뮬레이터 30케이스 미달 (${supremeCourtCases.length})`);
  if (mock1.length !== 40 || mock2.length !== 40 || mock3.length !== 40) {
    throw new Error(`실전 모의고사 40문항 기준 미충족 (1회:${mock1.length}, 2회:${mock2.length}, 3회:${mock3.length})`);
  }

  console.log('=== 모든 데이터 무결성 및 정량 검증 100% 통과! ===');
}

verify();
