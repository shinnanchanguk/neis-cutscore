import React from 'react';
import { DesignSection, DesignItemList } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { FieldTooltip } from '@/components/shared/FieldTooltip';
import { fieldTooltips } from '@/content/help';
import type { Difficulty, Item, ItemType } from '@/lib/types';

function sectionOf(item: Item): ItemType {
  return item.type === '서답형' ? '서답형' : '선택형';
}

export function ItemListSection() {
  const items = useExamStore((s) => s.items);
  const splitByType = useExamStore((s) => s.settings.splitByType);
  const addItem = useExamStore((s) => s.addItem);
  const addBulkItems = useExamStore((s) => s.addBulkItems);
  const updateItem = useExamStore((s) => s.updateItem);
  const removeItem = useExamStore((s) => s.removeItem);
  const duplicateItem = useExamStore((s) => s.duplicateItem);
  const sortItems = useExamStore((s) => s.sortItems);

  const renderList = (
    sectionItems: Item[],
    opts: { showType?: boolean; addType?: ItemType; title?: string },
  ) => {
    const designItems = sectionItems.map((item) => ({
      id: item.number,
      difficulty: item.difficulty,
      score: item.points,
      correctRate: item.expectedRate,
      type: item.type ?? '선택형',
    }));
    const totalScore = sectionItems.reduce((acc, item) => acc + item.points, 0);

    const handleUpdate = (index: number, field: string, value: string | number) => {
      const item = sectionItems[index];
      if (!item) return;
      if (field === 'difficulty') updateItem(item.id, { difficulty: value as Difficulty });
      else if (field === 'score') updateItem(item.id, { points: Number(value) });
      else if (field === 'correctRate') updateItem(item.id, { expectedRate: Number(value) });
    };
    const handleChangeType = (index: number, type: string) => {
      const item = sectionItems[index];
      if (item) updateItem(item.id, { type: type as ItemType });
    };
    const handleDelete = (index: number) => {
      const item = sectionItems[index];
      if (item) removeItem(item.id);
    };
    const handleDuplicate = (index: number) => {
      const item = sectionItems[index];
      if (item) duplicateItem(item.id);
    };

    return (
      <DesignItemList
        items={designItems}
        totalScore={totalScore}
        title={opts.title}
        showType={opts.showType}
        onUpdate={handleUpdate}
        onChangeType={handleChangeType}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onAdd={() => addItem(opts.addType)}
        onAddMultiple={() => addBulkItems(3, opts.addType)}
        onSort={() => sortItems('difficulty')}
      />
    );
  };

  if (splitByType) {
    const 선택형Items = items.filter((i) => sectionOf(i) === '선택형');
    const 서답형Items = items.filter((i) => sectionOf(i) === '서답형');
    return (
      <>
        <section style={designStyles.section as React.CSSProperties}>
          {renderList(선택형Items, { showType: true, addType: '선택형', title: '선택형 문항' })}
        </section>
        <section style={designStyles.sectionLast as React.CSSProperties}>
          {renderList(서답형Items, { showType: true, addType: '서답형', title: '서답형 문항' })}
        </section>
      </>
    );
  }

  const titleWithTooltip = (
    <FieldTooltip content={fieldTooltips.expectedRate}>문항 목록</FieldTooltip>
  );
  return (
    <DesignSection title={titleWithTooltip} isLast>
      {renderList(items, {})}
    </DesignSection>
  );
}
