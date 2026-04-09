import { useState } from 'react';
import { DesignLayout } from '@/components/design';
import { LeftPane } from '@/components/shared/LeftPane';
import { RightPane } from '@/components/shared/RightPane';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { OnboardingModal } from '@/components/shared/OnboardingModal';
import { HelpDialog } from '@/components/shared/HelpDialog';
import { SettingsDialog } from '@/components/shared/SettingsDialog';
import { FileMenu } from '@/components/shared/FileMenu';
import { HeaderMetaFields } from '@/components/shared/HeaderMetaFields';
import { useExamStore } from '@/store/examStore';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { UpdateBanner } from '@/components/shared/UpdateBanner';
import { designStyles } from '@/components/design/styles';
import type React from 'react';

function AppHeader() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header style={designStyles.appHeader as React.CSSProperties}>
        <div style={designStyles.appHeaderLeft as React.CSSProperties}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' } as React.CSSProperties}>
              <h1 style={designStyles.appHeaderH1 as React.CSSProperties}>추정 분할 점수 계산기</h1>
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
                } as React.CSSProperties}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                onClick={async () => {
                  try {
                    const { open } = await import('@tauri-apps/plugin-shell');
                    await open('https://dorm-green.vercel.app/');
                  } catch {
                    window.open('https://dorm-green.vercel.app/', '_blank');
                  }
                }}
              >Made by DoRm</span>
            </div>
          </div>
          <HeaderMetaFields />
        </div>
        <nav style={designStyles.appHeaderNav as React.CSSProperties}>
          <FileMenu />
          <button style={designStyles.navLink as React.CSSProperties} onClick={() => setHelpOpen(true)}>도움말</button>
          <button style={designStyles.navLink as React.CSSProperties} onClick={() => setSettingsOpen(true)}>설정</button>
        </nav>
      </header>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

function App() {
  useDarkMode();
  useAutoSave();

  const onboardingCompleted = useExamStore((s) => s.settings.onboardingCompleted);
  const [showOnboarding, setShowOnboarding] = useState(!onboardingCompleted);

  return (
    <TooltipProvider>
      <UpdateBanner />
      <div className="design-surface">
        <DesignLayout
          header={<AppHeader />}
          leftPane={<LeftPane />}
          rightPane={<RightPane />}
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
