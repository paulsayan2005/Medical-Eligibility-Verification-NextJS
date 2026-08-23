import Link from "next/link";
import { Shield, Lock, Activity, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pb-2">
          Medical Eligibility Verification Without Revealing Your Medical Data
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
          Use zero-knowledge verification to prove eligibility while keeping sensitive medical information entirely private.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/verify" className="btn-primary text-lg px-8">
            Verify Eligibility
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/system" className="btn-secondary text-lg px-8">
            Connect Wallet
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Zero-Knowledge Privacy</h3>
          <p className="text-foreground/70 text-sm">Prove eligibility without exposing unnecessary medical information.</p>
        </div>
        
        <div className="glass-card flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Blockchain Security</h3>
          <p className="text-foreground/70 text-sm">Verification is secured and anchored through Midnight Network.</p>
        </div>

        <div className="glass-card flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Patient Controlled</h3>
          <p className="text-foreground/70 text-sm">The patient maintains ultimate control over their private information.</p>
        </div>

        <div className="glass-card flex flex-col gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Verifiable Results</h3>
          <p className="text-foreground/70 text-sm">Authorized providers can independently verify the cryptographic result.</p>
        </div>
      </section>

      {/* How It Works & Technology */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="space-y-4">
            {[
              "Connect your Web3 Wallet",
              "Enter private eligibility data",
              "Generate Zero-Knowledge proof locally",
              "Submit verification to the blockchain",
              "Provider verifies the result instantly"
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </div>
                <p className="font-medium text-foreground/80">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Powered By</h2>
          <div className="glass-card space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              <span className="font-medium">Midnight Network</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              <span className="font-medium">Compact Smart Contracts</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              <span className="font-medium">Zero-Knowledge Proofs</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              <span className="font-medium">Next.js App Router</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-primary w-5 h-5" />
              <span className="font-medium">Lace / 1AM Web3 Wallet</span>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
