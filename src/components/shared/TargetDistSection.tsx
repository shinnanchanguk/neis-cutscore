import React from 'react'; // needed for CSSProperties cast
import { DesignSection, DesignTargetDist, designStyles } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { FieldTooltip } from '@/components/shared/FieldTooltip';
import { fieldTooltips } from '@/content/help';
import type { Grade, PresetName } from '@/lib/types';

const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

const PRESET_OPTIONS: { value: PresetName; label: string }[] = [
  { value: '일반고', label: '프리셋: 일반고' },
  { value: '과고_특목고', label: '과고·특목고' },
  { value: '사용자정의', label: '사용자정의' },
];

export function TargetDistSection() {
  const presetName = useExamStore((s) => s.presetName);
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const setPreset = useExamStore((s) => s.setPreset);
  const setTargetField = useExamStore((s) => s.setTargetField);

  const sum = GRADES.reduce((acc, g) => acc + (targetDistribution[g] ?? 0), 0);
  const warningA = targetDistribution.A > 40 ? 'A 등급 비율이 40%를 초과합니다.' : undefined;
  const warningE = targetDistribution.E > 40 ? 'E 등급 비율이 40%를 초과합니다. 최소 성취수준 미도달 학생 비율이 매우 높습니다.' : undefined;
  const warning = warningA ?? warningE;

  const values: Record<string, number> = {};
  for (const g of GRADES) {
    values[g] = targetDistribution[g];
  }

  const handleChange = (grade: string, value: number) => {
    setTargetField(grade as Grade, value);
  };

  const actions = (
    <select
      style={designStyles.selectSmall as React.CSSProperties}
      value={presetName}
      onChange={(e) => setPreset(e.target.value as PresetName)}
    >
      {PRESET_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  const titleWithTooltip = (
    <FieldTooltip content={fieldTooltips.targetDistribution}>
      목표 등급 비율
    </FieldTooltip>
  );

  return (
    <DesignSection title={titleWithTooltip} actions={actions}>
      <DesignTargetDist
        grades={GRADES}
        values={values}
        onChange={handleChange}
        sum={sum}
        warning={warning}
      />
    </DesignSection>
  );
}
