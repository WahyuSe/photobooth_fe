import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoBooth App — Capture Your Moments',
  description: 'Aplikasi photobooth modern dengan fitur edit template, kirim email, dan cetak foto langsung.',
  keywords: ['photobooth', 'foto', 'print', 'email', 'template', 'capture'],
  openGraph: {
    title: 'PhotoBooth App',
    description: 'Capture momen terbaikmu dengan style!',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
