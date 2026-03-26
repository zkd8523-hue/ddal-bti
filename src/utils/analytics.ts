/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactGA from 'react-ga4';
import type { PersonalityType } from '../types';

const ga4 = (ReactGA as any).default || ReactGA;

let isGAInitialized = false;

// GA4 초기화
export const initGA = () => {
  if (isGAInitialized) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (measurementId) {
    ga4.initialize(measurementId, {
      testMode: import.meta.env.MODE === 'development',
      gaOptions: {
        site_speed_sample_rate: 100
      }
    });
    isGAInitialized = true;
    console.log('✅ GA4 initialized with ID:', measurementId);
    // 초기 페이지뷰는 trackPageView(screen)에서 처리하므로 여기서는 생략
  } else {
    console.warn('❌ GA4 Measurement ID not found. VITE_GA_MEASUREMENT_ID 환경변수를 확인하세요.');
  }
};

  // 이벤트 추적 함수들
export const analytics = {
  // 테스트 시작
  trackTestStarted: () => {
    console.log('📊 GA Event: test_started');
    ga4.event({
      category: 'Test',
      action: 'test_started',
      label: '밤bti 테스트 시작'
    });
  },

  // 질문 답변
  trackQuestionAnswered: (questionId: number, answer: string, questionNumber: number) => {
    // 너무 많은 로그를 방지하기 위해 주석 처리하거나 필요 시에만
    // console.log(`📊 GA Event: question_answered (${questionNumber}/12)`);
    ga4.event({
      category: 'Test',
      action: 'question_answered',
      label: `질문 ${questionNumber}`,
      value: questionId,
      nonInteraction: false,
      transport: 'beacon',
      // 커스텀 파라미터
      question_id: questionId,
      answer: answer,
      question_number: questionNumber
    } as any);
  },

  // 테스트 완료
  trackTestCompleted: (resultType: PersonalityType, totalQuestions: number) => {
    console.log('📊 GA Event: test_completed', { resultType });
    ga4.event({
      category: 'Test',
      action: 'test_completed',
      label: resultType,
      nonInteraction: false,
      result_type: resultType,
      total_questions: totalQuestions
    } as any);

    ga4.set({
      result_type: resultType,
    });
  },

  // 결과 확인
  trackResultViewed: (resultType: PersonalityType) => {
    console.log('📊 GA Event: result_viewed', resultType);
    ga4.event({
      category: 'Test',
      action: 'result_viewed',
      label: resultType,
      result_type: resultType
    } as any);
  },

  // 테스트 재시작
  trackTestRestarted: () => {
    console.log('📊 GA Event: test_restarted');
    ga4.event({
      category: 'Test',
      action: 'test_restarted',
      label: '다시 테스트하기'
    });
  },

  // 페이지뷰 추적 (화면 전환 시)
  trackPageView: (screenName: string) => {
    console.log(`🚀 GA PageView: /${screenName}`);
    ga4.send({
      hitType: 'pageview',
      page: `/${screenName}`,
      page_location: `${window.location.origin}/${screenName}${window.location.search}`,
      title: screenName
    });
  },

  // 카카오톡 공유
  trackKakaoShare: (resultType: PersonalityType) => {
    console.log('📊 GA Event: kakao_share', resultType);
    ga4.event({
      category: 'Share',
      action: 'kakao_share',
      label: resultType,
      result_type: resultType,
      share_platform: 'kakao'
    } as any);
  },

  // 추천 상품 클릭
  trackProductClick: (productName: string, productLink: string, resultType: PersonalityType, position: number) => {
    console.log('📊 GA Event: select_item', { productName, position });
    ga4.event({
      category: 'Ecommerce',
      action: 'select_item',
      label: productName,
      value: position,
      item_name: productName,
      item_id: productName,
      item_url: productLink,
      item_list_name: 'Recommended Products',
      result_type: resultType,
      index: position
    } as any);
  },

  // 추천 상품 노출 (CTR 계산용)
  trackProductImpression: (productName: string, resultType: PersonalityType, position: number) => {
    ga4.event({
      category: 'Ecommerce',
      action: 'view_item_list',
      label: productName,
      item_name: productName,
      item_id: productName,
      item_list_name: 'Recommended Products',
      result_type: resultType,
      index: position
    } as any);
  },

  // 인스타그램 스토리 공유
  trackInstagramShare: (resultType: PersonalityType) => {
    console.log('📊 GA Event: instagram_share', resultType);
    ga4.event({
      category: 'Share',
      action: 'instagram_share',
      label: resultType,
      result_type: resultType,
      share_platform: 'instagram'
    } as any);
  },

  // 이미지 다운로드
  trackImageDownload: (resultType: PersonalityType) => {
    console.log('📊 GA Event: image_download', resultType);
    ga4.event({
      category: 'Share',
      action: 'image_download',
      label: resultType,
      result_type: resultType,
      share_platform: 'image'
    } as any);
  },

  // 링크 복사
  trackLinkCopy: (resultType: PersonalityType) => {
    console.log('📊 GA Event: link_copy', resultType);
    ga4.event({
      category: 'Share',
      action: 'link_copy',
      label: resultType,
      result_type: resultType,
      share_platform: 'clipboard'
    } as any);
  },

  // X(트위터) 공유
  trackTwitterShare: (resultType: PersonalityType) => {
    console.log('📊 GA Event: twitter_share', resultType);
    ga4.event({
      category: 'Share',
      action: 'twitter_share',
      label: resultType,
      result_type: resultType,
      share_platform: 'twitter'
    } as any);
  },

  // 네이티브 공유
  trackNativeShare: (resultType: PersonalityType) => {
    console.log('📊 GA Event: native_share', resultType);
    ga4.event({
      category: 'Share',
      action: 'native_share',
      label: resultType,
      result_type: resultType,
      share_platform: 'native'
    } as any);
  },

  // 로딩 화면 이탈
  trackLoadingAbandoned: (progressPercent: number) => {
    console.log('📊 GA Event: loading_abandoned', { progressPercent });
    ga4.event({
      category: 'Test',
      action: 'loading_abandoned',
      label: `${progressPercent}%에서 이탈`,
      value: progressPercent,
      progress_percent: progressPercent
    } as any);
  },

  // --- 바이럴 계수(K-factor) 추적 ---

  // 레퍼럴 링크로 최초 도착
  trackReferralArrival: (referrerId: string, visitorId: string) => {
    console.log('📊 GA Event: referral_arrival', { referrerId, visitorId });
    ga4.event({
      category: 'Referral',
      action: 'referral_arrival',
      label: referrerId,
      referrer_id: referrerId,
      visitor_id: visitorId,
    } as any);
  },

  // 레퍼럴 유저 테스트 시작
  trackReferralTestStart: (referrerId: string, visitorId: string) => {
    console.log('📊 GA Event: referral_test_start', { referrerId, visitorId });
    ga4.event({
      category: 'Referral',
      action: 'referral_test_start',
      label: referrerId,
      referrer_id: referrerId,
      visitor_id: visitorId,
    } as any);
  },

  // 레퍼럴 유저 테스트 완료 (전환)
  trackReferralConversion: (referrerId: string, visitorId: string, resultType: PersonalityType) => {
    console.log('📊 GA Event: referral_conversion', { referrerId, visitorId, resultType });
    ga4.event({
      category: 'Referral',
      action: 'referral_conversion',
      label: referrerId,
      referrer_id: referrerId,
      visitor_id: visitorId,
      result_type: resultType,
    } as any);
  },

  // 공유 시 sharer ID 태깅
  trackViralShare: (visitorId: string, platform: string, resultType: PersonalityType) => {
    console.log('📊 GA Event: viral_share', { visitorId, platform, resultType });
    ga4.event({
      category: 'Referral',
      action: 'viral_share',
      label: platform,
      visitor_id: visitorId,
      share_platform: platform,
      result_type: resultType,
    } as any);
  },

  // GA4 유저 프로퍼티 설정
  setUserProperties: (props: Record<string, string>) => {
    ga4.set(props);
  },
};
