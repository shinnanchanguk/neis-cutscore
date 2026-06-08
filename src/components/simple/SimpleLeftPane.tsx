import React from 'react';
import { DesignSection } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useSimpleStore } from '@/store/simpleStore';
import { useExamStore } from '@/store/examStore';
import { SplitToggle } from '@/components/shared/SplitToggle';
import type { Difficulty, Grade } from '@/lib/types';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: '쉬움', label: '쉬움' },
  { key: '보통', label: '보통' },
  { key: '어려움', label: '어려움' },
];

const GRADES: { key: Grade; label: string }[] = [
  { key: 'A', label: 'A' },
  { key: 'B', label: 'B' },
  { key: 'C', label: 'C' },
  { key: 'D', label: 'D' },
  { key: 'E', label: 'E' },
];

function displayValue(n: number): string {
  return n === 0 ? '' : String(n);
}

function parseNumericInput(value: string): number {
  if (value === '') return 0;
  return Math.max(0, Number(value) || 0);
}

interface SectionInputsProps {
  heading?: string;
  categoryPoints: Record<Difficulty, number>;
  desiredCutScores: Record<Grade, number>;
  setCategoryPoints: (difficulty: Difficulty, value: number) => void;
  setDesiredCutScore: (grade: Grade, value: number) => void;
}

function SectionInputs({
  heading,
  categoryPoints,
  desiredCutScores,
  setCategoryPoints,
  setDesiredCutScore,
}: SectionInputsProps) {
  const totalPoints =
    categoryPoints['쉬움'] + categoryPoints['보통'] + categoryPoints['어려움'];

  return (
    <>
      {heading && (
        <div style={{ ...designStyles.sectionTitle, fontSize: '12px', marginBottom: '12px' } as React.CSSProperties}>
          {heading}
        </div>
      )}
      <DesignSection title="난이도별 배점합" hint="영역 총점이 되도록 입력">
        <div style={designStyles.targetDistRow as React.CSSProperties}>
          {DIFFICULTIES.map((d) => (
            <div key={d.key} style={designStyles.targetDistField as React.CSSProperties}>
              <label style={designStyles.label as React.CSSProperties}>{d.label}</label>
              <input
                type="number"
                min={0}
                max={200}
                style={designStyles.input as React.CSSProperties}
                value={displayValue(categoryPoints[d.key])}
                onChange={(e) => setCategoryPoints(d.key, parseNumericInput(e.target.value))}
              />
            </div>
          ))}
          <div style={designStyles.targetSum as React.CSSProperties}>합계: {totalPoints}점</div>
        </div>
      </DesignSection>

      <DesignSection title="희망 분할점수" hint="각 등급의 최소 점수">
        <div style={designStyles.targetDistRow as React.CSSProperties}>
          {GRADES.map((g) => (
            <div key={g.key} style={designStyles.targetDistField as React.CSSProperties}>
              <label style={designStyles.label as React.CSSProperties}>{g.label}컷</label>
              <input
                type="number"
                min={0}
                max={totalPoints || 100}
                step={0.1}
                style={designStyles.input as React.CSSProperties}
                value={displayValue(desiredCutScores[g.key])}
                onChange={(e) => setDesiredCutScore(g.key, parseNumericInput(e.target.value))}
              />
            </div>
          ))}
        </div>
      </DesignSection>
    </>
  );
}

export function SimpleLeftPane() {
  const splitByType = useExamStore((s) => s.settings.splitByType);

  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);
  const spread = useSimpleStore((s) => s.spread);
  const subjective = useSimpleStore((s) => s.subjective);
  const setCategoryPoints = useSimpleStore((s) => s.setCategoryPoints);
  const setDesiredCutScore = useSimpleStore((s) => s.setDesiredCutScore);
  const setSpread = useSimpleStore((s) => s.setSpread);
  const setSubjectiveCategoryPoints = useSimpleStore((s) => s.setSubjectiveCategoryPoints);
  const setSubjectiveDesiredCutScore = useSimpleStore((s) => s.setSubjectiveDesiredCutScore);

  const spreadSection = (
    <DesignSection title="난이도 차이" hint="쉬움과 어려움 사이의 차이폭" isLast>
      <div style={designStyles.sliderContainer as React.CSSProperties}>
        <span style={designStyles.label as React.CSSProperties}>좁게</span>
        <input
          type="range"
          min={0}
          max={30}
          step={5}
          value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={designStyles.label as React.CSSProperties}>넓게</span>
        <span style={designStyles.sliderValue as React.CSSProperties}>{spread}</span>
      </div>
      <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginTop: '8px' } as React.CSSProperties}>
        값이 클수록 쉬운 문항과 어려운 문항의 정답률 차이가 커집니다.{splitByType ? ' (선택형·서답형 공통 적용)' : ''}
      </p>
    </DesignSection>
  );

  return (
    <>
      <SplitToggle />
      <div style={{ ...designStyles.alertInfo, marginBottom: '24px' } as React.CSSProperties}>
        {splitByType
          ? '선택형·서답형 각각 원하는 분할점수(컷)를 입력하면 영역별로 NEIS 값을 역산하고 합산합니다.'
          : '원하는 분할점수(컷)를 입력하면 NEIS에 넣을 값을 역산합니다.'}
      </div>

      {splitByType ? (
        <>
          <SectionInputs
            heading="선택형"
            categoryPoints={categoryPoints}
            desiredCutScores={desiredCutScores}
            setCategoryPoints={setCategoryPoints}
            setDesiredCutScore={setDesiredCutScore}
          />
          <SectionInputs
            heading="서답형"
            categoryPoints={subjective.categoryPoints}
            desiredCutScores={subjective.desiredCutScores}
            setCategoryPoints={setSubjectiveCategoryPoints}
            setDesiredCutScore={setSubjectiveDesiredCutScore}
          />
          {spreadSection}
        </>
      ) : (
        <>
          <SectionInputs
            categoryPoints={categoryPoints}
            desiredCutScores={desiredCutScores}
            setCategoryPoints={setCategoryPoints}
            setDesiredCutScore={setDesiredCutScore}
          />
          {spreadSection}
        </>
      )}
    </>
  );
}
