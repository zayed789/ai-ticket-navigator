import { LayoutDashboard, PlusCircle, Cpu, LogOut, UserPlus, LogIn, User, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeView: 'dashboard' | 'submit';
  onViewChange: (view: 'dashboard' | 'submit') => void;
}

export const Header = ({ activeView, onViewChange }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => onViewChange('dashboard')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeView === 'dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            {user && (
              <button
                onClick={() => onViewChange('submit')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  activeView === 'submit'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <PlusCircle className="h-4 w-4" />
                Submit Ticket
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="gap-2"
                title="View profile"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/signup')}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
