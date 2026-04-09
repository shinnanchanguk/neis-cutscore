import { designStyles } from '@/components/design/styles';
import { useUpdater } from '@/hooks/useUpdater';
import type React from 'react';

export function UpdateBanner() {
  const { available, downloading, info, downloadAndInstall } = useUpdater();

  if (!available || !info) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        backgroundColor: '#1A1A1A',
        color: '#EBE8E3',
        fontSize: '13px',
        fontFamily: designStyles.root.fontFamily,
        flexShrink: 0,
      } as React.CSSProperties}
    >
      <span>
        새 버전 {info.version}이 있습니다.
        {info.body && <span style={{ color: '#D4D1C9', marginLeft: 8 }}>{info.body}</span>}
      </span>
      <button
        onClick={downloadAndInstall}
        disabled={downloading}
        style={{
          background: '#EBE8E3',
          color: '#1A1A1A',
          border: 'none',
          padding: '4px 16px',
          fontSize: '12px',
          fontWeight: 500,
          cursor: downloading ? 'wait' : 'pointer',
          fontFamily: designStyles.root.fontFamily,
          opacity: downloading ? 0.7 : 1,
        } as React.CSSProperties}
      >
        {downloading ? '업데이트 중...' : '지금 업데이트'}
      </button>
    </div>
  );
}
