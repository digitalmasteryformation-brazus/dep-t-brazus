import { LoginForm } from './login-form';

export const metadata = { title: 'Connexion — BRAZUS Builder OS' };

export default function LoginPage() {
  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <LoginForm />
    </main>
  );
}
