import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const DAppLayout: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <nav className="navbar" style={{ backgroundColor: 'white' }}>
        <div className="nav-brand">
          <ShieldCheck className="nav-brand-icon" size={28} />
          MedVerify <span style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>Portal</span>
        </div>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main className="app-container" style={{ padding: '2rem 1rem' }}>
        <Outlet />
      </main>
      
      <footer className="app-footer" style={{ marginTop: 'auto' }}>
        <p>Connected to Midnight Testnet</p>
      </footer>
    </div>
  );
};
