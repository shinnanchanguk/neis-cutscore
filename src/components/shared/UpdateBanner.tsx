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
        backgroundColor: 'var(--design-bg-inverted)',
        color: 'var(--design-fg-inverted)',
        fontSize: '13px',
        fontFamily: designStyles.root.fontFamily,
        flexShrink: 0,
      } as React.CSSProperties}
    >
      <span>
        새 버전 {info.version}이 있습니다.
        {info.body && <span style={{ color: 'var(--design-border)', marginLeft: 8 }}>{info.body}</span>}
      </span>
      <button
        onClick={downloadAndInstall}
        disabled={downloading}
        style={{
          background: 'var(--design-bg)',
          color: 'var(--design-fg)',
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
