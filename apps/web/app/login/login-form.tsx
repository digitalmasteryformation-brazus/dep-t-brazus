'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';

/**
 * Connexion sans mot de passe : Magic Link (email) + Google OAuth.
 * Nécessite d'activer ces providers dans Supabase Auth → Providers
 * (action manuelle, non automatisable depuis ici — voir packages/db/README.md).
 */
export function LoginForm() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus('error');
      setError(error.message);
      return;
    }
    setStatus('sent');
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Recevez un lien magique par email, ou connectez-vous avec Google.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {status === 'sent' ? (
          <div className="flex items-center gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Lien envoyé à <strong>{email}</strong>. Vérifiez votre boîte mail.
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'sending'}
            />
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" /> Recevoir un lien magique
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <Button variant="outline" onClick={handleGoogle}>
          Continuer avec Google
        </Button>
      </CardContent>
    </Card>
  );
}
