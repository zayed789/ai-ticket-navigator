import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-muted/30 dark:bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                AI-Powered Ticketing That Thinks Like Your{' '}
                <span className="text-primary">Best Support Agent</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Automate ticket creation, classification, routing, urgency detection, 
                and remediation across every support channel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="group text-base px-8 h-12"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-base px-8 h-12 border-2"
              >
                Sign Up
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-info animate-pulse" />
                <span>24/7 Automation</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-info/20 to-primary/20 rounded-2xl blur-2xl opacity-60" />
              
              {/* Dashboard Mockup */}
              <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-background rounded-md flex items-center px-3">
                      <span className="text-xs text-muted-foreground">ai-ticket.app/dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Open Tickets', value: '24', color: 'bg-info' },
                      { label: 'In Progress', value: '12', color: 'bg-warning' },
                      { label: 'Resolved Today', value: '47', color: 'bg-success' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-muted/50 rounded-lg p-3">
                        <div className={`h-1 w-8 ${stat.color} rounded mb-2`} />
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ticket List Preview */}
                  <div className="space-y-2">
                    {[
                      { id: 'TKT-001', status: 'P1', category: 'Network', ai: '98%' },
                      { id: 'TKT-002', status: 'P2', category: 'Software', ai: '95%' },
                      { id: 'TKT-003', status: 'P3', category: 'Hardware', ai: '92%' },
                    ].map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between bg-background/50 rounded-lg px-4 py-3 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{ticket.id}</span>
                          <span className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary font-medium">
                            {ticket.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{ticket.category}</span>
                          <span className="text-xs text-success font-medium">AI: {ticket.ai}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Processing Indicator */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>AI Processing 3 new tickets...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
