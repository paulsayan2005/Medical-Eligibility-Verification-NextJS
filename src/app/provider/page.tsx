"use client";

import { useState } from "react";
import { ShieldCheck, Search, Loader2 } from "lucide-react";

export default function ProviderPage() {
  const [verificationId, setVerificationId] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SEARCHING" | "FOUND" | "NOT_FOUND">("IDLE");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;

    setStatus("SEARCHING");
    await new Promise(r => setTimeout(r, 1500));
    
    // Mock result for demo
    if (verificationId.length > 5) {
      setStatus("FOUND");
    } else {
      setStatus("NOT_FOUND");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Provider Verification</h1>
        <p className="text-foreground/70">
          Verify a patient&apos;s eligibility status by providing their verification ID without seeing their private medical data.
        </p>
      </div>

      <div className="glass-card space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Verification ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                className="input-field flex-1 font-mono"
                placeholder="Enter Verification ID..."
              />
              <button 
                type="submit" 
                disabled={status === "SEARCHING"}
                className="btn-primary"
              >
                {status === "SEARCHING" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Verify
              </button>
            </div>
          </div>
        </form>

        {status === "FOUND" && (
          <div className="mt-6 p-6 rounded-xl border border-success bg-success/10 space-y-4">
            <div className="flex items-center gap-3 text-success border-b border-success/20 pb-3">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Valid Record Found</h3>
                <p className="text-sm opacity-90">Proof Cryptographically Verified</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div>
                <span className="text-success/70 block">Eligibility Status</span>
                <span className="font-bold text-success text-lg">ELIGIBLE</span>
              </div>
              <div>
                <span className="text-success/70 block">Network Confirmation</span>
                <span className="font-medium text-success">Confirmed</span>
              </div>
              <div className="col-span-2">
                <span className="text-success/70 block">Transaction ID</span>
                <span className="font-mono text-xs opacity-80 break-all">
                  0x7f2c8d4a9b1e3f56a8c0d2b4e6f8a0c2e4f6a8b0d2c4e6f8a0c2e4f6a8b0d2c4
                </span>
              </div>
            </div>
          </div>
        )}

        {status === "NOT_FOUND" && (
          <div className="mt-6 p-4 rounded-xl border border-error bg-error/10 text-error text-center font-medium">
            No valid verification record found for this ID.
          </div>
        )}
      </div>
    </div>
  );
}
