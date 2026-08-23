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

      // The Midnight 1AM wallet injects itself as mnLace
      const provider =
        midnightProviders.mnLace ??
        midnightProviders["1am"] ??
        midnightProviders.lace ??
        null;

      if (!provider) {
        console.error("Available midnight providers:", Object.keys(midnightProviders));
        throw new Error(
          "Midnight wallet not found. Please install the 1AM extension from the Midnight website and try again."
        );
      }
      
      console.log("Found provider:", provider);
      
      let api;
      
      // Some wallet versions inject the API directly, so it already has a .state() function
      if (typeof provider.state === 'function') {
        console.log("Provider is already the API object");
        api = provider;
      } 
      // The newest 1AM extension uses .connect()
      else if (typeof provider.connect === 'function') {
        console.log("Calling provider.connect()...");
        api = await provider.connect();
      }
      // Legacy Lace extension uses .enable()
      else if (typeof provider.enable === 'function') {
        console.log("Calling provider.enable()...");
        api = await provider.enable();
      } 
      // Fallback for weird edge cases
      else if (typeof provider.api === 'function') {
        console.log("Calling provider.api()...");
        api = await provider.api();
      } else {
        console.error("Unknown provider shape:", provider);
        throw new Error("Wallet provider has an unknown format. Check the console for details.");
      }

      console.log("Wallet connected! API object:", api);
      if (api) {
        console.log("API keys:", Object.keys(api));
      }

      // Retrieve wallet state (address, network, etc.)
      let address = null;
      let networkId = "Midnight Testnet";
      
      try {
        // Helper to safely extract string from weird SDK return types
        const extractString = (val: any): string | null => {
          if (!val) return null;
          if (typeof val === 'string') return val;
          if (val.unshieldedAddress) return String(val.unshieldedAddress);
          if (val.address) return String(val.address);
          
          // If it's still an object, grab the first string value it has
          const firstString = Object.values(val).find(v => typeof v === 'string');
          if (firstString) return String(firstString);
          
          return "Connected"; // Safe fallback
        };

        // Handle new v5 API shape (EIP-6963 style)
        if (typeof api.getUnshieldedAddress === 'function') {
          address = extractString(await api.getUnshieldedAddress());
        } else if (typeof api.getDustAddress === 'function') {
          address = extractString(await api.getDustAddress());
        } else if (typeof api.getShieldedAddresses === 'function') {
          const addresses = await api.getShieldedAddresses();
          address = extractString(addresses[0] ?? null);
        } 
        
        // Handle legacy API shape
        else if (typeof api.state === 'function') {
          const state = await api.state();
          address = extractString(state.address ?? null);
          networkId = state.networkId ?? "Midnight Testnet";
        } else if (api.state && !api.state.call) {
          address = extractString(api.state.address ?? null);
          networkId = api.state.networkId ?? "Midnight Testnet";
        }
        
        // Attempt to get network from v5 API
        if (typeof api.getConfiguration === 'function') {
          const config = await api.getConfiguration();
          if (config && config.network) {
            networkId = config.network;
          }
        }
        
        console.log("Raw address retrieved from wallet API:", address);
      } catch (stateErr) {
        console.warn("Failed to fetch full wallet state, but connection succeeded.", stateErr);
      }

      setIsConnected(true);
      setAddress(address);
      setNetwork(networkId);
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      
      let message = "Failed to connect wallet. ";
      if (err?.message) {
        message += err.message;
      } else if (typeof err === 'string') {
        message += err;
      } else {
        message += "Make sure the 1AM extension is unlocked and this site is allowed.";
      }
      
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
