import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [clickPower, setClickPower] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Загрузка сохраненного прогресса
  useEffect(() => {
    const savedScore = localStorage.getItem('clicker-score');
    const savedLevel = localStorage.getItem('clicker-level');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedLevel) setLevel(parseInt(savedLevel));
  }, []);

  // Сохранение прогресса
  useEffect(() => {
    localStorage.setItem('clicker-score', score.toString());
    localStorage.setItem('clicker-level', level.toString());
  }, [score, level]);

  // Логика уровней
  useEffect(() => {
    if (score >= 1000) {
      setLevel(5);
      setClickPower(5);
    } else if (score >= 500) {
      setLevel(4);
      setClickPower(4);
    } else if (score >= 200) {
      setLevel(3);
      setClickPower(3);
    } else if (score >= 50) {
      setLevel(2);
      setClickPower(2);
    } else {
      setLevel(1);
      setClickPower(1);
    }
  }, [score]);

  const handleClick = () => {
    setScore(prev => prev + clickPower);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setClickPower(1);
    localStorage.removeItem('clicker-score');
    localStorage.removeItem('clicker-level');
  };

  const getLevelColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];
    return colors[level - 1] || colors[0];
  };

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="game-title">🎮 Кликер-игра</h1>
        
        <div className="stats">
          <div className="score-board">
            <div className="score-label">Очки</div>
            <div className="score-value">{score}</div>
          </div>
          
          <div className="level-info">
            <div 
              className="level-badge" 
              style={{ backgroundColor: getLevelColor() }}
            >
              Уровень {level}
            </div>
            <div className="power-info">💪 Сила: {clickPower}</div>
          </div>
        </div>

        <div className="click-area">
          <button 
            className={`click-button ${isAnimating ? 'animate' : ''}`}
            onClick={handleClick}
          >
            <span className="click-emoji">🎯</span>
            <span className="click-text">КЛИКАЙ!</span>
            <span className="click-power">+{clickPower}</span>
          </button>
        </div>

        <div className="progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(score % 100)}%` }}
            ></div>
          </div>
          <div className="progress-text">
            До следующего уровня: {100 - (score % 100)} очков
          </div>
        </div>

        <button className="reset-button" onClick={resetGame}>
          🔄 Начать заново
        </button>

        <div className="instructions">
          <h3>🎯 Как играть:</h3>
          <p>Кликай на кнопку, чтобы зарабатывать очки!</p>
          <p>С каждым уровнем твоя сила клика увеличивается.</p>
          <p>Уровень 1: +1 очко за клик</p>
          <p>Уровень 2: +2 очка за клик (от 50 очков)</p>
          <p>Уровень 3: +3 очка за клик (от 200 очков)</p>
          <p>Уровень 4: +4 очка за клик (от 500 очков)</p>
          <p>Уровень 5: +5 очков за клик (от 1000 очков)</p>
        </div>
      </div>
    </div>
  );
}

export default App;