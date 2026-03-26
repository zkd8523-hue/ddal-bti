import type { ReactNode } from 'react';
import GoogleAdSidebar from './GoogleAdSidebar';

interface LayoutWithSidebarAdsProps {
  children: ReactNode;
  showAds?: boolean;
}

// AdSense 광고 슬롯 ID
const LEFT_AD_SLOT_ID = '2924839631';
const RIGHT_AD_SLOT_ID = '9702267870';

export default function LayoutWithSidebarAds({
  children,
  showAds = true,
}: LayoutWithSidebarAdsProps) {
  return (
    <div className="relative min-h-screen">
      {/* 좌측 광고 */}
      {showAds && (
        <GoogleAdSidebar position="left" adSlot={LEFT_AD_SLOT_ID} />
      )}

      {/* 중앙 콘텐츠 영역 */}
      <div className={`mx-auto ${showAds ? 'lg:px-40 xl:px-60' : ''}`}>
        {children}
      </div>

      {/* 우측 광고 */}
      {showAds && (
        <GoogleAdSidebar position="right" adSlot={RIGHT_AD_SLOT_ID} />
      )}
    </div>
  );
}
