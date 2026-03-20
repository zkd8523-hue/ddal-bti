import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import Question from './components/Question';
import Loading from './components/Loading';
import Result from './components/Result';
import LayoutWithSidebarAds from './components/LayoutWithSidebarAds';
import { questions } from './data/questions';
import { results } from './data/results';
import { calculateResult } from './utils/calculateResult';
import type { Screen, Answer, PersonalityType } from './types';

function App() {
  // 화면 상태 관리
  const [screen, setScreen] = useState<Screen>('home');

  // 현재 질문 인덱스
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // 사용자 답변 저장
  const [answers, setAnswers] = useState<Answer[]>([]);

  // 최종 결과 타입
  const [resultType, setResultType] = useState<PersonalityType | null>(null);

  // 테스트 시작
  const handleStart = () => {
    setScreen('question');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  // 답변 선택 처리
  const handleAnswer = (selectedPoint: string) => {
    const currentQuestion = questions[currentQuestionIndex];

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
    setScreen('result');
  };

  // 테스트 재시작
  const handleRestart = () => {
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
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <LayoutWithSidebarAds key="home-wrapper" showAds={true}>
            <Home key="home" onStart={handleStart} />
          </LayoutWithSidebarAds>
        )}

        {screen === 'question' && currentQuestion && (
          <LayoutWithSidebarAds key="question-wrapper" showAds={true}>
            <Question
              key={`question-${currentQuestion.id}`}
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          </LayoutWithSidebarAds>
        )}

        {screen === 'loading' && (
          <Loading key="loading" onComplete={handleLoadingComplete} />
        )}

        {screen === 'result' && resultData && (
          <Result key="result" result={resultData} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
