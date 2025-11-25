import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, Trophy, Eye, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 neon-text">SNAKE ARENA</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Classic snake game with modern twist. Compete, watch, and dominate the leaderboard.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/game">
                <Button size="lg" className="gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Play Now
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 text-center space-y-3 hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Two Game Modes</h3>
            <p className="text-sm text-muted-foreground">
              Play classic walls mode or pass-through for extra challenge
            </p>
          </Card>

          <Card className="p-6 text-center space-y-3 hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">Global Leaderboard</h3>
            <p className="text-sm text-muted-foreground">
              Compete with players worldwide and climb to the top
            </p>
          </Card>

          <Card className="p-6 text-center space-y-3 hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold">Spectator Mode</h3>
            <p className="text-sm text-muted-foreground">
              Watch other players in real-time and learn new strategies
            </p>
          </Card>
        </div>

        {/* Quick Links */}
        {user && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/game">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-primary" />
                    <div>
                      <div className="font-semibold">Play Game</div>
                      <div className="text-xs text-muted-foreground">Start playing</div>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link to="/leaderboard">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-secondary" />
                    <div>
                      <div className="font-semibold">Leaderboard</div>
                      <div className="text-xs text-muted-foreground">Top scores</div>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link to="/spectator">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-accent" />
                    <div>
                      <div className="font-semibold">Watch Live</div>
                      <div className="text-xs text-muted-foreground">View games</div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
