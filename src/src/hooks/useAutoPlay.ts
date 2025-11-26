import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoPlayOptions {
  totalSteps: number;
  interval?: number;
  onStepChange?: (step: number) => void;
}

export const useAutoPlay = ({
  totalSteps,
  interval = 2000,
  onStepChange,
}: UseAutoPlayOptions) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 播放控制
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // 步骤控制
  const goToStep = useCallback(
    (step: number) => {
      const clampedStep = Math.max(0, Math.min(step, totalSteps - 1));
      setCurrentStep(clampedStep);
      onStepChange?.(clampedStep);
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev < totalSteps - 1 ? prev + 1 : 0;
      onStepChange?.(next);
      return next;
    });
  }, [totalSteps, onStepChange]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev > 0 ? prev - 1 : totalSteps - 1;
      onStepChange?.(next);
      return next;
    });
  }, [totalSteps, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    clearTimer();
    onStepChange?.(0);
  }, [clearTimer, onStepChange]);

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, interval);
    }

    return clearTimer;
  }, [isPlaying, interval, nextStep, clearTimer]);

  // 组件卸载时清理
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    toggle,
    goToStep,
    nextStep,
    prevStep,
    reset,
    totalSteps,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
};
