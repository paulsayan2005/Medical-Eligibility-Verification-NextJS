/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const midnightProviders = (window as any).midnight;

      if (!midnightProviders) {
        throw new Error("No Midnight wallet detected. Please install the 1AM wallet extension.");
      }

      // 1AM wallet uses window.midnight['1am']
      // Lace (legacy) uses window.midnight.lace
      const provider =
        midnightProviders["1am"] ??
        midnightProviders.lace ??
        null;

      if (!provider) {
        throw new Error(
          "1AM wallet not found. Please install the 1AM extension from the Midnight website and try again."
        );
      }

      // Trigger the wallet popup to request DApp connection
      const api = await provider.enable();

      // Retrieve wallet state (address, network, etc.)
      const state = await api.state();

      setIsConnected(true);
      setAddress(state.address ?? null);
      setNetwork(state.networkId ?? "Midnight Testnet");
    } catch (err: any) {
      const message =
        err?.message?.includes("1AM wallet not found") ||
        err?.message?.includes("No Midnight wallet")
          ? err.message
          : "Failed to connect wallet. Make sure the 1AM extension is installed and this site is allowed.";
      setError(message);
      setIsConnected(false);
      setAddress(null);
      setNetwork(null);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setNetwork(null);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{ isConnected, address, network, connecting, error, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
