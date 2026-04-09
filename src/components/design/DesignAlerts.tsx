import React from 'react';
import { designStyles } from './styles';

interface Alert {
  level: 'error' | 'warning' | 'info';
  message: string;
}

interface DesignAlertsProps {
  alerts: Alert[];
}

const alertStyleMap = {
  error: designStyles.alertError,
  warning: designStyles.alertWarning,
  info: designStyles.alertInfo,
} as const;

export function DesignAlerts({ alerts }: DesignAlertsProps) {
  return (
    <div style={designStyles.alertList as React.CSSProperties}>
      {alerts.map((alert, i) => (
        <div key={i} style={alertStyleMap[alert.level] as React.CSSProperties}>
          <span style={{ marginRight: '8px', opacity: 0.5 }}>—</span>
          {alert.message}
        </div>
      ))}
    </div>
  );
}
