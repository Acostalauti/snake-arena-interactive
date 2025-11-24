import { Link } from 'react-router-dom';
import { SignUpForm } from '@/components/Auth/SignUpForm';
import { Header } from '@/components/Layout/Header';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <SignUpForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
};

export default SignUp;
