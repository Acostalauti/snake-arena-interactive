import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  moveSnake,
  changeDirection,
  checkSelfCollision,
  checkFoodCollision,
  wrapPosition,
  isOutOfBounds,
} from '@/lib/gameLogic';
import { Position } from '@/types/game';

describe('gameLogic', () => {
  describe('createInitialGameState', () => {
    it('should create initial state with walls mode', () => {
      const state = createInitialGameState('walls');
      expect(state.mode).toBe('walls');
      expect(state.status).toBe('idle');
      expect(state.score).toBe(0);
      expect(state.snake.body.length).toBe(3);
      expect(state.snake.direction).toBe('RIGHT');
    });

    it('should create initial state with pass-through mode', () => {
      const state = createInitialGameState('pass-through');
      expect(state.mode).toBe('pass-through');
    });
  });

  describe('changeDirection', () => {
    it('should allow perpendicular direction changes', () => {
      expect(changeDirection('UP', 'LEFT')).toBe('LEFT');
      expect(changeDirection('LEFT', 'DOWN')).toBe('DOWN');
    });

    it('should prevent opposite direction changes', () => {
      expect(changeDirection('UP', 'DOWN')).toBe('UP');
      expect(changeDirection('LEFT', 'RIGHT')).toBe('LEFT');
    });
  });

  describe('wrapPosition', () => {
    it('should wrap position around grid', () => {
      expect(wrapPosition({ x: -1, y: 10 })).toEqual({ x: 19, y: 10 });
      expect(wrapPosition({ x: 20, y: 10 })).toEqual({ x: 0, y: 10 });
      expect(wrapPosition({ x: 10, y: -1 })).toEqual({ x: 10, y: 19 });
      expect(wrapPosition({ x: 10, y: 20 })).toEqual({ x: 10, y: 0 });
    });
  });

  describe('isOutOfBounds', () => {
    it('should detect out of bounds positions', () => {
      expect(isOutOfBounds({ x: -1, y: 10 })).toBe(true);
      expect(isOutOfBounds({ x: 20, y: 10 })).toBe(true);
      expect(isOutOfBounds({ x: 10, y: 10 })).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('should detect collision with snake body', () => {
      const body: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      expect(checkSelfCollision({ x: 4, y: 5 }, body)).toBe(true);
      expect(checkSelfCollision({ x: 6, y: 5 }, body)).toBe(false);
    });
  });

  describe('checkFoodCollision', () => {
    it('should detect collision with food', () => {
      const food = { x: 10, y: 10 };
      expect(checkFoodCollision({ x: 10, y: 10 }, food)).toBe(true);
      expect(checkFoodCollision({ x: 11, y: 10 }, food)).toBe(false);
    });
  });

  describe('moveSnake', () => {
    it('should move snake forward without eating food', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      const newState = moveSnake(state);
      
      expect(newState.snake.body[0].x).toBe(state.snake.body[0].x + 1);
      expect(newState.snake.body.length).toBe(state.snake.body.length);
    });

    it('should grow snake when eating food', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.food = { x: state.snake.body[0].x + 1, y: state.snake.body[0].y };
      
      const newState = moveSnake(state);
      expect(newState.snake.body.length).toBe(state.snake.body.length + 1);
      expect(newState.score).toBe(10);
    });

    it('should end game on wall collision in walls mode', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.snake.body = [{ x: 19, y: 10 }, { x: 18, y: 10 }];
      state.snake.direction = 'RIGHT';
      
      const newState = moveSnake(state);
      expect(newState.status).toBe('game-over');
    });

    it('should wrap around in pass-through mode', () => {
      const state = createInitialGameState('pass-through');
      state.status = 'playing';
      state.snake.body = [{ x: 19, y: 10 }, { x: 18, y: 10 }];
      state.snake.direction = 'RIGHT';
      
      const newState = moveSnake(state);
      expect(newState.snake.body[0].x).toBe(0);
      expect(newState.status).toBe('playing');
    });

    it('should end game on self collision', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.snake.body = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 9, y: 11 },
        { x: 10, y: 11 },
      ];
      state.snake.direction = 'DOWN';
      
      const newState = moveSnake(state);
      expect(newState.status).toBe('game-over');
    });
  });
});
