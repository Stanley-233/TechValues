import { useState, useCallback } from 'react';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  const [phase, setPhase] = useState('intro');
  const [results, setResults] = useState(null);

  const handleComplete = useCallback((calculatedResults) => {
    setResults(calculatedResults);
    setPhase('results');
  }, []);

  const handleRestart = useCallback(() => {
    setResults(null);
    setPhase('intro');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TechValues</h1>
        <p className="subtitle">计算机科技理念测试</p>
      </header>

      {phase === 'intro' && (
        <main className="intro">
          <div className="intro-content">
            <p>
              欢迎来到 TechValues 测试！这个测试将帮助你了解自己在计算机科技领域的理念倾向。
            </p>
            <p>
              测试共有 <strong>40</strong> 道题目，涵盖四个维度：
            </p>
            <ul className="dimension-list">
              <li><span className="dim-tag dim-1">免费 vs 商业</span></li>
              <li><span className="dim-tag dim-2">开源 vs 闭源</span></li>
              <li><span className="dim-tag dim-3">个体 vs 中心化</span></li>
              <li><span className="dim-tag dim-4">自由 vs 安全</span></li>
            </ul>
            <p className="hint">
              没有正确或错误的答案，请选择最符合你想法的选项。
            </p>
            <button className="btn-start" onClick={() => setPhase('quiz')}>
              开始测试
            </button>
          </div>
        </main>
      )}

      {phase === 'quiz' && (
        <Quiz onComplete={handleComplete} />
      )}

      {phase === 'results' && results && (
        <Results results={results} onRestart={handleRestart} />
      )}

      <footer className="app-footer">
        <p>灵感来源：<a href="https://8values.github.io/" target="_blank" rel="noopener noreferrer">8values</a></p>
      </footer>
    </div>
  );
}

export default App;
