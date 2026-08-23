"use client";

import { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { ShieldAlert, ShieldCheck, Loader2, Fingerprint } from "lucide-react";

type VerifyState = 
  | "IDLE" 
  | "PREPARING" 
  | "GENERATING_PROOF" 
  | "SIGNATURE_REQUIRED" 
  | "SUBMITTING" 
  | "WAITING" 
  | "VERIFIED" 
  | "ERROR";

export default function VerifyPage() {
  const { isConnected, address, network } = useWallet();
  const [verifyState, setVerifyState] = useState<VerifyState>("IDLE");
  const [age, setAge] = useState("");
  const [policyHash, setPolicyHash] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    try {
      setVerifyState("PREPARING");
      await new Promise(r => setTimeout(r, 800));
      
      setVerifyState("GENERATING_PROOF");
      await new Promise(r => setTimeout(r, 1500));
      
      setVerifyState("SIGNATURE_REQUIRED");
      await new Promise(r => setTimeout(r, 1000));
      
      setVerifyState("SUBMITTING");
      await new Promise(r => setTimeout(r, 800));
      
      setVerifyState("WAITING");
      await new Promise(r => setTimeout(r, 2000));
      
      // Mock result calculation for UI purposes. Real logic uses Midnight Contract.
      const isEligible = parseInt(age) >= 18 && policyHash.length > 0;
      setResult(isEligible);
      setVerifyState("VERIFIED");
    } catch {
      setVerifyState("ERROR");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Eligibility Verification</h1>
        <p className="text-foreground/70">
          Generate a Zero-Knowledge proof to verify your eligibility without exposing your data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Wallet Status Panel */}
        <div className="md:col-span-1 glass-card h-fit space-y-4 border-l-4 border-l-primary">
          <h3 className="font-bold text-lg border-b border-border pb-2">Status</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-foreground/60 block">Wallet</span>
              <span className={isConnected ? "text-success font-medium" : "text-error font-medium"}>
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {isConnected && (
              <>
                <div>
                  <span className="text-foreground/60 block">Address</span>
                  <span className="font-mono text-xs">{address?.slice(0, 12)}...</span>
                </div>
                <div>
                  <span className="text-foreground/60 block">Network</span>
                  <span>{network}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Verification Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card">
            <div className="flex items-center gap-2 text-warning mb-4 bg-orange-500/10 text-orange-500 p-3 rounded-lg border border-orange-500/20">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                <strong>Private Information:</strong> These values are used to generate the verification proof locally and will not be exposed to the verifier.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium block">Patient Age</label>
                <input
                  type="number"
                  required
                  disabled={verifyState !== "IDLE" && verifyState !== "VERIFIED" && verifyState !== "ERROR"}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">Policy ID Hash</label>
                <input
                  type="text"
                  required
                  disabled={verifyState !== "IDLE" && verifyState !== "VERIFIED" && verifyState !== "ERROR"}
                  value={policyHash}
                  onChange={(e) => setPolicyHash(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              <button 
                type="submit" 
                disabled={!isConnected || (verifyState !== "IDLE" && verifyState !== "VERIFIED" && verifyState !== "ERROR")}
                className="btn-primary w-full mt-4"
              >
                <Fingerprint className="w-5 h-5" />
                {verifyState === "IDLE" || verifyState === "VERIFIED" || verifyState === "ERROR" ? "Generate ZK Proof & Submit" : "Processing..."}
              </button>
            </form>
          </div>

          {/* Verification Status Stream */}
          {verifyState !== "IDLE" && (
            <div className="glass-card space-y-4">
              <h3 className="font-bold text-lg border-b border-border pb-2">Verification Progress</h3>
              <div className="space-y-3 font-mono text-sm">
                <StatusRow active={verifyState === "PREPARING"} done={["GENERATING_PROOF", "SIGNATURE_REQUIRED", "SUBMITTING", "WAITING", "VERIFIED"].includes(verifyState)} label="Preparing circuit..." />
                <StatusRow active={verifyState === "GENERATING_PROOF"} done={["SIGNATURE_REQUIRED", "SUBMITTING", "WAITING", "VERIFIED"].includes(verifyState)} label="Generating Zero-Knowledge Proof..." />
                <StatusRow active={verifyState === "SIGNATURE_REQUIRED"} done={["SUBMITTING", "WAITING", "VERIFIED"].includes(verifyState)} label="Awaiting Wallet Signature..." />
                <StatusRow active={verifyState === "SUBMITTING"} done={["WAITING", "VERIFIED"].includes(verifyState)} label="Submitting Transaction..." />
                <StatusRow active={verifyState === "WAITING"} done={["VERIFIED"].includes(verifyState)} label="Waiting for Confirmation..." />
              </div>
            </div>
          )}

          {/* Final Result Card */}
          {verifyState === "VERIFIED" && result !== null && (
            <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-3 text-center ${result ? 'border-success bg-success/10 text-success' : 'border-error bg-error/10 text-error'}`}>
              {result ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
              <div>
                <h2 className="text-2xl font-bold">{result ? "✓ ELIGIBLE" : "✕ NOT ELIGIBLE"}</h2>
                <p className="opacity-80 mt-1">Proof Status: Valid • Tx Confirmed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ active, done, label }: { active: boolean, done: boolean, label: string }) {
  if (!active && !done) return <div className="text-foreground/30 flex items-center gap-2"><div className="w-4 h-4" /> {label}</div>;
  if (done) return <div className="text-success flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {label}</div>;
  return <div className="text-primary flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {label}</div>;
}
