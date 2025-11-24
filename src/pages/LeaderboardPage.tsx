import { Header } from '@/components/Layout/Header';
import { Leaderboard } from '@/components/Leaderboard/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Leaderboard />
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
