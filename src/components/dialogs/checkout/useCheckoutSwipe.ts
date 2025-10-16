import { useRef, useState, useEffect } from 'react';

interface UseCheckoutSwipeProps {
  open: boolean;
  step: number;
  isStep1Valid: () => boolean;
  isStep2Valid: () => boolean;
  setStep: (step: number) => void;
  playSound: (type: 'forward' | 'back' | 'error' | 'success') => void;
}

export const useCheckoutSwipe = ({
  open,
  step,
  isStep1Valid,
  isStep2Valid,
  setStep,
  playSound
}: UseCheckoutSwipeProps) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeHintVisible, setSwipeHintVisible] = useState(true);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        error: [10, 50, 10]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (swipeHintVisible) {
      setSwipeHintVisible(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        if (step === 1 && isStep1Valid()) {
          setStep(2);
          triggerHaptic('medium');
          playSound('forward');
        } else if (step === 2 && isStep2Valid()) {
          setStep(3);
          triggerHaptic('medium');
          playSound('forward');
        } else {
          triggerHaptic('error');
          playSound('error');
        }
      } else {
        if (step > 1) {
          setStep(step - 1);
          triggerHaptic('light');
          playSound('back');
        }
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    if (open) {
      setSwipeHintVisible(true);
      const timer = setTimeout(() => {
        setSwipeHintVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return {
    containerRef,
    swipeHintVisible,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
