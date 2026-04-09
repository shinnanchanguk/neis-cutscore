import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface FieldTooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function FieldTooltip({ content, children }: FieldTooltipProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {children}
      <Popover>
        <PopoverTrigger
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--design-muted)',
            lineHeight: 1,
            touchAction: 'manipulation',
          }}
          aria-label="도움말"
        >
          <HelpCircle size={16} />
        </PopoverTrigger>
        <PopoverContent
          style={{
            maxWidth: '280px',
            whiteSpace: 'pre-line',
            fontSize: '12px',
            lineHeight: 1.6,
          }}
          side="bottom"
          align="start"
        >
          {content}
        </PopoverContent>
      </Popover>
    </span>
  );
}
