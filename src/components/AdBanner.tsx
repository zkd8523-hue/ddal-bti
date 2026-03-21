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
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-4 flex flex-row items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex-shrink-0 shadow-md">
            <img 
              src="/images/tissue.png" 
              alt="크리넥스" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">AD</span>
              <p className="text-gray-300 text-sm font-bold truncate">
                🧻 이거 없으면 큰일 날껄?
              </p>
            </div>
            <p className="text-gray-500 text-xs truncate">
              몇 개 안 남았는데... 로켓배송으로 미리 쟁여두자!
            </p>
          </div>
          <a
            href="https://link.coupang.com/a/d8li44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-xs font-bold text-gray-300 transition-colors shrink-0"
          >
            보러가기
          </a>
        </div>
        <p className="text-[10px] text-gray-600 text-center py-1 bg-gray-900">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다
        </p>
      </div>
    </motion.div>
  );
}
