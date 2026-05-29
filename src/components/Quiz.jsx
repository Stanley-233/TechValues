import { useState, useMemo } from 'react';
import questions from '../data/questions.json';
import { calculateResults } from '../utils/calculator';

const OPTIONS = [
  { id: 'strongly_agree', label: '强烈同意', icon: '++' },
  { id: 'agree', label: '同意', icon: '+' },
  { id: 'neutral', label: '中立', icon: '○' },
  { id: 'disagree', label: '不同意', icon: '-' },
  { id: 'strongly_disagree', label: '强烈不同意', icon: '--' }
];

export default function Quiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const question = useMemo(() => questions.questions[current], [current]);
  const progress = ((current) / questions.questions.length) * 100;

  const handleAnswer = (optionId) => {
    const newAnswers = [...answers, { questionId: question.id, option: optionId }];
    setAnswers(newAnswers);

    if (current < questions.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const results = calculateResults(newAnswers);
      onComplete(results);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <main className="quiz">
      <div className="quiz-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{current + 1} / {questions.questions.length}</span>
      </div>

      <div className="question-container">
        <h2 className="question-number">问题 {current + 1}</h2>
        <p className="question-text">{question.text}</p>
      </div>

      <div className="options">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            className="option-btn"
            onClick={() => handleAnswer(option.id)}
          >
            <span className="option-icon">{option.icon}</span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>

      {current > 0 && (
        <button className="btn-back" onClick={handleBack}>
          返回上一题
        </button>
      )}
    </main>
  );
}
