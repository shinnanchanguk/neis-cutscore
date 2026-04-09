import { CutScoresSection } from './CutScoresSection';
import { NeisTableSection } from './NeisTableSection';
import { ComparisonSection } from './ComparisonSection';
import { AlertsSection } from './AlertsSection';

export function RightPane() {
  return (
    <>
      <CutScoresSection />
      <NeisTableSection />
      <ComparisonSection />
      <AlertsSection />
    </>
  );
}
