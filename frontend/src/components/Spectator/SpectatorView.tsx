import { useEffect, useState } from 'react';
import { ActivePlayer } from '@/types/game';
import { mockApi } from '@/lib/mockApi';
import { GameBoard } from '@/components/Game/GameBoard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { moveSnake, changeDirection } from '@/lib/gameLogic';
import { calculateBotDirection } from '@/lib/botLogic';

export const SpectatorView = () => {
  const [players, setPlayers] = useState<ActivePlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (players.length === 0) return;

    const interval = setInterval(() => {
      setPlayers(prev => 
        prev.map(player => {
          if (player.gameState.status !== 'playing') return player;

          // Calculate bot's next move
          const botDirection = calculateBotDirection(player.gameState);
          const newDirection = changeDirection(player.gameState.snake.direction, botDirection);
          
          const updatedState = {
            ...player.gameState,
            snake: {
              ...player.gameState.snake,
              direction: newDirection,
            },
          };

          const newState = moveSnake(updatedState);

          return {
            ...player,
            score: newState.score,
            gameState: newState,
          };
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, [players.length]);

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.spectator.getActivePlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to load active players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading active games...</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">No active games right now</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold neon-text">Watch Live Games</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {players.map(player => (
          <Card key={player.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{player.username}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {player.mode === 'walls' ? 'Walls' : 'Pass-Through'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Score: {player.score}
                  </span>
                </div>
              </div>
              {player.gameState.status === 'playing' && (
                <Badge className="bg-primary/20 text-primary">
                  ● LIVE
                </Badge>
              )}
            </div>
            
            <div className="flex justify-center">
              <div className="scale-75 origin-top">
                <GameBoard gameState={player.gameState} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
