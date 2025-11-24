import { User, LeaderboardEntry, ActivePlayer, GameMode } from '@/types/game';

// Mock data storage
let currentUser: User | null = null;
const mockUsers: User[] = [
  { id: '1', username: 'player1', email: 'player1@example.com' },
  { id: '2', username: 'speedrunner', email: 'speedrunner@example.com' },
  { id: '3', username: 'snakemaster', email: 'snakemaster@example.com' },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'snakemaster', score: 450, mode: 'walls', date: '2024-01-15' },
  { id: '2', username: 'speedrunner', score: 380, mode: 'walls', date: '2024-01-14' },
  { id: '3', username: 'player1', score: 320, mode: 'pass-through', date: '2024-01-13' },
  { id: '4', username: 'gamer99', score: 290, mode: 'walls', date: '2024-01-12' },
  { id: '5', username: 'prosnake', score: 260, mode: 'pass-through', date: '2024-01-11' },
];

// Auth API
export const mockApi = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        currentUser = user;
        return user;
      }
      
      throw new Error('Invalid credentials');
    },

    signup: async (username: string, email: string, password: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: String(mockUsers.length + 1),
        username,
        email,
      };
      mockUsers.push(newUser);
      currentUser = newUser;
      return newUser;
    },

    logout: async (): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      currentUser = null;
    },

    getCurrentUser: (): User | null => {
      return currentUser;
    },
  },

  leaderboard: {
    getEntries: async (mode?: GameMode): Promise<LeaderboardEntry[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let entries = [...mockLeaderboard];
      if (mode) {
        entries = entries.filter(e => e.mode === mode);
      }
      return entries.sort((a, b) => b.score - a.score);
    },

    submitScore: async (score: number, mode: GameMode): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!currentUser) {
        throw new Error('Must be logged in to submit score');
      }

      const entry: LeaderboardEntry = {
        id: String(mockLeaderboard.length + 1),
        username: currentUser.username,
        score,
        mode,
        date: new Date().toISOString().split('T')[0],
      };
      mockLeaderboard.push(entry);
    },
  },

  spectator: {
    getActivePlayers: async (): Promise<ActivePlayer[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock active players that will be animated by bot logic
      return [
        {
          id: '1',
          username: 'speedrunner',
          score: 120,
          mode: 'walls',
          gameState: {
            snake: { body: [{ x: 10, y: 10 }], direction: 'RIGHT' },
            food: { x: 15, y: 10 },
            score: 120,
            status: 'playing',
            mode: 'walls',
          },
        },
        {
          id: '2',
          username: 'snakemaster',
          score: 180,
          mode: 'pass-through',
          gameState: {
            snake: { body: [{ x: 8, y: 8 }], direction: 'UP' },
            food: { x: 8, y: 3 },
            score: 180,
            status: 'playing',
            mode: 'pass-through',
          },
        },
      ];
    },
  },
};
