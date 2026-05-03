import React from 'react';
import { designStyles } from '@/components/design';
import { useExamStore } from '@/store/examStore';

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  minWidth: 0,
  width: '100%',
};

const headerFieldStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flex: '1 1 0',
  minWidth: 0,
};

const headerLabelStyle: React.CSSProperties = {
  ...(designStyles.label as React.CSSProperties),
  marginBottom: 0,
  whiteSpace: 'nowrap',
  fontSize: '10px',
  flexShrink: 0,
};

const headerInputStyle = {
  ...(designStyles.input as React.CSSProperties),
  width: '100%',
  minWidth: 0,
  padding: '5px 8px',
  fontSize: '12px',
} as React.CSSProperties;

export function HeaderMetaFields() {
  const meta = useExamStore((s) => s.meta);
  const setMeta = useExamStore((s) => s.setMeta);

  return (
    <div style={headerRowStyle}>
        <div style={headerFieldStyle}>
          <label style={headerLabelStyle}>학교명</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.school}
            onChange={(e) => setMeta({ school: e.target.value })}
          />
        </div>
        <div style={headerFieldStyle}>
          <label style={headerLabelStyle}>과목명</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.subject}
            onChange={(e) => setMeta({ subject: e.target.value })}
          />
        </div>
        <div style={headerFieldStyle}>
          <label style={headerLabelStyle}>학년/학기</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.gradeLevel}
            onChange={(e) => setMeta({ gradeLevel: e.target.value })}
          />
        </div>
        <div style={headerFieldStyle}>
          <label style={headerLabelStyle}>시험명</label>
          <input
            type="text"
            style={headerInputStyle}
            value={meta.examName}
            onChange={(e) => setMeta({ examName: e.target.value })}
            placeholder="저장·불러오기 구분용(선택)"
            title="입력 안 해도 괜찮아요. 저장·불러오기 구분용"
          />
        </div>
    </div>
  );
}
