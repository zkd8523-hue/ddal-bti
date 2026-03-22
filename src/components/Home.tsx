import { motion } from 'framer-motion';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-6 neon-text text-center break-keep"
      >
        밤BTI
      </motion.h1>

      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="text-xl md:text-2xl text-gray-300 mb-2 text-center break-keep"
      >
        16가지 은밀한 취향
      </motion.p>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        className="text-lg md:text-xl text-neon-purple mb-10 text-center max-w-sm break-keep leading-relaxed"
      >
        12문제로 완벽 분석
      </motion.p>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-magenta rounded-full neon-border hover:shadow-2xl transition-all duration-300 animate-pulse-glow"
      >
        시작하기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.6 }}
        className="mt-8 text-sm text-gray-500"
      >
        ⚠️ 성인 유머가 포함되어 있습니다
      </motion.p>
    </motion.div>
  );
}
