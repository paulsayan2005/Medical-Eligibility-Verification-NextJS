"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "./WalletProvider";
import { ShieldCheck, Wallet, LogOut, Loader2, AlertCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, connecting, error, connect, disconnect } = useWallet();

  const links = [
    { name: "Home", href: "/" },
    { name: "Verify Eligibility", href: "/verify" },
    { name: "Provider", href: "/provider" },
    { name: "System", href: "/system" },
  ];

  return (
    <>
      <nav className="w-full glass-panel border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <ShieldCheck className="w-6 h-6" />
              <span>MedVerify</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors text-sm font-medium ${
                    pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center">
              {isConnected ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block text-xs font-mono bg-accent text-accent-foreground px-3 py-1 rounded-full">
                    {address?.slice(0, 12)}...{address?.slice(-4)}
                  </span>
                  <button
                    onClick={disconnect}
                    className="p-2 text-foreground/70 hover:text-error transition-colors"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={connecting}
                  className="btn-primary text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Connect 1AM Wallet
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Wallet error banner */}
      {error && (
        <div className="w-full bg-error/10 border-b border-error/30 px-4 py-3 flex items-center gap-3 text-error text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
          <a
            href="https://midnight.network/wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline whitespace-nowrap font-medium hover:opacity-80"
          >
            Get 1AM Wallet →
          </a>
        </div>
      )}
    </>
  );
}
