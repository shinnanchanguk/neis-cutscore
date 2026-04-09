import { ExpectedScoreSection } from './ExpectedScoreSection';
import { NeisOutputNotice } from './NeisOutputNotice';
import { CutScoresSection } from './CutScoresSection';
import { MinimumAchievementSection } from './MinimumAchievementSection';
import { AdjustmentGuideSection } from './AdjustmentGuideSection';
import { NeisTableSection } from './NeisTableSection';
import { AlertsSection } from './AlertsSection';

export function RightPane() {
  return (
    <>
      <NeisOutputNotice />
      <ExpectedScoreSection />
      <CutScoresSection />
      <MinimumAchievementSection />
      <AdjustmentGuideSection />
      <AlertsSection />
      <NeisTableSection />
    </>
  );
}
