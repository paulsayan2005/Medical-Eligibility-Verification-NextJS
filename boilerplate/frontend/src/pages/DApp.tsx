import { useState } from 'react';
import { type DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api';
import { WalletPanel } from '../components/WalletPanel';
import { EligibilityForm } from '../components/EligibilityForm';
import { PublicStatePanel } from '../components/PublicStatePanel';
import { pino } from 'pino';
import { setLogger } from '../api';

// Initialize global logger for the frontend
const logger = pino({
  level: 'info',
  browser: {
    asObject: false,
  }
});
setLogger(logger);

export const DApp = () => {
  const [connectorAPI, setConnectorAPI] = useState<DAppConnectorAPI | null>(null);
  const [walletAPI, setWalletAPI] = useState<any | null>(null);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  const handleStateUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="header">
        <h1>MedVerify Dashboard</h1>
        <p>Connect your wallet to manage your confidential credentials.</p>
      </header>

      <WalletPanel 
        onConnect={(api, wApi) => {
          setConnectorAPI(api);
          setWalletAPI(wApi);
        }} 
        onDisconnect={() => {
          setConnectorAPI(null);
          setWalletAPI(null);
          setContractAddress('');
        }} 
      />
      
      {connectorAPI && walletAPI && (
        <>
          <EligibilityForm 
            connectorAPI={connectorAPI}
            walletAPI={walletAPI}
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            onStateUpdate={handleStateUpdate}
          />
          
          <PublicStatePanel 
            connectorAPI={connectorAPI}
            walletAPI={walletAPI}
            contractAddress={contractAddress}
            updateTrigger={updateTrigger}
          />
        </>
      )}
    </div>
  );
};
