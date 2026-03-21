import { motion } from 'framer-motion';
import type { Gender } from '../types';

interface GenderSelectProps {
  onSelect: (gender: Gender) => void;
}

export default function GenderSelect({ onSelect }: GenderSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 neon-text"
      >
        당신의 성별을 선택해주세요
      </motion.h2>

      <div className="w-full max-w-md space-y-4">
        {/* 남성 버튼 */}
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, x: 10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('male')}
          className="w-full p-6 text-left text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-purple transition-all duration-200"
        >
          <span className="text-2xl mr-3">👨</span>
          남성
        </motion.button>

        {/* 여성 버튼 */}
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, x: 10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('female')}
          className="w-full p-6 text-left text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-magenta transition-all duration-200"
        >
          <span className="text-2xl mr-3">👩</span>
          여성
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-sm text-gray-400 text-center"
      >
        더 정확한 결과 분석을 위해 사용됩니다
      </motion.p>
    </motion.div>
  );
}
