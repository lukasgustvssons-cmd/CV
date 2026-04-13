import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TailorCV | AI-tailored applications',
  description: 'Land more interviews with AI-tailored applications.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
