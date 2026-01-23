import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { TicketAnalyticsCharts } from '@/components/dashboard/TicketAnalyticsCharts';
import { TicketTable } from '@/components/dashboard/TicketTable';
import { TicketFiltersBar } from '@/components/dashboard/TicketFiltersBar';
import { TicketDetailPanel } from '@/components/dashboard/TicketDetailPanel';
import { TicketSubmissionForm } from '@/components/dashboard/TicketSubmissionForm';
import { useSupabaseTickets } from '@/hooks/useSupabaseTickets';
import { useAuth } from '@/contexts/AuthContext';
import { calculateDashboardStats } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'submit'>('dashboard');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    tickets,
    allTickets,
    filters,
    setFilters,
    selectedTicket,
    setSelectedTicketId,
    updateTicketStatus,
    submitTicket,
    addTicketFromWebhook,
    provideFeedback,
    loading: ticketsLoading,
  } = useSupabaseTickets();

  const stats = calculateDashboardStats(allTickets);

  // Show auth prompt for submit view if not logged in
  if (activeView === 'submit' && !user && !authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeView={activeView} onViewChange={setActiveView} />
        
        <main className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sign in Required</h2>
                <p className="text-muted-foreground">
                  Please sign in or create an account to submit support tickets.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/login')} variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container py-6 space-y-6">
        {activeView === 'dashboard' ? (
          <>
            {/* Metrics */}
            <section className="animate-fade-in">
              <MetricsGrid stats={stats} />
            </section>

            {/* Analytics Charts */}
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Live Analytics</h2>
                <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <TicketAnalyticsCharts tickets={allTickets} />
            </section>

            {/* Filters */}
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <TicketFiltersBar filters={filters} onFiltersChange={setFilters} />
            </section>

            {/* Ticket Table */}
            <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Tickets</h2>
                <span className="text-sm text-muted-foreground">
                  {ticketsLoading ? (
                    'Loading...'
                  ) : user ? (
                    `Showing ${tickets.length} of ${allTickets.length} tickets`
                  ) : (
                    'Sign in to view your tickets'
                  )}
                </span>
              </div>
              {!user && !authLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Sign in to view and manage your support tickets
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => navigate('/login')} variant="outline" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                      <Button onClick={() => navigate('/signup')} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <TicketTable 
                  tickets={tickets} 
                  onSelectTicket={setSelectedTicketId}
                  selectedTicketId={selectedTicket?.id || null}
                />
              )}
            </section>
          </>
        ) : (
          <section className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Submit Support Ticket</h2>
              <p className="text-muted-foreground mt-1">
                Describe your issue and our AI will automatically categorize and route it
              </p>
            </div>
            <TicketSubmissionForm onSubmit={submitTicket} onTicketCreated={addTicketFromWebhook} />
          </section>
        )}
      </main>

      {/* Detail Panel */}
      {selectedTicket && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSelectedTicketId(null)}
          />
          <TicketDetailPanel 
            ticket={selectedTicket} 
            onClose={() => setSelectedTicketId(null)}
            onStatusChange={updateTicketStatus}
            onFeedback={provideFeedback}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
