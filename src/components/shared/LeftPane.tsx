import { ExamMetaSection } from './ExamMetaSection';
import { TargetDistSection } from './TargetDistSection';
import { ItemListSection } from './ItemListSection';

export function LeftPane() {
  return (
    <>
      <ExamMetaSection />
      <TargetDistSection />
      <ItemListSection />
    </>
  );
}
