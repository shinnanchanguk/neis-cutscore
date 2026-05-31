export type Difficulty = '쉬움' | '보통' | '어려움';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E';
export type PresetName = '일반고' | '과고_특목고' | '사용자정의';

export interface Item {
  id: string;
  number: number;
  difficulty: Difficulty;
  points: number;
  expectedRate: number; // 0~100
}

export interface TargetDistribution {
  A: number; B: number; C: number; D: number; E: number;
}

export interface ExamMeta {
  school: string;
  subject: string;
  gradeLevel: string;
  examName: string;
}

export interface NeisCell {
  difficulty: Difficulty;
  grade: Grade;
  value: number; // 0~100, multiple of 5
}

export interface CellExplanation {
  category: Difficulty;
  grade: Grade;
  z_k: number;
  items: Array<{ number: number; p_i: number; b_i: number; p_ik: number; points: number }>;
  weightedAvg: number;
  rawPercent: number;
  roundedPercent: number;
}

export interface NeisOutput {
  cells: NeisCell[];
  cutScores: {
    AB: number; BC: number; CD: number; DE: number;
    E미도달?: number;      // 모델 추정 E/미도달 경계 (참고값)
    미이수기준?: number;   // 최소성취수준 고정 기준 = 총점 × 40%
  };
  warnings: Warning[];
}

/** 최소성취수준(미이수/미도달) 고정 기준 비율: 성취율 40% */
export const MIN_STANDARD_RATE = 0.4;

/** 총점 대비 미이수(미도달) 고정 분할점수 = 총점 × 40%, 소수 1자리 */
export function minStandardCut(totalPoints: number): number {
  return Math.round(totalPoints * MIN_STANDARD_RATE * 10) / 10;
}

export interface Warning {
  level: 'info' | 'warning' | 'error';
  code: string;
  message: string;
}

export interface ExamProject {
  meta: ExamMeta;
  targetDistribution: TargetDistribution;
  items: Item[];
  settings: {
    includeE미도달: boolean;
    expectedUnmetRate?: number;
  };
  createdAt: string;
  updatedAt: string;
  version: string;
}
