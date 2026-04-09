import React from 'react';
import { designStyles } from '@/components/design';

export function NeisOutputNotice() {
  const handleJump = () => {
    document.getElementById('neis-output-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div
      style={{
        border: '1px solid rgba(10, 122, 74, 0.35)',
        backgroundColor: 'rgba(10, 122, 74, 0.06)',
        padding: '12px 14px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' } as React.CSSProperties}>
        <div style={{ ...designStyles.sectionTitle, fontSize: '12px' } as React.CSSProperties}>
          ↓ 최종 NEIS 입력 표는 아래에서 확인
        </div>
      </div>
      <button
        type="button"
        style={{ ...designStyles.button, whiteSpace: 'nowrap', padding: '6px 10px' } as React.CSSProperties}
        onClick={handleJump}
      >
        바로 보기
      </button>
    </div>
  );
}
