import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import type { CellExplanation } from '@/lib/types';

interface CellPopoverProps {
  explanation: CellExplanation | null;
  children: React.ReactNode;
}

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '11px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#6B6861',
  letterSpacing: '0.02em',
  fontWeight: 500,
  marginBottom: '4px',
  marginTop: '10px',
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '28px 36px 48px 48px 36px',
  gap: '4px',
  fontSize: '11px',
  padding: '2px 0',
  borderBottom: '1px solid #EBE8E3',
};

const headerRowStyle: React.CSSProperties = {
  ...rowStyle,
  color: '#6B6861',
  fontSize: '10px',
  borderBottom: '1px solid #D4D1C9',
};

const valueStyle: React.CSSProperties = {
  textAlign: 'right',
  fontFamily: 'monospace',
};

export function CellPopover({ explanation, children }: CellPopoverProps) {
  if (!explanation) {
    return <>{children}</>;
  }

  const gradeLabel = explanation.grade;
  const categoryLabel = explanation.category;

  return (
    <Popover>
      <PopoverTrigger
        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        aria-label={`${categoryLabel} × ${gradeLabel} 셀 상세`}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '12px',
          color: '#1A1A1A',
          backgroundColor: '#FAFAF8',
          border: '1px solid #D4D1C9',
          borderRadius: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: '12px',
        }}
      >
        {/* Header */}
        <p style={{ fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>
          이 셀({categoryLabel} × {gradeLabel}): {explanation.roundedPercent}%
        </p>

        {/* Boundary z */}
        <p style={{ ...monoStyle, color: '#6B6861', marginBottom: '6px' }}>
          목표 {gradeLabel} 비율 → z_{gradeLabel} = {explanation.z_k.toFixed(3)}
        </p>

        {/* Items table */}
        <p style={labelStyle}>문항별 계산</p>
        <div style={headerRowStyle}>
          <span>번호</span>
          <span style={valueStyle}>p_i</span>
          <span style={valueStyle}>b_i</span>
          <span style={valueStyle}>p_ik</span>
          <span style={valueStyle}>배점</span>
        </div>
        {explanation.items.map((item) => (
          <div key={item.number} style={rowStyle}>
            <span style={{ color: '#6B6861' }}>{item.number}</span>
            <span style={valueStyle}>{item.p_i}%</span>
            <span style={valueStyle}>{item.b_i.toFixed(2)}</span>
            <span style={valueStyle}>{(item.p_ik * 100).toFixed(1)}%</span>
            <span style={valueStyle}>{item.points}점</span>
          </div>
        ))}

        {/* Summary */}
        <p style={{ ...monoStyle, color: '#6B6861', marginTop: '8px' }}>
          배점 가중 평균: {explanation.rawPercent.toFixed(1)}%
        </p>
        <p style={{ ...monoStyle, color: '#1A1A1A', fontWeight: 600 }}>
          5% 반올림: {explanation.roundedPercent}%
        </p>
      </PopoverContent>
    </Popover>
  );
}
