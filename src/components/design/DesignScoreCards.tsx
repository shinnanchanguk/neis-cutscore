import React from 'react';
import { designStyles } from './styles';

interface ScoreCard {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warning' | 'success';
}

interface DesignScoreCardsProps {
  scores: ScoreCard[];
}

export function DesignScoreCards({ scores }: DesignScoreCardsProps) {
  return (
    <div style={designStyles.cutScoresGrid as React.CSSProperties}>
      {scores.map((s) => (
        <div
          key={s.label}
          style={{
            ...designStyles.scoreCard,
            ...(s.tone === 'warning' ? designStyles.scoreCardWarning : null),
            ...(s.tone === 'success' ? designStyles.scoreCardSuccess : null),
          } as React.CSSProperties}
        >
          <span style={designStyles.scoreLabel as React.CSSProperties}>{s.label}</span>
          <span style={designStyles.scoreValue as React.CSSProperties}>{s.value}</span>
          {s.hint && (
            <span style={designStyles.scoreHint as React.CSSProperties}>{s.hint}</span>
          )}
        </div>
      ))}
    </div>
  );
}
