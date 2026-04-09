import React from 'react';
import { DesignSection } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';

export function ExpectedScoreSection() {
  const items = useExamStore((s) => s.items);

  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const expectedScore = items.reduce((sum, item) => sum + item.points * (item.expectedRate / 100), 0);
  const expectedRate = totalPoints > 0 ? (expectedScore / totalPoints) * 100 : 0;

  return (
    <DesignSection title="예상 평균 점수" hint="문항 정답률 기준">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
        } as React.CSSProperties}
      >
        <div style={designStyles.scoreCard as React.CSSProperties}>
          <span style={designStyles.scoreLabel as React.CSSProperties}>예상 평균 점수</span>
          <span style={designStyles.scoreValue as React.CSSProperties}>
            {items.length > 0 ? `${expectedScore.toFixed(1)}점` : '—'}
          </span>
        </div>
        <div style={designStyles.scoreCard as React.CSSProperties}>
          <span style={designStyles.scoreLabel as React.CSSProperties}>평균 득점률</span>
          <span style={designStyles.scoreValue as React.CSSProperties}>
            {items.length > 0 ? `${expectedRate.toFixed(1)}%` : '—'}
          </span>
        </div>
      </div>
      <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
        문항별 배점 × 예상 정답률의 합입니다. 전체 시험 난이도가 너무 낮거나 높은지 빠르게 감잡는 용도로 보세요.
      </p>
    </DesignSection>
  );
}
