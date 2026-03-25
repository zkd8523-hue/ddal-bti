import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import Question from './components/Question';
import Loading from './components/Loading';
import Result from './components/Result';
import LayoutWithSidebarAds from './components/LayoutWithSidebarAds';
import { questions } from './data/questions';
import { results } from './data/results';
import { calculateResult } from './utils/calculateResult';
import { initGA, analytics } from './utils/analytics';
import { getVisitorId, captureReferrer, getReferrerId, isReferralTracked, markReferralTracked } from './utils/referral';
import type { Screen, Answer, PersonalityType } from './types';

const clearUrlParams = () => {
  const url = new URL(window.location.href);
  // type 파라미터만 제거, UTM 파라미터는 보존 (GA4 소스 추적용)
  url.searchParams.delete('type');
  window.history.replaceState({}, '', url.toString());
};

const getInitialState = () => {
  // URL 쿼리 파라미터로 공유된 결과인지 확인
  const params = new URLSearchParams(window.location.search);
  const sharedType = params.get('type');

  if (sharedType) {
    return {
      screen: 'result' as Screen,
      currentQuestionIndex: 0,
      answers: [],
      resultType: sharedType as PersonalityType,
      isShared: true
    };
  }

  return {
    screen: 'home' as Screen,
    currentQuestionIndex: 0,
    answers: [],
    resultType: null,
    isShared: false
  };
};

function App() {
  const initialState = getInitialState();

  // GA4 초기화 + 레퍼럴 추적
  useEffect(() => {
    initGA();

    const visitorId = getVisitorId();
    const referrerId = captureReferrer();

    analytics.setUserProperties({ visitor_id: visitorId });

    if (referrerId && !isReferralTracked()) {
      analytics.trackReferralArrival(referrerId, visitorId);
      markReferralTracked();
    }
  }, []);

  // 화면 상태 관리
  const [screen, setScreen] = useState<Screen>(initialState.screen);

  // 현재 질문 인덱스
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialState.currentQuestionIndex);

  // 사용자 답변 저장
  const [answers, setAnswers] = useState<Answer[]>(initialState.answers);

  // 최종 결과 타입
  const [resultType, setResultType] = useState<PersonalityType | null>(initialState.resultType);

  // 공유받은 결과인지 여부
  const [isShared, setIsShared] = useState<boolean>(initialState.isShared || false);

  // 화면 전환 시 페이지뷰 추적
  useEffect(() => {
    analytics.trackPageView(screen);
  }, [screen]);

  // 결과 화면 진입 시 추가 이벤트 추적
  useEffect(() => {
    if (screen === 'result' && resultType) {
      analytics.trackResultViewed(resultType);
    }
  }, [screen, resultType]);

  // 테스트 시작
  const handleStart = () => {
    analytics.trackTestStarted();

    const referrerId = getReferrerId();
    if (referrerId) {
      analytics.trackReferralTestStart(referrerId, getVisitorId());
    }

    clearUrlParams();
    setIsShared(false);
    setScreen('question');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  // 이전 질문으로 돌아가기
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // 마지막 답변 제거하고 이전 질문으로
      setAnswers(answers.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // 첫 번째 질문이면 홈으로
      setAnswers([]);
      setScreen('home');
    }
  };

  // 답변 선택 처리
  const handleAnswer = (selectedPoint: string) => {
    const currentQuestion = questions[currentQuestionIndex];

    // GA4 이벤트 추적
    analytics.trackQuestionAnswered(
      currentQuestion.id,
      selectedPoint,
      currentQuestionIndex + 1
    );

    // 답변 저장
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedPoint,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // 다음 질문으로 이동 또는 로딩 화면으로
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 질문이면 결과 계산 후 로딩 화면으로
      const calculatedType = calculateResult(newAnswers);
      setResultType(calculatedType);
      setScreen('loading');
    }
  };

  // 로딩 완료 후 결과 화면으로
  const handleLoadingComplete = () => {
    // 테스트 완료 이벤트 추적
    if (resultType) {
      analytics.trackTestCompleted(resultType, questions.length);

      const referrerId = getReferrerId();
      if (referrerId) {
        analytics.trackReferralConversion(referrerId, getVisitorId(), resultType);
      }
    }
    setScreen('result');
  };

  // 테스트 재시작
  const handleRestart = () => {
    analytics.trackTestRestarted();
    clearUrlParams();
    setIsShared(false);
    setScreen('home');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  // 현재 질문 가져오기
  const currentQuestion = questions[currentQuestionIndex];

  // 결과 데이터 가져오기
  const resultData = resultType
    ? (results.find((r) => r.type === resultType) || {
        type: resultType,
        title: `준비 중인 유형입니다 (${resultType})`,
        emoji: '❓',
        femaleTitle: `준비 중인 유형입니다 (${resultType})`,
        femaleEmoji: '❓',
        subtitle: '',
        description: [
          '테스트 채점 로직은 정상 작동했습니다!',
          '다만 아직 캐릭터 상세 설명이 모두 추가되지 않아 임시 화면이 나옵니다.',
          '곧 재미있는 결과 더미로 채워질 예정입니다.'
        ],
        traits: {
          axis1: '준비 중',
          axis2: '준비 중',
          axis3: '준비 중',
          axis4: '준비 중',
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-900">
      <LayoutWithSidebarAds showAds={screen !== 'loading'}>
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <Home key="home" onStart={handleStart} />
          )}

          {screen === 'question' && currentQuestion && (
            <Question
              key={`question-${currentQuestion.id}`}
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          )}

          {screen === 'loading' && (
            <Loading
              key="loading"
              onComplete={handleLoadingComplete}
            />
          )}

          {screen === 'result' && resultData && (
            <Result key="result" result={resultData} isShared={isShared} onRestart={handleRestart} />
          )}
        </AnimatePresence>
      </LayoutWithSidebarAds>
    </div>
  );
}

export default App;
