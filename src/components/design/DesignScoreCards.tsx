import React from 'react';
import { designStyles } from './styles';

interface ScoreCard {
  label: string;
  value: string;
}

interface DesignScoreCardsProps {
  scores: ScoreCard[];
}

export function DesignScoreCards({ scores }: DesignScoreCardsProps) {
  return (
    <div style={designStyles.cutScoresGrid as React.CSSProperties}>
      {scores.map((s) => (
        <div key={s.label} style={designStyles.scoreCard as React.CSSProperties}>
          <span style={designStyles.scoreLabel as React.CSSProperties}>{s.label}</span>
          <span style={designStyles.scoreValue as React.CSSProperties}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}
