import { Header } from '@/components/Layout/Header';
import { SpectatorView } from '@/components/Spectator/SpectatorView';

const SpectatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SpectatorView />
      </main>
    </div>
  );
};

export default SpectatorPage;
