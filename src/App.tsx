import { useState } from 'react';
import { DesignLayout } from '@/components/design';
import { LeftPane } from '@/components/shared/LeftPane';
import { RightPane } from '@/components/shared/RightPane';
import { SimpleLeftPane } from '@/components/simple/SimpleLeftPane';
import { SimpleRightPane } from '@/components/simple/SimpleRightPane';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { OnboardingModal } from '@/components/shared/OnboardingModal';
import { HelpDialog } from '@/components/shared/HelpDialog';
import { SettingsDialog } from '@/components/shared/SettingsDialog';
import { FileMenu } from '@/components/shared/FileMenu';
import { HeaderMetaFields } from '@/components/shared/HeaderMetaFields';
import { DownloadModal } from '@/components/shared/DownloadModal';
import { useExamStore } from '@/store/examStore';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { UpdateBanner } from '@/components/shared/UpdateBanner';
import { useIsTauri } from '@/hooks/useIsTauri';
import { designStyles } from '@/components/design/styles';
import type React from 'react';

const modeTabStyle = (active: boolean, variant: 'detail' | 'simple'): React.CSSProperties => ({
  padding: '4px 12px',
  fontSize: '11px',
  fontWeight: active ? 600 : 400,
  fontFamily: designStyles.root.fontFamily as string,
  cursor: 'pointer',
  border: 'none',
  borderRadius: '3px',
  background: active
    ? variant === 'detail' ? '#1A1A1A' : '#2563EB'
    : 'transparent',
  color: active ? '#fff' : 'var(--design-muted)',
  transition: 'background 0.15s, color 0.15s',
});

function AppHeader() {
  const isTauri = useIsTauri();
  const mode = useExamStore((s) => s.settings.mode);
  const setSetting = useExamStore((s) => s.setSetting);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 24px',
        borderBottom: '1px solid var(--design-border)',
        flexShrink: 0,
        gap: '12px',
        minHeight: '44px',
        flexWrap: 'wrap',
      } as React.CSSProperties}>
        <h1 style={{ ...designStyles.appHeaderH1, flexShrink: 0 } as React.CSSProperties}>추정 분할 점수 계산기</h1>
        <div style={{ display: 'flex', flexShrink: 0, gap: '4px', background: 'var(--design-border)', padding: '3px', borderRadius: '5px' }}>
          <button
            style={modeTabStyle(mode === 'detail', 'detail')}
            onClick={() => setSetting('mode', 'detail')}
          >상세</button>
          <button
            style={modeTabStyle(mode === 'simple', 'simple')}
            onClick={() => setSetting('mode', 'simple')}
          >간편</button>
        </div>
        <span
          role="link"
          tabIndex={0}
          style={{
            ...designStyles.textSmall,
            ...designStyles.textMuted,
            textDecoration: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: '"Brush Script MT", "Segoe Script", cursive',
            fontSize: '14px',
            flexShrink: 0,
          } as React.CSSProperties}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          onClick={() => {
            if (isTauri) {
              import('@tauri-apps/plugin-shell').then(m => m.open('https://dorm.dev')).catch(() => {});
            } else {
              window.open('https://dorm.dev', '_blank');
            }
          }}
        >Made by DoRm</span>
        {!isTauri && (
          <button
            style={{
              background: '#1A1A1A',
              color: '#EBE8E3',
              border: 'none',
              padding: '3px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: designStyles.root.fontFamily as string,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            } as React.CSSProperties}
            onClick={() => setDownloadOpen(true)}
            title="데이터가 외부로 나가지 않고 내 컴퓨터에 저장되게 하세요!"
          >데스크톱 앱 다운로드</button>
        )}
        {isTauri && (
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' } as React.CSSProperties}>
            <HeaderMetaFields />
          </div>
        )}
        <nav style={{ ...designStyles.appHeaderNav, flexShrink: 0, marginLeft: 'auto' } as React.CSSProperties}>
          {isTauri && <FileMenu />}
          <button style={designStyles.navLink as React.CSSProperties} onClick={() => setHelpOpen(true)}>도움말</button>
          <button style={designStyles.navLink as React.CSSProperties} onClick={() => setSettingsOpen(true)}>설정</button>
        </nav>
      </header>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      {!isTauri && <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} />}
    </>
  );
}

function App() {
  const isTauri = useIsTauri();
  useDarkMode();
  useAutoSave();

  const mode = useExamStore((s) => s.settings.mode);
  const onboardingCompleted = useExamStore((s) => s.settings.onboardingCompleted);
  const [showOnboarding, setShowOnboarding] = useState(!onboardingCompleted);

  return (
    <TooltipProvider>
      {isTauri && <UpdateBanner />}
      <div className="design-surface">
        <DesignLayout
          header={<AppHeader />}
          leftPane={mode === 'simple' ? <SimpleLeftPane /> : <LeftPane />}
          rightPane={mode === 'simple' ? <SimpleRightPane /> : <RightPane />}
        />
      </div>
      <OnboardingModal
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

