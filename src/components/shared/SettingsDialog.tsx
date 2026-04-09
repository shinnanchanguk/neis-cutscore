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
  borderBottom: '1px solid #D4D1C9',
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
  backgroundColor: active ? '#1A1A1A' : 'transparent',
  color: active ? '#EBE8E3' : '#1A1A1A',
  flex: 1,
});

const dangerButtonStyle: CSSProperties = {
  ...designStyles.button,
  borderColor: '#1A1A1A',
  color: '#1A1A1A',
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
      <DialogContent className="sm:max-w-md">
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

          {/* 예상 분포 표준편차 */}
          <div style={sectionStyle}>
            <label style={{ ...designStyles.label, marginBottom: '8px', display: 'block' }}>
              예상 분포 표준편차 (σ)
            </label>
            <input
              type="number"
              min={5}
              max={30}
              value={settings.sigma}
              onChange={e => {
                const val = Number(e.target.value);
                if (val >= 5 && val <= 30) {
                  setSetting('sigma', val);
                }
              }}
              style={{ ...designStyles.input, width: '120px' } as CSSProperties}
            />
            <div style={helperTextStyle}>
              사후 검증용 예상 분포 계산에 사용됩니다. 기본값 15를 권장합니다.
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
