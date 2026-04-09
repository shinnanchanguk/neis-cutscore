import React from 'react';
import { designStyles } from './styles';

interface DesignSectionProps {
  id?: string;
  title: React.ReactNode;
  hint?: string;
  actions?: React.ReactNode;
  isLast?: boolean;
  children: React.ReactNode;
}

export function DesignSection({ id, title, hint, actions, isLast, children }: DesignSectionProps) {
  return (
    <section id={id} style={(isLast ? designStyles.sectionLast : designStyles.section) as React.CSSProperties}>
      <div style={designStyles.sectionHeader as React.CSSProperties}>
        <h2 style={designStyles.sectionTitle as React.CSSProperties}>{title}</h2>
        {hint && (
          <span style={{ ...designStyles.textSmall, ...designStyles.textMuted } as React.CSSProperties}>{hint}</span>
        )}
        {actions && (
          <div style={designStyles.sectionActions as React.CSSProperties}>{actions}</div>
        )}
      </div>
      {children}
    </section>
  );
}
