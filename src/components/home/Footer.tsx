import { Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">AI Ticket</h1>
              <p className="text-xs text-muted-foreground">Resolution System</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <button 
              onClick={() => navigate('/')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Up
            </button>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Ticket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
