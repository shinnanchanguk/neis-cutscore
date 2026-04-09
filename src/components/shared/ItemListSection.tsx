import { DesignSection, DesignItemList } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import type { Difficulty, ItemType } from '@/lib/types';

export function ItemListSection() {
  const items = useExamStore((s) => s.items);
  const addItem = useExamStore((s) => s.addItem);
  const addBulkItems = useExamStore((s) => s.addBulkItems);
  const updateItem = useExamStore((s) => s.updateItem);
  const removeItem = useExamStore((s) => s.removeItem);
  const duplicateItem = useExamStore((s) => s.duplicateItem);
  const sortItems = useExamStore((s) => s.sortItems);

  const totalScore = items.reduce((acc, item) => acc + item.points, 0);

  // Map store items to DesignItem format (uses index-based id for display)
  const designItems = items.map((item) => ({
    id: item.number,
    type: item.type,
    difficulty: item.difficulty,
    score: item.points,
    correctRate: item.expectedRate,
  }));

  const handleUpdate = (index: number, field: string, value: string | number) => {
    const item = items[index];
    if (!item) return;
    if (field === 'type') {
      updateItem(item.id, { type: value as ItemType });
    } else if (field === 'difficulty') {
      updateItem(item.id, { difficulty: value as Difficulty });
    } else if (field === 'score') {
      updateItem(item.id, { points: Number(value) });
    } else if (field === 'correctRate') {
      updateItem(item.id, { expectedRate: Number(value) });
    }
  };

  const handleDelete = (index: number) => {
    const item = items[index];
    if (item) removeItem(item.id);
  };

  const handleDuplicate = (index: number) => {
    const item = items[index];
    if (item) duplicateItem(item.id);
  };

  return (
    <DesignSection title="문항 목록" isLast>
      <DesignItemList
        items={designItems}
        totalScore={totalScore}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onAdd={addItem}
        onAddMultiple={() => addBulkItems(3)}
        onSort={() => sortItems('difficulty')}
      />
    </DesignSection>
  );
}
