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
      label: '밤BTI 테스트 시작'
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
    console.log('📊 GA Event: product_click', { productName, position });
    ga4.event({
      category: 'Affiliate',
      action: 'product_click',
      label: productName,
      value: position,
      product_name: productName,
      product_link: productLink,
      result_type: resultType,
      position: position
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
  }
};
