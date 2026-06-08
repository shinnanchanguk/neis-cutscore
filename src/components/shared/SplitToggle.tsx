import React from 'react';
import { useExamStore } from '@/store/examStore';
import { designStyles } from '@/components/design/styles';

/** 선택형·서답형 분리 산출 토글 (상세·간편 좌측 패널 상단 공용) */
export function SplitToggle() {
  const splitByType = useExamStore((s) => s.settings.splitByType);
  const setSetting = useExamStore((s) => s.setSetting);

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '24px',
        cursor: 'pointer',
      } as React.CSSProperties}
    >
      <input
        type="checkbox"
        checked={splitByType}
        onChange={(e) => setSetting('splitByType', e.target.checked)}
        style={{ marginTop: '2px', cursor: 'pointer', accentColor: 'var(--design-fg)' } as React.CSSProperties}
      />
      <span>
        <span style={{ ...designStyles.sectionTitle, fontSize: '12px' } as React.CSSProperties}>
          선택형·서답형 분리 산출
        </span>
        <span
          style={{
            ...designStyles.textSmall,
            ...designStyles.textMuted,
            display: 'block',
            marginTop: '3px',
            lineHeight: 1.5,
          } as React.CSSProperties}
        >
          두 영역의 분할점수를 각각 산출해야 하는 교과에서 켜세요. 총 분할점수 = 선택형컷 + 서답형컷.
        </span>
      </span>
    </label>
  );
}
