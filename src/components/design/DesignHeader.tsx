import React from 'react';
import { designStyles } from './styles';

interface NavItem {
  label: string;
  onClick: () => void;
}

interface DesignHeaderProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
}

export function DesignHeader({ title, subtitle, navItems }: DesignHeaderProps) {
  return (
    <header style={designStyles.appHeader as React.CSSProperties}>
      <div style={designStyles.appHeaderLeft as React.CSSProperties}>
        <h1 style={designStyles.appHeaderH1 as React.CSSProperties}>{title}</h1>
        <span style={{ ...designStyles.textSmall, ...designStyles.textMuted } as React.CSSProperties}>{subtitle}</span>
      </div>
      <nav style={designStyles.appHeaderNav as React.CSSProperties}>
        {navItems.map((item) => (
          <button key={item.label} style={designStyles.navLink as React.CSSProperties} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
