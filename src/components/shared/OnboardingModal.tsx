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
        className="sm:max-w-md"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontSize: '13px', fontWeight: 500 }}>
            NEIS 분할점수 계산기 안내
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          {onboardingSteps.map((_, i) => (
            <div
              key={i}
              style={{
                height: '2px',
                flex: 1,
                backgroundColor: i <= step ? '#1A1A1A' : '#D4D1C9',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>

        {/* Step content with animation */}
        <div style={{ position: 'relative', minHeight: '120px', overflow: 'hidden' }}>
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
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  marginBottom: '8px',
                }}
              >
                {current.title}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#6B6861',
                  lineHeight: '1.6',
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
              color: '#6B6861',
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
                backgroundColor: '#1A1A1A',
                color: '#EBE8E3',
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
