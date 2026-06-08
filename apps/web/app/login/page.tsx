import { LoginForm } from './login-form';

export const metadata = { title: 'Connexion — BRAZUS Builder OS' };

// Rendu dynamique : le pré-rendu statique du formulaire client Supabase plante
// ("Element type is invalid") avec @supabase/supabase-js récent + export statique Next 14.
// Sans incidence : la page de connexion est intrinsèquement interactive et propre à l'utilisateur.
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <LoginForm />
    </main>
  );
}
