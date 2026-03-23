import { motion } from 'framer-motion';

interface AdBannerProps {
  variant?: 'result' | 'loading';
}

export default function AdBanner({ variant = 'result' }: AdBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: variant === 'loading' ? 0.5 : 1.5 }}
      className="w-full max-w-2xl mx-auto mt-6"
    >
      {/* 광고 영역 - 실제 배너 이미지/스크립트로 교체 */}
      <a
        href="https://link.coupang.com/a/d8li44"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 md:p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 hover:border-neon-purple/50 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
      >
        {/* 배경 광 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800/50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-105">
          <img
            src="/images/tissue.png"
            alt="크리넥스"
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base md:text-lg text-white group-hover:text-neon-purple transition-colors line-clamp-1">
            🧻 나무야 미안해!
          </p>
          <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2 mt-1 font-light leading-relaxed">
            몇개 안 남았던데.. 로켓배송으로 미리 챙겨!
          </p>
        </div>
        <div className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-neon-purple group-hover:text-white transition-all">
          <span className="text-sm font-bold opacity-70 group-hover:opacity-100">→</span>
        </div>
      </a>
      <p className="text-[10px] text-gray-600 mt-4 text-center opacity-70 italic">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
      </p>
    </motion.div>
  );
}
