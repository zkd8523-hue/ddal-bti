import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProps {
  onComplete: () => void;
}

const loadingMessages = [
  '당신의 솔플 성향을 분석하는 중...',
  '숨겨진 패턴을 찾고 있어요...',
  '거의 다 됐어요! 🎉',
];

export default function Loading({ onComplete }: LoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // 메시지 순차 전환 (약 0.83초마다)
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 833);

    // 2.5초 후 완료
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-20 h-20 mb-8 border-4 border-neon-purple border-t-transparent rounded-full"
      />

      {/* 순차적으로 나타나는 메시지 */}
      <div className="h-24 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={messageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-center mb-4 neon-text"
          >
            {loadingMessages[messageIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 bg-neon-magenta rounded-full"
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-gray-400 text-center max-w-md"
      >
        🔒 결과는 저장되지 않으며,<br />
        오직 당신만 볼 수 있습니다
      </motion.p>
    </motion.div>
  );
}
