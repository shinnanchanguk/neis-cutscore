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
  const warning = sum !== 100 ? '목표 등급 비율의 합은 100%가 되어야 합니다.' : undefined;
  const notices = [
    targetDistribution.A <= 40
      ? { tone: 'success' as const, text: `앱 참고선: A 비율 ${targetDistribution.A}% (40% 이하 권장, 강제 기준 아님)` }
      : { tone: 'warning' as const, text: `앱 참고선 초과: A 비율 ${targetDistribution.A}% (40% 이하 권장, 강제 기준 아님)` },
    targetDistribution.E <= 40
      ? { tone: 'success' as const, text: `앱 참고선: E 비율 ${targetDistribution.E}% (40% 이하 권장, 강제 기준 아님)` }
      : { tone: 'warning' as const, text: `앱 참고선 초과: E 비율 ${targetDistribution.E}% (40% 이하 권장, 강제 기준 아님)` },
  ];

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
        notices={notices}
      />
    </DesignSection>
  );
}
