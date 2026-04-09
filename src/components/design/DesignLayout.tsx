import React from 'react';
import { designStyles } from './styles';

interface DesignLayoutProps {
  header: React.ReactNode;
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
}

export function DesignLayout({ header, leftPane, rightPane }: DesignLayoutProps) {
  return (
    <div style={designStyles.root as React.CSSProperties}>
      {header}
      <main style={designStyles.appMain as React.CSSProperties}>
        <div style={designStyles.paneLeft as React.CSSProperties}>{leftPane}</div>
        <div style={designStyles.paneRight as React.CSSProperties}>{rightPane}</div>
      </main>
    </div>
  );
}
