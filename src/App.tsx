import { useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
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
  const modeHintSeen = useExamStore((s) => s.settings.modeHintSeen);
  const onboardingCompleted = useExamStore((s) => s.settings.onboardingCompleted);
  const showModeHint = onboardingCompleted && !modeHintSeen;
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
        <div style={{ position: 'relative', flexShrink: 0 } as React.CSSProperties}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--design-border)', padding: '3px', borderRadius: '5px' }}>
            <button
              style={{
                ...modeTabStyle(mode === 'detail', 'detail'),
                ...(showModeHint ? { boxShadow: '0 0 0 2px #2563EB, 0 0 0 5px rgba(37,99,235,0.30)' } : null),
              } as React.CSSProperties}
              onClick={() => { setSetting('mode', 'detail'); setSetting('modeHintSeen', true); }}
            >상세</button>
            <button
              style={modeTabStyle(mode === 'simple', 'simple')}
              onClick={() => { setSetting('mode', 'simple'); setSetting('modeHintSeen', true); }}
            >간편</button>
          </div>
          {showModeHint && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                zIndex: 50,
                width: '250px',
                maxWidth: '70vw',
                background: '#1A1A1A',
                color: '#fff',
                padding: '11px 13px',
                borderRadius: '6px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
                fontSize: '12px',
                lineHeight: 1.55,
                fontFamily: designStyles.root.fontFamily as string,
              } as React.CSSProperties}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '26px',
                  width: '10px',
                  height: '10px',
                  background: '#1A1A1A',
                  transform: 'rotate(45deg)',
                } as React.CSSProperties}
              />
              <div style={{ marginBottom: '9px' }}>
                지금은 <strong>간편 모드</strong>예요. 문항별 예상 정답률을 직접 넣어 <strong>더 세밀하게 조정</strong>하려면 위 <strong>‘상세’</strong>를 눌러보세요.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' } as React.CSSProperties}>
                <button
                  onClick={() => setSetting('modeHintSeen', true)}
                  style={{
                    background: '#fff',
                    color: '#1A1A1A',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: designStyles.root.fontFamily as string,
                  } as React.CSSProperties}
                >알겠어요</button>
              </div>
            </div>
          )}
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

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crash:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
          <h2>앱 오류가 발생했습니다</h2>
          <p style={{ color: '#666', marginTop: 8 }}>
            앱 데이터를 초기화하면 해결될 수 있습니다.
          </p>
          <button
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            데이터 초기화 후 새로고침
          </button>
          <pre style={{ marginTop: 16, fontSize: 11, color: '#999', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;

