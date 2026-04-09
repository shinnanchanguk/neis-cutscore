import React, { useState } from 'react';
import { designStyles } from './styles';

interface DesignItemRowItem {
  id: number;
  type: string;
  difficulty: string;
  score: number;
  correctRate: number;
}

interface DesignItemRowProps {
  item: DesignItemRowItem;
  onUpdate: (field: string, value: string | number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function DesignItemRow({ item, onUpdate, onDelete, onDuplicate }: DesignItemRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...designStyles.itemRow, borderBottomColor: hovered ? 'var(--design-border)' : 'transparent' } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={designStyles.cellId as React.CSSProperties}>{item.id}</div>
      <select
        style={{ ...designStyles.select, padding: '6px 8px', fontSize: '11px' } as React.CSSProperties}
        value={item.type}
        onChange={(e) => onUpdate('type', e.target.value)}
      >
        <option>선택형</option>
        <option>서답형</option>
      </select>
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
      <div style={designStyles.sliderContainer as React.CSSProperties}>
        <input
          type="range"
          min="0"
          max="100"
          value={item.correctRate}
          style={{ width: '100%' }}
          onChange={(e) => onUpdate('correctRate', Number(e.target.value))}
        />
        <span style={designStyles.sliderValue as React.CSSProperties}>{item.correctRate}%</span>
      </div>
      <div style={(hovered ? designStyles.rowActionsHover : designStyles.rowActions) as React.CSSProperties}>
        <button style={designStyles.btnText as React.CSSProperties} onClick={onDuplicate}>복제</button>
        <button style={designStyles.btnText as React.CSSProperties} onClick={onDelete}>삭제</button>
      </div>
    </div>
  );
}
