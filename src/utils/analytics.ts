/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactGA from 'react-ga4';
import type { Gender, PersonalityType } from '../types';

const ga4 = (ReactGA as any).default || ReactGA;

// GA4 초기화
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (measurementId) {
    ga4.initialize(measurementId);
    console.log('GA4 initialized with ID:', measurementId);
  } else {
    console.warn('GA4 Measurement ID not found');
  }
};

// 이벤트 추적 함수들
export const analytics = {
  // 테스트 시작
  trackTestStarted: () => {
    ga4.event({
      category: 'Test',
      action: 'test_started',
      label: '밤BTI 테스트 시작'
    });
  },

  // 성별 선택
  trackGenderSelected: (gender: Gender) => {
    ga4.event({
      category: 'User',
      action: 'gender_selected',
      label: gender === 'male' ? '남성' : '여성'
    });

    // 사용자 속성 설정
    ga4.set({ gender });
  },

  // 질문 답변
  trackQuestionAnswered: (questionId: number, answer: string, questionNumber: number) => {
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
  trackTestCompleted: (resultType: PersonalityType, gender: Gender | null, totalQuestions: number) => {
    ga4.event({
      category: 'Test',
      action: 'test_completed',
      label: resultType,
      nonInteraction: false,
      // 커스텀 파라미터
      result_type: resultType,
      gender: gender || 'unknown',
      total_questions: totalQuestions
    } as any);

    // 사용자 속성 업데이트
    ga4.set({
      result_type: resultType,
      gender: gender || 'unknown'
    });
  },

  // 결과 확인
  trackResultViewed: (resultType: PersonalityType) => {
    ga4.event({
      category: 'Test',
      action: 'result_viewed',
      label: resultType,
      result_type: resultType
    } as any);
  },

  // 테스트 재시작
  trackTestRestarted: () => {
    ga4.event({
      category: 'Test',
      action: 'test_restarted',
      label: '다시 테스트하기'
    });
  },

  // 페이지뷰 추적 (화면 전환 시)
  trackPageView: (screenName: string) => {
    ga4.send({
      hitType: 'pageview',
      page: `/${screenName}`,
      title: screenName
    });
  },

  // 카카오톡 공유
  trackKakaoShare: (resultType: PersonalityType) => {
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

  // 이미지 다운로드
  trackImageDownload: (resultType: PersonalityType) => {
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
    ga4.event({
      category: 'Share',
      action: 'native_share',
      label: resultType,
      result_type: resultType,
      share_platform: 'native'
    } as any);
  }
};
