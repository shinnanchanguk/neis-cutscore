import React from 'react';
import { designStyles } from './styles';

interface DesignComparisonTableProps {
  grades: string[];
  target: Record<string, number>;
  expected: Record<string, number>;
}

export function DesignComparisonTable({ grades, target, expected }: DesignComparisonTableProps) {
  return (
    <table style={designStyles.table as React.CSSProperties}>
      <thead>
        <tr>
          <th style={designStyles.th as React.CSSProperties}>등급</th>
          <th style={designStyles.th as React.CSSProperties}>목표</th>
          <th style={designStyles.th as React.CSSProperties}>예상</th>
          <th style={designStyles.th as React.CSSProperties}>차이</th>
        </tr>
      </thead>
      <tbody>
        {grades.map((grade) => {
          const t = Number(target[grade]);
          const e = Number(expected[grade]);
          const diff = (e - t).toFixed(1);
          const diffStr = Number(diff) > 0 ? `+${diff}%` : `${diff}%`;
          return (
            <tr key={grade}>
              <td style={designStyles.tdCenter as React.CSSProperties}>{grade}</td>
              <td style={designStyles.td as React.CSSProperties}>{t.toFixed(1)}%</td>
              <td style={designStyles.td as React.CSSProperties}>{e}%</td>
              <td style={designStyles.td as React.CSSProperties}>{diffStr}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
