import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BRAZUS Builder OS',
  description:
    "L'usine intelligente qui génère automatiquement des plateformes digitales personnalisées (CRM, dashboards, automations) pour vos clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(inter.variable, 'min-h-screen font-sans antialiased')}>
        {children}
      </body>
    </html>
  );
}
