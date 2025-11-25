import { Button } from '@/components/ui/button';
import { GameMode, GameStatus } from '@/types/game';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  score: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

export const GameControls = ({
  status,
  mode,
  score,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
}: GameControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <div className="text-sm text-muted-foreground mb-1">SCORE</div>
        <div className="text-5xl font-bold text-primary neon-text">{score}</div>
      </div>

      {/* Mode Selection */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <div className="text-sm text-muted-foreground mb-3">GAME MODE</div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            onClick={() => status === 'idle' && onModeChange('walls')}
            disabled={status !== 'idle'}
            className="w-full"
          >
            Walls
          </Button>
          <Button
            variant={mode === 'pass-through' ? 'default' : 'outline'}
            onClick={() => status === 'idle' && onModeChange('pass-through')}
            disabled={status !== 'idle'}
            className="w-full"
          >
            Pass-Through
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {mode === 'walls' 
            ? 'Hit the wall = game over' 
            : 'Pass through walls to the other side'
          }
        </p>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        {status === 'idle' && (
          <Button onClick={onStart} className="w-full gap-2" size="lg">
            <Play className="w-5 h-5" />
            Start Game
          </Button>
        )}
        
        {status === 'playing' && (
          <Button onClick={onPause} variant="secondary" className="w-full gap-2" size="lg">
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}
        
        {status === 'paused' && (
          <Button onClick={onResume} className="w-full gap-2" size="lg">
            <Play className="w-5 h-5" />
            Resume
          </Button>
        )}
        
        {(status === 'game-over' || status === 'paused') && (
          <Button onClick={onReset} variant="outline" className="w-full gap-2" size="lg">
            <RotateCcw className="w-5 h-5" />
            New Game
          </Button>
        )}
      </div>

      {/* Controls Info */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-semibold mb-2">CONTROLS</div>
          <div>↑ ↓ ← → - Move snake</div>
          <div>SPACE - Pause/Resume</div>
        </div>
      </div>
    </div>
  );
};
