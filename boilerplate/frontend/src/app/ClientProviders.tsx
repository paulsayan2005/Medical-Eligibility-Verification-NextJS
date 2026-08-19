'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { WalletProvider } from '../context/WalletContext';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ThemeProvider>
  );
}
