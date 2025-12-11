import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const fontSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Drift - Your Transition Companion',
  description: 'AI-powered support for navigating life\'s major transitions with confidence and clarity.',
  keywords: ['life transition', 'career change', 'AI companion', 'mental wellness', 'life coaching'],
  authors: [{ name: 'Drift' }],
  openGraph: {
    title: 'Drift - Your Transition Companion',
    description: 'AI-powered support for navigating life\'s major transitions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
