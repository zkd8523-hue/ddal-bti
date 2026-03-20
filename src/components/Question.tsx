import { motion, AnimatePresence } from 'framer-motion';
import type { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (point: string) => void;
}

export default function Question({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuestionProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* 진행률 바 */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>문제 {currentIndex + 1}</span>
          <span>{totalQuestions}개 중</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-neon-purple to-neon-magenta"
          />
        </div>
      </div>

      {/* 질문 영역 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="w-full max-w-2xl"
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {question.question}
          </motion.h2>

          <div className="space-y-4">
            {/* 선택지 A */}
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.optionA.point)}
              className="w-full p-6 text-left text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-purple transition-all duration-200"
            >
              {question.optionA.text}
            </motion.button>

            {/* 선택지 B */}
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.optionB.point)}
              className="w-full p-6 text-left text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-magenta transition-all duration-200"
            >
              {question.optionB.text}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
