import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface FieldTooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function FieldTooltip({ content, children }: FieldTooltipProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {children}
      <Tooltip>
        <TooltipTrigger
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: '#6B6861',
            lineHeight: 1,
          }}
          aria-label="도움말"
        >
          <HelpCircle size={14} />
        </TooltipTrigger>
        <TooltipContent style={{ maxWidth: '240px', whiteSpace: 'pre-line' }}>
          {content}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
