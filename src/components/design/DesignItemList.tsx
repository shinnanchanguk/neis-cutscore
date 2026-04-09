import React from 'react';
import { designStyles } from './styles';
import { DesignItemRow } from './DesignItemRow';

interface DesignItem {
  id: number;
  difficulty: string;
  score: number;
  correctRate: number;
}

interface DesignItemListProps {
  items: DesignItem[];
  totalScore: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onAdd: () => void;
  onAddMultiple: () => void;
  onSort: () => void;
}

export function DesignItemList({
  items,
  totalScore,
  onUpdate,
  onDelete,
  onDuplicate,
  onAdd,
  onAddMultiple,
  onSort,
}: DesignItemListProps) {
  return (
    <>
      <div style={designStyles.sectionHeader as React.CSSProperties}>
        <h2 style={designStyles.sectionTitle as React.CSSProperties}>문항 목록</h2>
        <div style={designStyles.sectionActions as React.CSSProperties}>
          <span style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginRight: '12px', alignSelf: 'center' } as React.CSSProperties}>
            총 배점: {totalScore}점
          </span>
          <button style={designStyles.button as React.CSSProperties} onClick={onAddMultiple}>여러 개 추가</button>
          <button style={designStyles.button as React.CSSProperties} onClick={onSort}>정렬</button>
          <button style={designStyles.button as React.CSSProperties} onClick={onAdd}>문항 추가</button>
        </div>
      </div>

      <div>
        <div data-item="header" style={designStyles.itemListHeader as React.CSSProperties}>
          <div>번호</div>
          <div>난이도</div>
          <div>배점</div>
          <div>예상 정답률</div>
          <div></div>
        </div>
        {items.map((item, index) => (
          <DesignItemRow
            key={item.id}
            item={item}
            onUpdate={(field, value) => onUpdate(index, field, value)}
            onDelete={() => onDelete(index)}
            onDuplicate={() => onDuplicate(index)}
          />
        ))}
      </div>
    </>
  );
}
