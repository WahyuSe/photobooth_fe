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
      <body>{children}</body>
    </html>
  );
}
