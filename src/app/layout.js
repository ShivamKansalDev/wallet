import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fido wallet',
  description: 'welcome to Fido'
};

export default async function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
          {children}
      </body>
    </html>
  );
}