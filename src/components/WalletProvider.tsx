"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
// import { DAppConnectorWalletAPI } from "@midnight-ntwrk/wallet-api"; // (To be integrated with Lace)

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const connect = async () => {
    try {
      // Mock for now. We will integrate real Lace connector later in the Midnight phase.
      // const midnightProviders = (window as any).midnight;
      // if (!midnightProviders || !midnightProviders.lace) throw new Error("Lace wallet not found");
      
      setIsConnected(true);
      setAddress("mn_shield_1234567890abcdef");
      setNetwork("Midnight Testnet");
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setNetwork(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, network, connect, disconnect }}>
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
