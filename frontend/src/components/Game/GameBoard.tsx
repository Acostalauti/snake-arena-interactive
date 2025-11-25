import { GameState } from '@/types/game';
import { GRID_SIZE, CELL_SIZE } from '@/lib/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const { snake, food } = gameState;

  const isSnakeSegment = (x: number, y: number) => {
    return snake.body.some(segment => segment.x === x && segment.y === y);
  };

  const isSnakeHead = (x: number, y: number) => {
    return snake.body[0].x === x && snake.body[0].y === y;
  };

  const isFood = (x: number, y: number) => {
    return food.x === x && food.y === y;
  };

  return (
    <div 
      className="relative game-glow rounded-lg overflow-hidden border-2 border-primary/20"
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        backgroundColor: 'hsl(var(--game-grid))',
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid" style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          return (
            <div
              key={i}
              className={`border border-border/5 transition-all duration-100 ${
                isSnakeHead(x, y)
                  ? 'bg-game-snake scale-110 rounded-sm shadow-lg shadow-game-snake/50'
                  : isSnakeSegment(x, y)
                  ? 'bg-game-snake/90 rounded-sm'
                  : isFood(x, y)
                  ? 'bg-game-food scale-110 rounded-full animate-pulse shadow-lg shadow-game-food/50'
                  : ''
              }`}
            />
          );
        })}
      </div>

      {/* Game Over Overlay */}
      {gameState.status === 'game-over' && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-destructive neon-text">GAME OVER</h2>
            <p className="text-xl text-muted-foreground">Score: {gameState.score}</p>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {gameState.status === 'paused' && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <h2 className="text-3xl font-bold text-secondary neon-text">PAUSED</h2>
        </div>
      )}
    </div>
  );
};
