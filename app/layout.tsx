import { Inter } from 'next/font/google';
import Header from '@/components/Layout/Header';
import InstantDBProvider from '@/components/Layout/InstantDBProvider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Générateur de Meme',
  description: 'Créez et partagez vos memes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <InstantDBProvider>
          <Header />
          {children}
        </InstantDBProvider>
      </body>
    </html>
  );
}

