import React from 'react';
import { designStyles } from '@/components/design';
import { useExamStore } from '@/store/examStore';

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  alignItems: 'flex-start',
  minWidth: 0,
};

const headerFieldStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  minWidth: 0,
};

const headerInputStyle = {
  ...(designStyles.input as React.CSSProperties),
  width: '112px',
  padding: '5px 8px',
  fontSize: '12px',
} as React.CSSProperties;

export function HeaderMetaFields() {
  const meta = useExamStore((s) => s.meta);
  const setMeta = useExamStore((s) => s.setMeta);

  return (
    <div style={headerRowStyle}>
        <div style={headerFieldStyle}>
          <label style={{ ...designStyles.label, marginBottom: 0, whiteSpace: 'nowrap', fontSize: '10px' } as React.CSSProperties}>학교명</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.school}
            onChange={(e) => setMeta({ school: e.target.value })}
          />
        </div>
        <div style={headerFieldStyle}>
          <label style={{ ...designStyles.label, marginBottom: 0, whiteSpace: 'nowrap', fontSize: '10px' } as React.CSSProperties}>과목명</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.subject}
            onChange={(e) => setMeta({ subject: e.target.value })}
          />
        </div>
        <div style={headerFieldStyle}>
          <label style={{ ...designStyles.label, marginBottom: 0, whiteSpace: 'nowrap', fontSize: '10px' } as React.CSSProperties}>학년/학기</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.gradeLevel}
            onChange={(e) => setMeta({ gradeLevel: e.target.value })}
          />
        </div>
        <div style={{ ...headerFieldStyle, flex: '1 1 auto', minWidth: 0 } as React.CSSProperties}>
          <label style={{ ...designStyles.label, marginBottom: 0, whiteSpace: 'nowrap', fontSize: '10px' } as React.CSSProperties}>시험명</label>
          <input
            type="text"
            style={{ ...headerInputStyle, width: '128px' } as React.CSSProperties}
            value={meta.examName}
            onChange={(e) => setMeta({ examName: e.target.value })}
          />
          <span
            style={{
              ...designStyles.textSmall,
              ...designStyles.textMuted,
              whiteSpace: 'nowrap',
              flexShrink: 1,
            } as React.CSSProperties}
          >
            {'< 입력 안 해도 괜찮아요. 저장·불러오기 구분용입니다.'}
          </span>
        </div>
    </div>
  );
}
