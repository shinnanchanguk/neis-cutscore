import { CSSProperties } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useExamStore } from '@/store/examStore';
import { designStyles } from '@/components/design/styles';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sectionStyle: CSSProperties = {
  paddingBottom: '20px',
  marginBottom: '20px',
  borderBottom: '1px solid var(--design-border)',
};

const sectionLastStyle: CSSProperties = {
  paddingBottom: 0,
  marginBottom: 0,
  borderBottom: 'none',
};

const sectionTitleStyle: CSSProperties = {
  ...designStyles.sectionTitle,
  marginBottom: '12px',
};

const helperTextStyle: CSSProperties = {
  ...designStyles.textSmall,
  ...designStyles.textMuted,
  marginTop: '4px',
};

const themeButtonStyle = (active: boolean): CSSProperties => ({
  ...designStyles.button,
  backgroundColor: active ? 'var(--design-bg-inverted)' : 'transparent',
  color: active ? 'var(--design-fg-inverted)' : 'var(--design-fg)',
  flex: 1,
});

const dangerButtonStyle: CSSProperties = {
  ...designStyles.button,
  borderColor: 'var(--design-fg)',
  color: 'var(--design-fg)',
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const settings = useExamStore(s => s.settings);
  const setSetting = useExamStore(s => s.setSetting);
  const resetToDefaults = useExamStore(s => s.resetToDefaults);

  const handleOnboardingReset = () => {
    setSetting('onboardingCompleted', false);
    onOpenChange(false);
  };

  const handleResetAll = () => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      resetToDefaults();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* 테마 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>테마</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={themeButtonStyle(settings.darkMode === 'light')}
                onClick={() => setSetting('darkMode', 'light')}
              >
                라이트
              </button>
              <button
                style={themeButtonStyle(settings.darkMode === 'dark')}
                onClick={() => setSetting('darkMode', 'dark')}
              >
                다크
              </button>
              <button
                style={themeButtonStyle(settings.darkMode === 'system')}
                onClick={() => setSetting('darkMode', 'system')}
              >
                시스템 따라가기
              </button>
            </div>
          </div>
          {/* 평가단계 */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>평가단계</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={themeButtonStyle(settings.includeE미도달 === true)}
                onClick={() => setSetting('includeE미도달', true)}
              >
                5수준(A-E) + 미도달
              </button>
              <button
                style={themeButtonStyle(settings.includeE미도달 === false)}
                onClick={() => setSetting('includeE미도달', false)}
              >
                5수준(A-E)
              </button>
            </div>
            <div style={helperTextStyle}>
              "5수준+미도달" 선택 시 E/미도달 경계 분할점수가 추가로 표시됩니다. NEIS 입력 표의 열(A~E)은 동일합니다.
            </div>
          </div>

          {/* 기타 */}
          <div style={sectionLastStyle}>
            <div style={sectionTitleStyle}>기타</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                style={designStyles.button}
                onClick={handleOnboardingReset}
              >
                온보딩 다시 보기
              </button>
              <button
                style={dangerButtonStyle}
                onClick={handleResetAll}
              >
                모든 데이터 초기화
              </button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
