import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Zap, Lock, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <ShieldCheck className="nav-brand-icon" size={28} />
          MedVerify
        </div>
        <Link to="/app" className="btn btn-primary">
          Go to App <ChevronRight size={18} />
        </Link>
      </nav>

      <main>
        <section className="hero">
          <h1>
            Confidential <br />
            <span className="gradient-text">Medical Eligibility</span> Verification
          </h1>
          <p>
            Verify patient age and policy status on the Midnight Network without exposing sensitive personal data. Secure, compliant, and powered by Zero-Knowledge Proofs.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-primary btn-lg">
              Launch dApp
            </Link>
            <a href="https://midnight.network" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
              Learn about Midnight
            </a>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why choose MedVerify?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Lock size={24} />
              </div>
              <h3>Zero-Knowledge Privacy</h3>
              <p>Patients prove they meet the minimum age and policy requirements without revealing their actual age or identity to anyone on the network.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Database size={24} />
              </div>
              <h3>Immutable Public Ledger</h3>
              <p>While patient data remains private, aggregated statistics and verification counts are permanently recorded for transparent auditing.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={24} />
              </div>
              <h3>Seamless Integration</h3>
              <p>Built with Midnight's compact-runtime, MedVerify integrates directly with Lace wallets for a fast and frictionless user experience.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} MedVerify on the Midnight Network. All rights reserved.</p>
      </footer>
    </div>
  );
};
