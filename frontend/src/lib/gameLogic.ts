import { Direction, Position, Snake, GameState, GameMode } from '@/types/game';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const oppositeDirection: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const createInitialGameState = (mode: GameMode): GameState => ({
  snake: {
    body: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ],
    direction: 'RIGHT',
  },
  food: generateFood([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]),
  score: 0,
  status: 'idle',
  mode,
});

export const generateFood = (snakeBody: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snakeBody.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export const getNextHeadPosition = (head: Position, direction: Direction): Position => {
  const moves = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  };

  return {
    x: head.x + moves[direction].x,
    y: head.y + moves[direction].y,
  };
};

export const wrapPosition = (pos: Position): Position => ({
  x: (pos.x + GRID_SIZE) % GRID_SIZE,
  y: (pos.y + GRID_SIZE) % GRID_SIZE,
});

export const isOutOfBounds = (pos: Position): boolean => {
  return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE;
};

export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};

export const moveSnake = (gameState: GameState): GameState => {
  const { snake, food, score, mode } = gameState;
  let newHead = getNextHeadPosition(snake.body[0], snake.direction);

  // Handle walls vs pass-through
  if (mode === 'pass-through') {
    newHead = wrapPosition(newHead);
  } else if (isOutOfBounds(newHead)) {
    return { ...gameState, status: 'game-over' };
  }

  // Check self collision
  if (checkSelfCollision(newHead, snake.body)) {
    return { ...gameState, status: 'game-over' };
  }

  const newBody = [newHead, ...snake.body];
  const ateFood = checkFoodCollision(newHead, food);

  if (!ateFood) {
    newBody.pop();
  }

  return {
    ...gameState,
    snake: { ...snake, body: newBody },
    food: ateFood ? generateFood(newBody) : food,
    score: ateFood ? score + 10 : score,
  };
};

export const changeDirection = (currentDirection: Direction, newDirection: Direction): Direction => {
  if (oppositeDirection[currentDirection] === newDirection) {
    return currentDirection;
  }
  return newDirection;
};
