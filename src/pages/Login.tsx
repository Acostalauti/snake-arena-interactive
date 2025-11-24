import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/Auth/LoginForm';
import { Header } from '@/components/Layout/Header';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <LoginForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
