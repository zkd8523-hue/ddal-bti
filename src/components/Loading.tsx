import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { analytics } from '../utils/analytics';

interface LoadingProps {
  onComplete: () => void;
}

const LOADING_DURATION = 1500; // 1.5초

export default function Loading({ onComplete }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 프로그레스 애니메이션 (requestAnimationFrame)
  useEffect(() => {
    const startTime = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      progressRef.current = newProgress;
      setProgress(newProgress);

      if (elapsed < LOADING_DURATION) {
        requestAnimationFrame(updateProgress);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  // 이탈 추적
  const trackAbandonment = useCallback(() => {
    if (!completedRef.current) {
      analytics.trackLoadingAbandoned(Math.round(progressRef.current));
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) trackAbandonment();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', trackAbandonment);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', trackAbandonment);
    };
  }, [trackAbandonment]);

  const getMessage = () => {
    if (progress < 40) return '당신의 솔플 성향을 분석하는 중...';
    if (progress < 75) return '숨겨진 패턴을 찾고 있어요...';
    return '거의 다 됐어요!';
  };

  const roundedProgress = Math.round(progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      {/* 퍼센트 표시 */}
      <p className="text-6xl font-bold neon-text mb-6 tabular-nums">
        {roundedProgress}%
      </p>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full transition-none"
          style={{ background: 'linear-gradient(to right, rgb(244, 114, 182), rgb(253, 164, 175))' }}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 분석 메시지 */}
      <p className="text-lg text-gray-300 text-center mb-8 break-keep">
        {getMessage()}
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-gray-500 text-center text-sm max-w-md"
      >
        🔒 결과는 저장되지 않으며, 오직 당신만 볼 수 있습니다
      </motion.p>
    </motion.div>
  );
}
