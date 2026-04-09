import React from 'react';
import { designStyles } from './styles';

interface NeisGroup {
  difficulty: string;
  itemNumbers: string;
  itemCount: number;
  totalPoints: number;
  rates: Record<string, number>;
}

interface DesignNeisTableProps {
  totalGroups: number;
  mode: string;
  unit: string;
  onModeChange: (mode: string) => void;
  groups: NeisGroup[];
  grades: string[];
  onCellClick?: (groupIndex: number, grade: string) => void;
}

export function DesignNeisTable({
  mode,
  unit,
  onModeChange,
  groups,
  grades,
  onCellClick,
}: DesignNeisTableProps) {
  const colSpan = grades.length;

  return (
    <>
      <div style={{ ...designStyles.sectionActions, justifyContent: 'flex-end', marginBottom: '12px' } as React.CSSProperties}>
        <div style={designStyles.sectionActions as React.CSSProperties}>
          <select style={designStyles.selectSmall as React.CSSProperties} value={mode} onChange={(e) => onModeChange(e.target.value)}>
            <option>5수준(A-E) + 미도달</option>
            <option>5수준(A-E)</option>
          </select>
          <select style={designStyles.selectSmall as React.CSSProperties} value={unit} onChange={() => {}}>
            <option>5% 단위</option>
          </select>
        </div>
      </div>
      <table data-neis="table" style={designStyles.table as React.CSSProperties}>
        <thead>
          <tr>
            <th rowSpan={2} style={designStyles.th as React.CSSProperties}>난이도</th>
            <th rowSpan={2} style={designStyles.th as React.CSSProperties}>해당문항번호</th>
            <th rowSpan={2} style={designStyles.th as React.CSSProperties}>문항수</th>
            <th rowSpan={2} style={designStyles.th as React.CSSProperties}>배점합</th>
            <th colSpan={colSpan} style={designStyles.th as React.CSSProperties}>최소능력자 예상정답률(%)</th>
          </tr>
          <tr>
            {grades.map((g) => (
              <th key={g} style={designStyles.th as React.CSSProperties}>{g}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={i}>
              <td style={designStyles.tdCenter as React.CSSProperties}>{g.difficulty}</td>
              <td style={designStyles.tdLeft as React.CSSProperties}>{g.itemNumbers}</td>
              <td style={designStyles.td as React.CSSProperties}>{g.itemCount}</td>
              <td style={designStyles.td as React.CSSProperties}>{g.totalPoints}</td>
              {grades.map((grade) => (
                <td
                  key={grade}
                  style={designStyles.td as React.CSSProperties}
                  onClick={() => onCellClick?.(i, grade)}
                >
                  {g.rates[grade] != null ? g.rates[grade] : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
