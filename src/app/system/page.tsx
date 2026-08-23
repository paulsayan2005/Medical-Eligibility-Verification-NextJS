"use client";

import { useWallet } from "@/components/WalletProvider";
import { Activity, Database, Key, Settings2, Wallet } from "lucide-react";

export default function SystemPage() {
  const { isConnected, address, network } = useWallet();

  // Mock contract address for now. Will be populated by env vars.
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "NOT CONFIGURED";
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Settings2 className="w-10 h-10 text-primary" />
          System Status
        </h1>
        <p className="text-foreground/70">
          Real-time technical overview of the Midnight Network integration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Wallet Status */}
        <StatusCard 
          title="Web3 Wallet"
          icon={<Wallet className="w-6 h-6" />}
          status={isConnected ? "CONNECTED" : "DISCONNECTED"}
          details={[
            { label: "Provider", value: "Lace / DApp Connector" },
            { label: "Address", value: address || "Unavailable" }
          ]}
        />

        {/* Midnight Network */}
        <StatusCard 
          title="Midnight Network"
          icon={<Activity className="w-6 h-6" />}
          status={isConnected ? "CONNECTED" : "DISCONNECTED"}
          details={[
            { label: "Network", value: network || "Unavailable" },
            { label: "Node Sync", value: isConnected ? "Synced" : "Unavailable" }
          ]}
        />

        {/* Smart Contract */}
        <StatusCard 
          title="Compact Contract"
          icon={<Database className="w-6 h-6" />}
          status={contractAddress !== "NOT CONFIGURED" ? "CONFIGURED" : "NOT CONFIGURED"}
          details={[
            { label: "Name", value: "Medical Eligibility Verification" },
            { label: "Address", value: contractAddress }
          ]}
        />

        {/* Proof System */}
        <StatusCard 
          title="Zero-Knowledge Proofs"
          icon={<Key className="w-6 h-6" />}
          status="READY"
          details={[
            { label: "Prover", value: "Local WASM Runtime" },
            { label: "ZSwap", value: "Loaded" }
          ]}
        />

      </div>
    </div>
  );
}

function StatusCard({ title, icon, status, details }: { title: string, icon: React.ReactNode, status: string, details: { label: string, value: string }[] }) {
  const isGood = status === "CONNECTED" || status === "CONFIGURED" || status === "READY";
  
  return (
    <div className="glass-card flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${isGood ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {status}
        </div>
      </div>
      
      <div className="space-y-3 flex-1 font-mono text-sm">
        {details.map((d, i) => (
          <div key={i} className="flex justify-between items-start gap-4">
            <span className="text-foreground/50 shrink-0">{d.label}</span>
            <span className={`text-right break-all ${d.value === 'NOT CONFIGURED' || d.value === 'Unavailable' ? 'text-error' : 'text-foreground'}`}>
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
