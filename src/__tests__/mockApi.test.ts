import { describe, it, expect, beforeEach } from 'vitest';
import { mockApi } from '@/lib/mockApi';

describe('mockApi', () => {
  beforeEach(async () => {
    await mockApi.auth.logout();
  });

  describe('auth', () => {
    it('should login with valid credentials', async () => {
      const user = await mockApi.auth.login('player1@example.com', 'password');
      expect(user.username).toBe('player1');
      expect(user.email).toBe('player1@example.com');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        mockApi.auth.login('invalid@example.com', 'password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should signup new user', async () => {
      const user = await mockApi.auth.signup('newplayer', 'new@example.com', 'password');
      expect(user.username).toBe('newplayer');
      expect(user.email).toBe('new@example.com');
    });

    it('should get current user after login', async () => {
      await mockApi.auth.login('player1@example.com', 'password');
      const currentUser = mockApi.auth.getCurrentUser();
      expect(currentUser?.username).toBe('player1');
    });

    it('should return null after logout', async () => {
      await mockApi.auth.login('player1@example.com', 'password');
      await mockApi.auth.logout();
      const currentUser = mockApi.auth.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('leaderboard', () => {
    it('should get all leaderboard entries', async () => {
      const entries = await mockApi.leaderboard.getEntries();
      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].score).toBeGreaterThanOrEqual(entries[1].score);
    });

    it('should filter entries by mode', async () => {
      const entries = await mockApi.leaderboard.getEntries('walls');
      expect(entries.every(e => e.mode === 'walls')).toBe(true);
    });

    it('should submit score when logged in', async () => {
      await mockApi.auth.login('player1@example.com', 'password');
      await expect(
        mockApi.leaderboard.submitScore(100, 'walls')
      ).resolves.not.toThrow();
    });

    it('should throw error when submitting score without login', async () => {
      await expect(
        mockApi.leaderboard.submitScore(100, 'walls')
      ).rejects.toThrow('Must be logged in');
    });
  });

  describe('spectator', () => {
    it('should get active players', async () => {
      const players = await mockApi.spectator.getActivePlayers();
      expect(players.length).toBeGreaterThan(0);
      expect(players[0].gameState.status).toBe('playing');
    });
  });
});
