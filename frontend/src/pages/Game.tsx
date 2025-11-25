import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GameState, Direction, GameMode } from '@/types/game';
import { createInitialGameState, moveSnake, changeDirection } from '@/lib/gameLogic';
import { api } from '@/lib/api';
import { GameBoard } from '@/components/Game/GameBoard';
import { GameControls } from '@/components/Game/GameControls';
import { Header } from '@/components/Layout/Header';
import { toast } from 'sonner';

const Game = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<GameMode>('walls');
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(mode));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newState = moveSnake(prev);

        if (newState.status === 'game-over' && prev.status === 'playing') {
          handleGameOver(newState.score);
        }

        return newState;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameState.status]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') {
        if (e.code === 'Space') {
          e.preventDefault();
          if (gameState.status === 'paused') {
            handleResume();
          }
        }
        return;
      }

      let newDirection: Direction | null = null;

      switch (e.key) {
        case 'ArrowUp':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          newDirection = 'RIGHT';
          break;
        case ' ':
          e.preventDefault();
          handlePause();
          return;
      }

      if (newDirection) {
        e.preventDefault();
        setGameState(prev => ({
          ...prev,
          snake: {
            ...prev.snake,
            direction: changeDirection(prev.snake.direction, newDirection!),
          },
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.status, gameState.snake.direction]);

  const handleGameOver = async (score: number) => {
    try {
      await api.leaderboard.submitScore(score, mode);
      toast.success(`Game Over! Score: ${score}`);
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const handleStart = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
  }, []);

  const handlePause = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const handleResume = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
  }, []);

  const handleReset = useCallback(() => {
    setGameState(createInitialGameState(mode));
  }, [mode]);

  const handleModeChange = useCallback((newMode: GameMode) => {
    setMode(newMode);
    setGameState(createInitialGameState(newMode));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <GameBoard gameState={gameState} />
          <div className="w-full lg:w-80">
            <GameControls
              status={gameState.status}
              mode={mode}
              score={gameState.score}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onModeChange={handleModeChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
