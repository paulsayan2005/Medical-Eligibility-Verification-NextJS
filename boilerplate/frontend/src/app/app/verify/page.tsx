'use client';

import { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ShieldCheck, Lock, UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// API imports
import { createEligibilityPrivateState, hashPolicyId } from '@midnight-ntwrk/contract';
import { configureProviders, deployEligibilityContract, joinEligibilityContract, verifyEligibility } from '../../../api';

export default function VerificationPage() {
  const { connectorAPI, walletAPI, contractAddress, setContractAddress, triggerUpdate, isConnected, setIsModalOpen } = useWallet();
  
  const [age, setAge] = useState<string>('25');
  const [policyId, setPolicyId] = useState<string>('POLICY-12345');
  const [minAge, setMinAge] = useState<string>('18');
  
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<boolean | null>(null);

  const PREPROD_DEPLOYED_CONTRACT = '059a46718d749105f2e4819242a95edc8dfa8ff784c91a038d73d0d8e23777cf';

  const getPrivateState = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 255) throw new Error('Age must be 0-255');
    return createEligibilityPrivateState(ageNum, hashPolicyId(policyId.trim()));
  };

  const cleanAddress = (addr: string) => {
    let clean = addr.trim();
    if (clean.startsWith('0x')) clean = clean.slice(2);
    return clean;
  };

  const ensureWalletConnected = () => {
    if (!isConnected || !walletAPI) {
      setIsModalOpen(true);
      throw new Error('Please connect your Midnight Lace Wallet (or select Demo Wallet) first.');
    }
  };

  const handleDeploy = async () => {
    try {
      ensureWalletConnected();
      setLoading('Deploying Contract...');
      setError('');
      setResult(null);
      const providers = await configureProviders(connectorAPI, walletAPI);
      const state = getPrivateState();
      const deployed = await deployEligibilityContract(providers, state);
      setContractAddress(deployed.deployTxData.public.contractAddress as string);
      triggerUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  };

  const handleJoin = async () => {
    try {
      ensureWalletConnected();
      const targetAddress = cleanAddress(contractAddress || PREPROD_DEPLOYED_CONTRACT);
      if (!targetAddress) throw new Error('Enter a contract address first');
      setLoading('Joining Contract...');
      setError('');
      setResult(null);
      const providers = await configureProviders(connectorAPI, walletAPI);
      const state = getPrivateState();
      await joinEligibilityContract(providers, targetAddress, state);
      if (!contractAddress) setContractAddress(targetAddress);
      triggerUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  };

  const handleVerify = async () => {
    try {
      ensureWalletConnected();
      const targetAddress = cleanAddress(contractAddress || PREPROD_DEPLOYED_CONTRACT);
      setLoading('Generating Zero-Knowledge Proof...');
      setError('');
      setResult(null);
      
      const minAgeNum = parseInt(minAge, 10);
      if (isNaN(minAgeNum) || minAgeNum < 0 || minAgeNum > 255) throw new Error('Min Age must be 0-255');
      
      const providers = await configureProviders(connectorAPI, walletAPI);
      const state = getPrivateState();
      const isEligible = await verifyEligibility(providers, targetAddress, minAgeNum, state);
      if (!contractAddress) setContractAddress(targetAddress);
      setResult(isEligible);
      triggerUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Verify Eligibility</h2>
        <p className="text-muted-foreground">Generate a Zero-Knowledge proof of your medical attributes.</p>
      </div>

      {!isConnected && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400">Wallet not connected</p>
              <p className="text-muted-foreground mt-0.5">Connect your Midnight Lace Wallet to deploy contracts and generate ZK proofs.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="shrink-0 gap-1.5 shadow-sm">
            Connect Wallet
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Private Data
            </CardTitle>
            <CardDescription>
              This data remains on your device and is never sent to the network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Age</label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Policy ID</label>
              <Input type="text" value={policyId} onChange={(e) => setPolicyId(e.target.value)} />
            </div>
            
            <div className="rounded-lg border border-dashed p-4 flex flex-col items-center justify-center text-center bg-muted/50 text-muted-foreground mt-4">
              <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-sm font-medium text-foreground">Upload Medical ID</span>
              <span className="text-xs">Optional: Attach encrypted supporting documents</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Verification Rules
              </CardTitle>
              <CardDescription>
                The public conditions required by the service provider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Contract Address</label>
                  {!contractAddress && (
                    <button
                      type="button"
                      onClick={() => setContractAddress(PREPROD_DEPLOYED_CONTRACT)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Use Preprod Contract
                    </button>
                  )}
                </div>
                <Input 
                  placeholder={PREPROD_DEPLOYED_CONTRACT}
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Required Minimum Age</label>
                <Input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleDeploy} disabled={!!loading}>
                {loading === 'Deploying Contract...' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Deploy
              </Button>
              <Button variant="outline" onClick={handleJoin} disabled={!!loading}>
                {loading === 'Joining Contract...' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join
              </Button>
              <Button className="flex-1" onClick={handleVerify} disabled={!!loading}>
                {loading === 'Generating Zero-Knowledge Proof...' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Proof
              </Button>
            </CardFooter>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive text-sm flex gap-3">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            {result !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center shadow-sm ${result ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}>
                  {result ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 mb-4 text-green-500" />
                      <h3 className="text-2xl font-bold mb-1">Eligible</h3>
                      <p className="text-sm opacity-80">ZK Proof verified successfully on-chain.</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 mb-4 text-red-500" />
                      <h3 className="text-2xl font-bold mb-1">Not Eligible</h3>
                      <p className="text-sm opacity-80">The private data does not satisfy the requirements.</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
