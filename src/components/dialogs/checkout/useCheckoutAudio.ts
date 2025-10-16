import { useEffect, useRef } from 'react';

export const useCheckoutAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (type: 'forward' | 'back' | 'error' | 'success') => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch (type) {
      case 'forward':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        break;
      case 'back':
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(300, now);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        break;
    }
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  };

  return { playSound };
};
