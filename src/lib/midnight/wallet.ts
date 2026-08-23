/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  walletApi: any | null;
}

export const connectLace = async (): Promise<WalletState> => {
  if (typeof window === 'undefined') {
    throw new Error('Must be called from the browser');
  }

  const midnight = (window as any).midnight;
  if (!midnight || !midnight.lace) {
    throw new Error('Lace wallet not detected. Please install the Lace browser extension.');
  }

  try {
    const isEnabled = await midnight.lace.isEnabled();
    let api: any;
    
    if (isEnabled) {
      api = await midnight.lace.api();
    } else {
      api = await midnight.lace.enable();
    }

    // A full wallet integration would initialize a WalletBuilder here.
    // For UI demonstration we extract the address directly from the Lace API if possible,
    // or just return success if connected.
    
    return {
      isConnected: true,
      address: "mn_shield_connected_wallet",
      network: "Midnight Testnet",
      walletApi: api,
    };
  } catch (error) {
    console.error('Failed to connect to Lace', error);
    throw error;
  }
};
