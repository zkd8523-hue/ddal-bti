import { motion, AnimatePresence } from 'framer-motion';
import type { Question as QuestionType } from '../types';

interface QuestionProps {
  question: QuestionType;
  currentIndex: number;
  previousIndex: number;
  totalQuestions: number;
  onAnswer: (point: string) => void;
  onBack: () => void;
}

export default function Question({
  question,
  currentIndex,
  previousIndex,
  totalQuestions,
  onAnswer,
  onBack,
}: QuestionProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const previousProgress = previousIndex >= 0
    ? ((previousIndex + 1) / totalQuestions) * 100
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      {/* 진행률 바 */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>문제 {currentIndex + 1}</span>
          <span>{totalQuestions}개 중</span>
        </div>
        <div
          className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label={`${totalQuestions}개 중 ${currentIndex + 1}번째 문제`}
        >
          <motion.div
            initial={{ width: `${previousProgress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full"
            style={{ background: 'var(--grad-btn, linear-gradient(to right, rgb(244, 114, 182), rgb(253, 164, 175)))' }}
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
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-white break-keep"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {question.question}
          </motion.h2>

          <div className="space-y-4">
            {/* 선택지 A */}
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.optionA.point)}
              className="w-full p-5 md:p-6 text-left text-base md:text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-purple transition-all duration-200 break-keep leading-snug"
            >
              {question.optionA.text}
            </motion.button>

            {/* 선택지 B */}
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.optionB.point)}
              className="w-full p-5 md:p-6 text-left text-base md:text-lg bg-gray-800 hover:bg-gray-750 rounded-xl border-2 border-transparent hover:border-neon-magenta transition-all duration-200 break-keep leading-snug"
            >
              {question.optionB.text}
            </motion.button>
          </div>

          {/* 뒤로가기 버튼 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={onBack}
            className="mt-8 mx-auto flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">이전 질문</span>
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
