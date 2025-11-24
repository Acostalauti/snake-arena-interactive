import { describe, it, expect } from 'vitest';
import { calculateBotDirection } from '@/lib/botLogic';
import { createInitialGameState } from '@/lib/gameLogic';

describe('botLogic', () => {
  describe('calculateBotDirection', () => {
    it('should return valid direction towards food', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.food = { x: 15, y: 10 };
      state.snake.body = [{ x: 10, y: 10 }];
      state.snake.direction = 'RIGHT';

      const direction = calculateBotDirection(state);
      expect(['UP', 'DOWN', 'LEFT', 'RIGHT']).toContain(direction);
    });

    it('should not reverse direction', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.snake.direction = 'RIGHT';
      state.food = { x: 5, y: 10 };

      const direction = calculateBotDirection(state);
      expect(direction).not.toBe('LEFT');
    });

    it('should avoid walls in walls mode', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.snake.body = [{ x: 0, y: 10 }];
      state.snake.direction = 'RIGHT';
      state.food = { x: 5, y: 10 };

      const direction = calculateBotDirection(state);
      expect(direction).not.toBe('LEFT');
    });

    it('should avoid self-collision', () => {
      const state = createInitialGameState('walls');
      state.status = 'playing';
      state.snake.body = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 9, y: 11 },
      ];
      state.snake.direction = 'RIGHT';
      state.food = { x: 10, y: 11 };

      const direction = calculateBotDirection(state);
      expect(direction).not.toBe('DOWN');
    });

    it('should work in pass-through mode', () => {
      const state = createInitialGameState('pass-through');
      state.status = 'playing';
      state.snake.body = [{ x: 19, y: 10 }];
      state.snake.direction = 'RIGHT';
      state.food = { x: 0, y: 10 };

      const direction = calculateBotDirection(state);
      expect(['UP', 'DOWN', 'RIGHT']).toContain(direction);
    });
  });
});
