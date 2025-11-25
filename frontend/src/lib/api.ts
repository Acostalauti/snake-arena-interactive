import { User, LeaderboardEntry, ActivePlayer, GameMode } from '@/types/game';

// Base API URL - will be proxied by Vite dev server
const API_BASE = '';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (like logout)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// Auth API
export const api = {
    auth: {
        login: async (email: string, password: string): Promise<User> => {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password }),
            });
            return handleResponse<User>(response);
        },

        signup: async (username: string, email: string, password: string): Promise<User> => {
            const response = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password }),
            });
            return handleResponse<User>(response);
        },

        logout: async (): Promise<void> => {
            const response = await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            await handleResponse<void>(response);
        },

        getCurrentUser: async (): Promise<User | null> => {
            try {
                const response = await fetch(`${API_BASE}/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    return null;
                }

                return handleResponse<User>(response);
            } catch (error) {
                // If not authenticated, return null instead of throwing
                return null;
            }
        },
    },

    leaderboard: {
        getEntries: async (mode?: GameMode): Promise<LeaderboardEntry[]> => {
            const url = mode
                ? `${API_BASE}/leaderboard?mode=${mode}`
                : `${API_BASE}/leaderboard`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            return handleResponse<LeaderboardEntry[]>(response);
        },

        submitScore: async (score: number, mode: GameMode): Promise<void> => {
            const response = await fetch(`${API_BASE}/leaderboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ score, mode }),
            });
            await handleResponse<void>(response);
        },
    },

    spectator: {
        getActivePlayers: async (): Promise<ActivePlayer[]> => {
            const response = await fetch(`${API_BASE}/spectator/active`, {
                method: 'GET',
                credentials: 'include',
            });
            return handleResponse<ActivePlayer[]>(response);
        },
    },
};
