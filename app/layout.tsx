import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A2P 10DLC Registration Wizard',
  description: 'Register your brand and campaign for A2P 10DLC messaging',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
