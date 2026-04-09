import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { onboardingSteps } from '@/content/help';
import { useExamStore } from '@/store/examStore';
import { designStyles } from '@/components/design/styles';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [neverShow, setNeverShow] = useState(false);
  const setSetting = useExamStore((s) => s.setSetting);

  const isLast = step === onboardingSteps.length - 1;
  const current = onboardingSteps[step];

  function handleClose() {
    if (neverShow || isLast) {
      setSetting('onboardingCompleted', true);
    }
    onOpenChange(false);
  }

  function handleNext() {
    if (isLast) {
      handleClose();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleSkip() {
    setSetting('onboardingCompleted', true);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontSize: '13px', fontWeight: 500 }}>
            추정 분할 점수 계산기 안내
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {onboardingSteps.map((_, i) => (
            <div
              key={i}
              style={{
                height: '2px',
                flex: 1,
                backgroundColor: i <= step ? 'var(--design-fg)' : 'var(--design-border)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>

        {/* Step content with animation */}
        <div style={{ position: 'relative', minHeight: '140px', overflow: 'visible' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
            >
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--design-fg)',
                  marginBottom: '10px',
                }}
              >
                {current.title}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--design-muted)',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                }}
              >
                {current.content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Never show again checkbox on last step */}
        {isLast && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--design-muted)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={neverShow}
              onChange={(e) => setNeverShow(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            다시 보지 않기
          </label>
        )}

        {/* Footer buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px',
          }}
        >
          <button style={designStyles.btnText as React.CSSProperties} onClick={handleSkip}>
            건너뛰기
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 0 && (
              <button style={designStyles.button as React.CSSProperties} onClick={handlePrev}>
                이전
              </button>
            )}
            <button
              style={{
                ...(designStyles.button as React.CSSProperties),
                backgroundColor: 'var(--design-bg-inverted)',
                color: 'var(--design-fg-inverted)',
                border: 'none',
              }}
              onClick={handleNext}
            >
              {isLast ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
