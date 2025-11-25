import { useEffect, useState } from 'react';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { mockApi } from '@/lib/mockApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<GameMode | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [mode]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.leaderboard.getEntries(mode);
      setEntries(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-primary" />;
    if (index === 1) return <Medal className="w-6 h-6 text-secondary" />;
    if (index === 2) return <Award className="w-6 h-6 text-accent" />;
    return <span className="text-muted-foreground font-bold w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold neon-text">Leaderboard</h2>
        <div className="flex gap-2">
          <Button
            variant={mode === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode(undefined)}
          >
            All
          </Button>
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('walls')}
          >
            Walls
          </Button>
          <Button
            variant={mode === 'pass-through' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('pass-through')}
          >
            Pass-Through
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{entry.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.mode === 'walls' ? 'Walls' : 'Pass-Through'} • {entry.date}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {entry.score}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
