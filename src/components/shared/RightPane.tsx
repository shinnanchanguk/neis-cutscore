import { ExpectedScoreSection } from './ExpectedScoreSection';
import { CutScoresSection } from './CutScoresSection';
import { MinimumAchievementSection } from './MinimumAchievementSection';
import { AdjustmentGuideSection } from './AdjustmentGuideSection';
import { NeisTableSection } from './NeisTableSection';
import { AlertsSection } from './AlertsSection';

export function RightPane() {
  return (
    <>
      <ExpectedScoreSection />
      <CutScoresSection />
      <MinimumAchievementSection />
      <AdjustmentGuideSection />
      <NeisTableSection />
      <AlertsSection />
    </>
  );
}
