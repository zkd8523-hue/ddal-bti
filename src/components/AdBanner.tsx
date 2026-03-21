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
      <div className="relative rounded-xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-5">
          <div className="flex items-center gap-3 md:gap-5 flex-1">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl p-1.5 md:p-2 flex-shrink-0 shadow-md">
              <img 
                src="/images/tissue.png" 
                alt="크리넥스" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-1.5 mb-1">
                <span className="text-[9px] md:text-[10px] text-gray-500 bg-gray-800 px-1 py-0.5 rounded border border-gray-700 mt-0.5 shrink-0">AD</span>
                <p className="text-gray-300 text-sm md:text-base font-bold line-clamp-2 leading-tight">
                  🧻 나무야 미안해!
                </p>
              </div>
              <p className="text-gray-500 text-[11px] md:text-xs line-clamp-2 leading-snug">
                이건 생존템이야. 로켓배송으로 미리 챙겨!
              </p>
            </div>
          </div>
          <a
            href="https://link.coupang.com/a/d8li44"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg md:rounded-full text-[13px] md:text-xs font-bold text-white md:text-gray-300 transition-colors shrink-0 mt-1 md:mt-0"
          >
            보러가기
          </a>
        </div>
        <p className="text-[9px] md:text-[10px] text-gray-600 text-center py-1 bg-gray-900 px-2 line-clamp-1 md:line-clamp-none">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
        </p>
      </div>
    </motion.div>
  );
}
