import { useState } from 'react';
import { DesignSection, DesignAlerts, DesignCopyButton } from '@/components/design';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { copyToNeisFormat } from '@/lib/clipboard';

export function AlertsSection() {
  const output = useNeisOutput();
  const [copied, setCopied] = useState(false);

  const alerts = output
    ? output.warnings.map((w) => ({ level: w.level, message: w.message }))
    : [{ level: 'info' as const, message: '문항을 추가하면 결과가 표시됩니다.' }];

  const handleCopy = async () => {
    if (!output) return;
    try {
      await copyToNeisFormat(output.cells);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  return (
    <DesignSection title="알림" isLast>
      <DesignAlerts alerts={alerts} />
      <DesignCopyButton
        copied={copied}
        onClick={handleCopy}
        hint="NEIS 성적처리 화면의 표에 붙여넣기 하세요"
      />
    </DesignSection>
  );
}
