import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const [count, setCount] = useState(2847);

  const formatNumber = useCallback(
    (n: number) => n.toLocaleString('ko-KR'),
    [],
  );

  useEffect(() => {
    let first = true;
    const tick = () => {
      const delay = first
        ? 1000 + Math.random() * 500    // 첫 틱: 1~1.5초
        : 3000 + Math.random() * 5000;  // 이후: 3~8초
      first = false;
      const timer = setTimeout(() => {
        setCount((c) => c + (Math.random() < 0.7 ? 1 : 2));
        tick();
      }, delay);
      return timer;
    };
    const timer = tick();
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.4 }}
        className="text-3xl mb-2"
      >
        🌙
      </motion.p>

      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="mb-4 text-center select-none"
      >
        <span className="inline-flex items-baseline gap-0.5">
          <span className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-pink-200 drop-shadow-[0_0_25px_rgba(244,114,182,0.5)]">
            밤
          </span>
          <span className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-neon-purple via-neon-magenta to-neon-pink neon-text">
            bti
          </span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-xl md:text-2xl text-gray-300 mb-3 text-center break-keep"
      >
        다들 숨기고 있지만, 유형은 있어!
      </motion.p>

      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-base text-gray-500 mb-8 text-center break-keep"
      >
        12문제 · 1분이면 끝
      </motion.p>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-14 py-5 text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 text-white rounded-full neon-border hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
      >
        내 밤 유형 알아보기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="mt-4 text-sm text-gray-500"
      >
        🔥 지금까지 {formatNumber(count)}명 참여
      </motion.p>

    </motion.div>
  );
}
