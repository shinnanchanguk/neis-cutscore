import React from 'react';
import { designStyles } from './styles';

interface Field {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

interface DesignGrid2x2Props {
  fields: Field[];
}

export function DesignGrid2x2({ fields }: DesignGrid2x2Props) {
  return (
    <div style={designStyles.grid2x2 as React.CSSProperties}>
      {fields.map((field) => (
        <div key={field.label}>
          <label style={designStyles.label as React.CSSProperties}>{field.label}</label>
          <input
            type={field.type ?? 'text'}
            style={designStyles.input as React.CSSProperties}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
