import { motion } from 'framer-motion';
import { analytics } from '../utils/analytics';
import type { PersonalityType } from '../types';

interface AdBannerProps {
  variant?: 'result' | 'loading';
  resultType?: PersonalityType;
}

export default function AdBanner({ variant = 'result', resultType }: AdBannerProps) {
  const handleClick = () => {
    analytics.trackProductClick(
      '순수한면 제로 순면 생리대 세트',
      'https://link.coupang.com/a/eaPC2u',
      resultType || 'UNKNOWN' as PersonalityType,
      -1 // 배너는 position -1로 표시 (제품 리스트와 구분)
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: variant === 'loading' ? 0.5 : 1.5 }}
      className="w-full max-w-2xl mx-auto mt-3"
    >
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-neon-magenta animate-pulse">🌙</span>
        <p className="text-sm md:text-base text-gray-300 break-keep">
          열정적인 밤을 보낸 다음 날도 편안하게
        </p>
      </div>
      <a
        href="https://link.coupang.com/a/eaPC2u"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-4 p-4 md:p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 hover:border-neon-purple/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
      >
        {/* 배경 광 효과 */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          style={{ background: 'linear-gradient(to right, rgba(244, 114, 182, 0), rgba(244, 114, 182, 0.05), rgba(244, 114, 182, 0))' }}
        />

        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800/50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/pad_zero.png"
            alt="순수한면 제로"
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base md:text-lg text-white group-hover:text-neon-purple transition-colors line-clamp-1">
            순수한면 제로 순면 생리대 세트
          </p>
          <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2 mt-1 font-light leading-relaxed">
            피부걱정 제로, 100% 자연순면커버
          </p>
          <p className="text-xs md:text-sm mt-1.5">
            <span className="text-gray-500 line-through text-xs">30,900원</span>
            <span className="text-neon-purple font-semibold ml-1.5">15,900원</span>
            <span className="text-neon-magenta text-xs ml-1">48%</span>
          </p>
        </div>
        <div className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-neon-purple group-hover:text-white transition-all">
          <span className="text-sm font-bold opacity-70 group-hover:opacity-100">→</span>
        </div>
      </a>
    </motion.div>
  );
}
