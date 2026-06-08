import { describe, it, expect } from 'vitest';
import { computeNeisOutput, computeSectionedNeisOutput } from '../cutscore';
import { solveReverse, combineReverseOutputs } from '../reverseSolver';
import type { Item, ItemType, TargetDistribution, Grade } from '../../types';
import { PRESETS } from '../../presets';

const TARGET: TargetDistribution = PRESETS['일반고'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

let counter = 0;
function makeItem(type: ItemType, difficulty: Item['difficulty'], points: number, expectedRate: number): Item {
  counter += 1;
  return { id: `it-${counter}`, number: counter, difficulty, points, expectedRate, type };
}

describe('computeSectionedNeisOutput', () => {
  it('returns null for an empty section', () => {
    const items: Item[] = [
      makeItem('선택형', '보통', 10, 60),
      makeItem('선택형', '어려움', 10, 40),
    ];
    const out = computeSectionedNeisOutput(items, TARGET, { includeE미도달: true });
    expect(out.선택형).not.toBeNull();
    expect(out.서답형).toBeNull();
  });

  it('total cut score = 선택형컷 + 서답형컷 for each boundary', () => {
    const items: Item[] = [
      makeItem('선택형', '쉬움', 20, 80),
      makeItem('선택형', '보통', 30, 60),
      makeItem('선택형', '어려움', 20, 40),
      makeItem('서답형', '보통', 15, 55),
      makeItem('서답형', '어려움', 15, 35),
    ];

    const out = computeSectionedNeisOutput(items, TARGET, { includeE미도달: true });
    expect(out.선택형).not.toBeNull();
    expect(out.서답형).not.toBeNull();

    for (const key of ['AB', 'BC', 'CD', 'DE'] as const) {
      const expected =
        Math.round(((out.선택형!.cutScores[key] ?? 0) + (out.서답형!.cutScores[key] ?? 0)) * 10) / 10;
      expect(out.combinedCutScores[key]).toBeCloseTo(expected, 5);
    }
  });

  it('각 영역 산출은 그 영역 문항만 사용한 단독 계산과 동일', () => {
    const 선택형Items: Item[] = [
      makeItem('선택형', '쉬움', 20, 80),
      makeItem('선택형', '어려움', 20, 40),
    ];
    const 서답형Items: Item[] = [
      makeItem('서답형', '보통', 20, 55),
    ];
    const all = [...선택형Items, ...서답형Items];

    const sectioned = computeSectionedNeisOutput(all, TARGET, { includeE미도달: true });
    const 선택형Alone = computeNeisOutput(선택형Items, TARGET, { includeE미도달: true });
    const 서답형Alone = computeNeisOutput(서답형Items, TARGET, { includeE미도달: true });

    expect(sectioned.선택형!.cutScores.AB).toBe(선택형Alone.cutScores.AB);
    expect(sectioned.서답형!.cutScores.AB).toBe(서답형Alone.cutScores.AB);
  });

  it('미이수기준 = 전체 총점(선택형+서답형) × 40%', () => {
    const items: Item[] = [
      makeItem('선택형', '보통', 60, 60), // 60점
      makeItem('서답형', '보통', 40, 50), // 40점 → 총 100점
    ];
    const out = computeSectionedNeisOutput(items, TARGET, { includeE미도달: true });
    expect(out.combinedCutScores.미이수기준).toBe(40); // 100 × 0.4
  });

  it('untyped 문항은 선택형으로 간주', () => {
    const items: Item[] = [
      { id: 'u1', number: 1, difficulty: '보통', points: 10, expectedRate: 60 }, // no type
    ];
    const out = computeSectionedNeisOutput(items, TARGET, { includeE미도달: true });
    expect(out.선택형).not.toBeNull();
    expect(out.서답형).toBeNull();
  });
});

describe('combineReverseOutputs', () => {
  it('합산 실제컷 = 선택형 실제컷 + 서답형 실제컷, 미이수기준 = 총점 × 40%', () => {
    const 선택형 = solveReverse({
      categoryPoints: { '쉬움': 20, '보통': 30, '어려움': 10 }, // 60점
      desiredCutScores: { A: 48, B: 36, C: 26, D: 16, E: 8 },
    });
    const 서답형 = solveReverse({
      categoryPoints: { '쉬움': 10, '보통': 20, '어려움': 10 }, // 40점
      desiredCutScores: { A: 30, B: 22, C: 16, D: 10, E: 5 },
    });

    const combined = combineReverseOutputs(선택형, 서답형, 100);

    for (const grade of GRADES) {
      const expected =
        Math.round((선택형.actualCutScores[grade] + 서답형.actualCutScores[grade]) * 10) / 10;
      expect(combined.combinedActualCutScores[grade]).toBeCloseTo(expected, 5);
    }
    expect(combined.미이수기준).toBe(40); // 100 × 0.4
  });

  it('영역별 경고에 [선택형]/[서답형] 접두어가 붙는다', () => {
    const 선택형 = solveReverse({
      categoryPoints: { '쉬움': 30, '보통': 40, '어려움': 30 },
      desiredCutScores: { A: 60, B: 45, C: 30, D: 20, E: 10 }, // triggers MINSTD_ABOVE_DE
    });
    const 서답형 = solveReverse({
      categoryPoints: { '쉬움': 10, '보통': 10, '어려움': 10 },
      desiredCutScores: { A: 24, B: 18, C: 12, D: 8, E: 4 },
    });
    const combined = combineReverseOutputs(선택형, 서답형, 130);
    expect(combined.warnings.some((w) => w.message.startsWith('[선택형]'))).toBe(true);
  });
});
