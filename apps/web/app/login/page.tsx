import { LoginForm } from './login-form';

export const metadata = { title: 'Connexion — BRAZUS Builder OS' };

// Rendu dynamique : le pré-rendu statique du formulaire client Supabase plante
// ("Element type is invalid") avec @supabase/supabase-js récent + export statique Next 14.