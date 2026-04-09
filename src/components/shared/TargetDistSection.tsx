import React from 'react'; // needed for CSSProperties cast
import { DesignSection, DesignTargetDist, designStyles } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { FieldTooltip } from '@/components/shared/FieldTooltip';
import { fieldTooltips } from '@/content/help';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';
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
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);
  const setPreset = useExamStore((s) => s.setPreset);
  const setTargetField = useExamStore((s) => s.setTargetField);
  const setSetting = useExamStore((s) => s.setSetting);

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
      {includeE미도달 && (
        <div style={{ marginTop: '16px' } as React.CSSProperties}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 220px) 1fr',
              gap: '12px',
              alignItems: 'end',
            } as React.CSSProperties}
          >
            <div style={designStyles.targetDistField as React.CSSProperties}>
              <label style={designStyles.label as React.CSSProperties}>
                <FieldTooltip content={fieldTooltips.expectedUnmetRate}>
                  예상 미도달 비율 (%)
                </FieldTooltip>
              </label>
              <input
                type="number"
                min={0}
                max={99}
                style={{ ...designStyles.input, textAlign: 'right' } as React.CSSProperties}
                value={expectedUnmetRate}
                onChange={(e) => setSetting('expectedUnmetRate', Math.max(0, Number(e.target.value)))}
              />
            </div>
            <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: 0 } as React.CSSProperties}>
              5수준(A-E)+미도달에서는 A~E 합계 100을 도달 학생 내부 비율로 해석하고,
              미도달 {expectedUnmetRate}%를 별도 꼬리구간으로 계산합니다.
              이 값을 너무 낮게 잡으면 E열이 다시 분포 맨 아래 꼬리로 끌려가서 예상 정답률이 지나치게 낮아질 수 있습니다.
              따라서 이 입력은 E열과 E/미도달 참고점수에 직접 반영됩니다.
            </p>
          </div>
          {expectedUnmetRate <= 0 && (
            <div style={designStyles.inlineWarning as React.CSSProperties}>
              예상 미도달 비율이 0%면 E열이 분포 맨 아래 극단값에 가까워져 지나치게 낮아질 수 있습니다.
            </div>
          )}
        </div>
      )}
    </DesignSection>
  );
}
