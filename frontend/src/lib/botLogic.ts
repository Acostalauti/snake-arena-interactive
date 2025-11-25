import { Direction, Position, GameState } from '@/types/game';
import { getNextHeadPosition, wrapPosition, isOutOfBounds, checkSelfCollision, GRID_SIZE } from './gameLogic';

// Simple bot that tries to reach food while avoiding collisions
export const calculateBotDirection = (gameState: GameState): Direction => {
  const { snake, food, mode } = gameState;
  const head = snake.body[0];
  const currentDirection = snake.direction;

  // Calculate distance to food for each possible direction
  const possibleDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const validMoves: { direction: Direction; distance: number; safety: number }[] = [];

  for (const direction of possibleDirections) {
    // Don't reverse direction
    if (
      (currentDirection === 'UP' && direction === 'DOWN') ||
      (currentDirection === 'DOWN' && direction === 'UP') ||
      (currentDirection === 'LEFT' && direction === 'RIGHT') ||
      (currentDirection === 'RIGHT' && direction === 'LEFT')
    ) {
      continue;
    }

    let newHead = getNextHeadPosition(head, direction);
    
    if (mode === 'pass-through') {
      newHead = wrapPosition(newHead);
    }

    // Check if move is valid
    const isValid = mode === 'pass-through' 
      ? !checkSelfCollision(newHead, snake.body)
      : !isOutOfBounds(newHead) && !checkSelfCollision(newHead, snake.body);

    if (isValid) {
      // Calculate Manhattan distance to food
      let dx = Math.abs(newHead.x - food.x);
      let dy = Math.abs(newHead.y - food.y);

      // In pass-through mode, consider wrapping
      if (mode === 'pass-through') {
        dx = Math.min(dx, GRID_SIZE - dx);
        dy = Math.min(dy, GRID_SIZE - dy);
      }

      const distance = dx + dy;

      // Calculate safety score (distance to own body)
      const safety = calculateSafetyScore(newHead, snake.body);

      validMoves.push({ direction, distance, safety });
    }
  }

  if (validMoves.length === 0) {
    return currentDirection;
  }

  // Sort by distance to food (lower is better) and safety (higher is better)
  validMoves.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) > 2) {
      return a.distance - b.distance;
    }
    return b.safety - a.safety;
  });

  return validMoves[0].direction;
};

const calculateSafetyScore = (pos: Position, body: Position[]): number => {
  let minDistance = Infinity;
  
  for (const segment of body.slice(1)) {
    const distance = Math.abs(pos.x - segment.x) + Math.abs(pos.y - segment.y);
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
};
