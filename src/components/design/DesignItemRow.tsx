import React, { useState } from 'react';
import { designStyles } from './styles';

interface DesignItemRowItem {
  id: number;
  difficulty: string;
  score: number;
  correctRate: number;
  type?: string;
}

interface DesignItemRowProps {
  item: DesignItemRowItem;
  onUpdate: (field: string, value: string | number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  /** 유형(선택형/서답형) 컬럼 표시 여부 */
  showType?: boolean;
  onChangeType?: (type: string) => void;
}

const ROW_GRID_SPLIT = '36px 76px 90px 56px 1fr 56px';

export function DesignItemRow({ item, onUpdate, onDelete, onDuplicate, showType, onChangeType }: DesignItemRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-item="row"
      style={{
        ...designStyles.itemRow,
        ...(showType ? { gridTemplateColumns: ROW_GRID_SPLIT } : null),
        borderBottomColor: hovered ? 'var(--design-border)' : 'transparent',
      } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={designStyles.cellId as React.CSSProperties}>{item.id}</div>
      {showType && (
        <select
          style={{ ...designStyles.select, padding: '6px 8px', fontSize: '11px' } as React.CSSProperties}
          value={item.type ?? '선택형'}
          onChange={(e) => onChangeType?.(e.target.value)}
        >
          <option>선택형</option>
          <option>서답형</option>
        </select>
      )}
      <select
        style={{ ...designStyles.select, padding: '6px 8px', fontSize: '11px' } as React.CSSProperties}
        value={item.difficulty}
        onChange={(e) => onUpdate('difficulty', e.target.value)}
      >
        <option>쉬움</option>
        <option>보통</option>
        <option>어려움</option>
      </select>
      <input
        type="number"
        style={{ ...designStyles.input, padding: '6px 8px', fontSize: '11px' } as React.CSSProperties}
        value={item.score}
        onChange={(e) => onUpdate('score', Number(e.target.value))}
      />
      <div data-item="slider" style={designStyles.sliderContainer as React.CSSProperties}>
        <input
          type="range"
          min="0"
          max="100"
          value={item.correctRate}
          style={{ width: '100%', touchAction: 'none' }}
          onChange={(e) => onUpdate('correctRate', Number(e.target.value))}
        />
        <span style={designStyles.sliderValue as React.CSSProperties}>{item.correctRate}%</span>
      </div>
      <div data-item="actions" style={(hovered ? designStyles.rowActionsHover : designStyles.rowActions) as React.CSSProperties}>
        <button style={designStyles.btnText as React.CSSProperties} onClick={onDuplicate}>복제</button>
        <button style={designStyles.btnText as React.CSSProperties} onClick={onDelete}>삭제</button>
      </div>
    </div>
  );
}
