import React from 'react';
import { designStyles } from './styles';
import { DesignItemRow } from './DesignItemRow';

interface DesignItem {
  id: number;
  difficulty: string;
  score: number;
  correctRate: number;
  type?: string;
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
  /** 섹션 제목 (기본 "문항 목록") */
  title?: string;
  /** 유형(선택형/서답형) 컬럼 표시 여부 */
  showType?: boolean;
  onChangeType?: (index: number, type: string) => void;
}

const HEADER_GRID_SPLIT = '36px 76px 90px 56px 1fr 56px';

export function DesignItemList({
  items,
  totalScore,
  onUpdate,
  onDelete,
  onDuplicate,
  onAdd,
  onAddMultiple,
  onSort,
  title = '문항 목록',
  showType,
  onChangeType,
}: DesignItemListProps) {
  return (
    <>
      <div style={designStyles.sectionHeader as React.CSSProperties}>
        <h2 style={designStyles.sectionTitle as React.CSSProperties}>{title}</h2>
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
        <div
          data-item="header"
          style={{
            ...designStyles.itemListHeader,
            ...(showType ? { gridTemplateColumns: HEADER_GRID_SPLIT } : null),
          } as React.CSSProperties}
        >
          <div>번호</div>
          {showType && <div>유형</div>}
          <div>난이도</div>
          <div>배점</div>
          <div>예상 정답률</div>
          <div></div>
        </div>
        {items.map((item, index) => (
          <DesignItemRow
            key={item.id}
            item={item}
            showType={showType}
            onUpdate={(field, value) => onUpdate(index, field, value)}
            onChangeType={(type) => onChangeType?.(index, type)}
            onDelete={() => onDelete(index)}
            onDuplicate={() => onDuplicate(index)}
          />
        ))}
        {items.length === 0 && (
          <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, padding: '12px 0' } as React.CSSProperties}>
            문항이 없습니다. "문항 추가"를 눌러 입력하세요.
          </p>
        )}
      </div>
    </>
  );
}
