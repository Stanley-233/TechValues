import { useState, useCallback, useMemo } from 'react';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { AXES } from './utils/calculator';
import ideologies from './data/ideologies.json';
import tags from './data/tags.json';
import questions from './data/questions.json';
import './App.css';

function parseUrlResults() {
  const params = new URLSearchParams(window.location.search);
  const axesParam = params.get('a');
  const tagsParam = params.get('t');

  if (!axesParam) return null;

  const axisValues = axesParam.split(',').map(Number);
  if (axisValues.length !== 4 || axisValues.some(isNaN)) return null;

  const scores = {};
  AXES.forEach((axis, i) => {
    scores[axis] = Math.max(0, Math.min(100, axisValues[i]));
  });

  const ideologyMatches = ideologies.ideologies
    .map(ideology => {
      let distance = 0;
      AXES.forEach(axis => {
        distance += Math.pow(scores[axis] - ideology.stats[axis], 2);
      });
      distance = Math.sqrt(distance);
      const maxDistance = Math.sqrt(AXES.length * 10000);
      const match = Math.round((1 - distance / maxDistance) * 100);
      return { ...ideology, match };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  let topTags = [];
  if (tagsParam) {
    const tagIds = tagsParam.split(',');
    topTags = tagIds
      .map(id => tags.tags.find(t => t.id === id))
      .filter(Boolean)
      .slice(0, 5);
  }

  return { scores, ideologyMatches, topTags };
}

function App() {
  const urlResults = useMemo(() => parseUrlResults(), []);
  const [phase, setPhase] = useState(urlResults ? 'results' : 'intro');
  const [results, setResults] = useState(urlResults);

  const handleComplete = useCallback((calculatedResults) => {
    setResults(calculatedResults);
    setPhase('results');
  }, []);

  const handleRestart = useCallback(() => {
    setResults(null);
    setPhase('intro');
    window.history.replaceState({}, '', window.location.pathname);
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
              测试共有 <strong>{questions.questions.length}</strong> 道题目，涵盖四个维度：
            </p>
            <ul className="dimension-list">
              <li><span className="dim-tag dim-1">免费 vs 商业</span></li>
              <li><span className="dim-tag dim-2">开源 vs 闭源</span></li>
              <li><span className="dim-tag dim-3">个体 vs 中心化</span></li>
              <li><span className="dim-tag dim-4">自由 vs 安全</span></li>
            </ul>
            <p className="hint">
              没有正确或错误的答案，请选择第一时间最符合你想法的选项。
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
