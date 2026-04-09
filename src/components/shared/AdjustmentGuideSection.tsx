import React from 'react';
import { DesignSection } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';

function formatPercent(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export function AdjustmentGuideSection() {
  const items = useExamStore((s) => s.items);
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);
  const output = useNeisOutput();

  if (!output || items.length === 0) return null;

  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const referenceScore = Math.round(totalPoints * 0.4 * 10) / 10;
  const expectedScore = items.reduce((sum, item) => sum + item.points * (item.expectedRate / 100), 0);
  const hardItems = items.filter((item) => item.difficulty === '어려움');
  const hardPoints = hardItems.reduce((sum, item) => sum + item.points, 0);
  const hardShare = totalPoints > 0 ? (hardPoints / totalPoints) * 100 : 0;
  const hardExpectedRate = hardPoints > 0
    ? hardItems.reduce((sum, item) => sum + item.points * item.expectedRate, 0) / hardPoints
    : 0;
  const eCut = output.cutScores.E미도달;

  const reasons: string[] = [];
  const actions: string[] = [];

  if (includeE미도달 && eCut != null && eCut < referenceScore) {
    reasons.push(`추정 E/미도달이 ${eCut}점이라 고정 40% 기준(${referenceScore}점)보다 낮습니다. 추정분할점수에서는 이런 차이가 생길 수 있으니 최소 성취수준 지도를 별도로 점검하세요.`);
  }
  if (includeE미도달 && expectedUnmetRate <= 0) {
    reasons.push('예상 미도달 비율이 0%라 E열이 분포 맨 아래 극단값에 가까워집니다. 이 경우 E 예상 정답률이 지나치게 낮아질 수 있습니다.');
  }
  if (output.cutScores.DE < 20) {
    reasons.push(`D/E가 ${output.cutScores.DE}점으로 낮습니다. 현재 목표 E=${targetDistribution.E}%라 하위 경계가 매우 낮게 잡혀 있습니다.`);
  }
  if (expectedScore < 60) {
    reasons.push(`예상 평균 점수가 ${expectedScore.toFixed(1)}점이라 시험 전체 난이도가 높게 잡혀 있습니다.`);
  }
  if (hardShare >= 40) {
    reasons.push(`어려움 문항 배점 비중이 ${formatPercent(hardShare)}로 큽니다.`);
  }
  if (hardItems.length > 0 && hardExpectedRate < 35) {
    reasons.push(`어려움 문항의 가중 평균 정답률이 ${hardExpectedRate.toFixed(1)}%로 낮습니다.`);
  }

  if (hardShare >= 40) {
    actions.push('어려움 배점 비중이 크면 하위 경계가 빠르게 내려갑니다. 일부 문항의 배점을 보통 구간으로 옮길 수 있는지 먼저 보세요.');
  }
  if (hardItems.length > 0 && hardExpectedRate < 35) {
    actions.push('어려움 문항 예상 정답률을 다시 점검하세요. 실제 수업 맥락상 5~10%p만 올라가도 하위 경계가 꽤 달라질 수 있습니다.');
  }
  if (expectedScore < 60) {
    actions.push('쉬움·보통 문항에서 확보되는 점수가 너무 적지 않은지 보세요. 평균 기대점수 자체가 올라가야 하위 경계도 함께 올라갑니다.');
  }
  if (includeE미도달 && expectedUnmetRate <= 0) {
    actions.push('실제 수업과 평가 계획상 미도달 가능성이 전혀 0이 아닌데도 0%로 둔 것은 아닌지 보세요. 너무 낮게 두면 E열이 과하게 낮아집니다.');
  }
  if (targetDistribution.E <= 3) {
    actions.push(`학교 합의상 가능하다면 목표 E 비율 ${targetDistribution.E}%를 완화하는 방안도 있습니다. E 비율이 작을수록 하위 경계는 더 낮아집니다.`);
  }

  if (reasons.length === 0) {
    reasons.push('현재 입력에서는 권고사항을 크게 해치는 신호가 두드러지지 않습니다.');
  }
  if (actions.length === 0) {
    actions.push('지금 값은 큰 보정 없이도 사용할 수 있는 범위로 보입니다. 필요하면 문항별 정답률만 마지막 점검하세요.');
  }

  return (
    <DesignSection title="조정 안내" hint="왜 낮은지 / 어떻게 올릴지">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties}>
        <div>
          <div style={{ ...designStyles.scoreLabel, marginBottom: '8px' } as React.CSSProperties}>왜 이렇게 나오는지</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' } as React.CSSProperties}>
            {reasons.map((reason) => (
              <div key={reason} style={designStyles.inlineWarning as React.CSSProperties}>{reason}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...designStyles.scoreLabel, marginBottom: '8px' } as React.CSSProperties}>우선 볼 조정 포인트</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' } as React.CSSProperties}>
            {actions.map((action) => (
              <div key={action} style={designStyles.inlineSuccess as React.CSSProperties}>{action}</div>
            ))}
          </div>
        </div>
      </div>
    </DesignSection>
  );
}
