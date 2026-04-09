import React from 'react';
import { designStyles } from './styles';

interface DesignCopyButtonProps {
  copied: boolean;
  onClick: () => void;
  hint: string;
}

export function DesignCopyButton({ copied, onClick, hint }: DesignCopyButtonProps) {
  return (
    <div style={{ marginTop: '32px' }}>
      <button style={designStyles.btnPrimary as React.CSSProperties} onClick={onClick}>
        {copied ? '복사됨!' : 'NEIS에 복사하기'}
      </button>
      <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, textAlign: 'center', marginTop: '8px' } as React.CSSProperties}>
        {hint}
      </p>
    </div>
  );
}
