import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Eye, LogOut } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold neon-text">SNAKE ARENA</h1>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/game">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Play
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/spectator">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Watch
                </Button>
              </Link>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">
                  {user.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
