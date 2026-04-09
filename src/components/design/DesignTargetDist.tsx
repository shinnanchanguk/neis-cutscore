import React from 'react';
import { designStyles } from './styles';

interface DesignTargetDistProps {
  grades: string[];
  values: Record<string, number>;
  onChange: (grade: string, value: number) => void;
  sum: number;
  warning?: string;
  notices?: Array<{ tone: 'warning' | 'success'; text: string }>;
}

export function DesignTargetDist({ grades, values, onChange, sum, warning, notices = [] }: DesignTargetDistProps) {
  return (
    <>
      <div style={designStyles.targetDistRow as React.CSSProperties}>
        {grades.map((grade) => (
          <div key={grade} style={designStyles.targetDistField as React.CSSProperties}>
            <label style={designStyles.label as React.CSSProperties}>{grade} (%)</label>
            <input
              type="number"
              style={{ ...designStyles.input, textAlign: 'right' } as React.CSSProperties}
              value={values[grade]}
              onChange={(e) => onChange(grade, Number(e.target.value))}
            />
          </div>
        ))}
        <div style={designStyles.targetSum as React.CSSProperties}>합계: {sum}%</div>
      </div>
      {warning && (
        <div style={designStyles.inlineWarning as React.CSSProperties}>{warning}</div>
      )}
      {notices.map((notice) => (
        <div
          key={notice.text}
          style={(
            notice.tone === 'warning' ? designStyles.inlineWarning : designStyles.inlineSuccess
          ) as React.CSSProperties}
        >
          {notice.text}
        </div>
      ))}
    </>
  );
}
