import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 50;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    const isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOccupied) break;
  }
  return newFood;
};

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const directionRef = useRef<Direction>(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Focus game area on mount
  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
    // Initialize food
    setFood(generateFood(INITIAL_SNAKE));
    
    // Load high score
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted && !isGameOver) {
      setIsPaused(p => !p);
      return;
    }

    if (isPaused || isGameOver) return;

    if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      setHasStarted(true);
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [isPaused, isGameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update ref to always have latest direction for the game loop
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused || !hasStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, hasStarted]);

  useEffect(() => {
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [moveSnake, speed]);

  const handleGameOver = () => {
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    directionRef.current = 'UP';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
    setFood(generateFood(INITIAL_SNAKE));
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Score Header */}
      <div className="w-full flex justify-between items-end mb-4 px-4">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm uppercase tracking-widest font-mono">Score</span>
          <span className="text-4xl font-black text-cyan-400 neon-text-cyan font-mono leading-none">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">High Score</span>
          <span className="text-2xl font-bold text-pink-400 neon-text-pink font-mono leading-none">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameAreaRef}
        className="relative bg-gray-950 border-[10px] border-cyan-400 rounded-2xl p-2 neon-border-cyan outline-none"
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="grid gap-[1px] bg-gray-800/30 border border-gray-800 rounded-lg overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full rounded-sm transition-all duration-75
                  ${isSnakeHead ? 'bg-green-400 neon-bg-green z-10 scale-110' : ''}
                  ${isSnakeBody ? 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : ''}
                  ${isFood ? 'bg-pink-500 neon-bg-pink animate-pulse rounded-md scale-75' : ''}
                  ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-gray-900/50' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!hasStarted && !isGameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
            <div className="text-center animate-pulse">
              <p className="text-cyan-400 font-mono text-xl mb-2 neon-text-cyan">PRESS ANY ARROW KEY</p>
              <p className="text-gray-400 font-mono text-sm">TO START NEON RUN</p>
            </div>
          </div>
        )}

        {isPaused && hasStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
            <p className="text-pink-400 font-mono text-3xl font-bold tracking-widest neon-text-pink">PAUSED</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center rounded-xl z-30 border border-pink-500/50">
            <h2 className="text-5xl font-black text-pink-500 neon-text-pink mb-2">SYSTEM FAILURE</h2>
            <p className="text-cyan-400 font-mono text-xl mb-8">FINAL SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold font-mono rounded hover:bg-cyan-400 hover:text-black transition-all neon-border-cyan uppercase tracking-widest"
            >
              Reboot System
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 flex gap-6 text-gray-500 font-mono text-xs">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">W A S D</kbd>
          <span>or Arrows to move</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">SPACE</kbd>
          <span>to pause</span>
        </div>
      </div>
    </div>
  );
}
