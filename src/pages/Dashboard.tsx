import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { TicketAnalyticsCharts } from '@/components/dashboard/TicketAnalyticsCharts';
import { TicketTable } from '@/components/dashboard/TicketTable';
import { TicketFiltersBar } from '@/components/dashboard/TicketFiltersBar';
import { TicketDetailPanel } from '@/components/dashboard/TicketDetailPanel';
import { TicketSubmissionForm } from '@/components/dashboard/TicketSubmissionForm';
import { useTickets } from '@/hooks/useTickets';
import { calculateDashboardStats } from '@/data/mockData';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'submit'>('dashboard');
  const {
    tickets,
    allTickets,
    filters,
    setFilters,
    selectedTicket,
    setSelectedTicketId,
    updateTicketStatus,
    submitTicket,
    provideFeedback,
  } = useTickets();

  const stats = calculateDashboardStats(allTickets);

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
                  Showing {tickets.length} of {allTickets.length} tickets
                </span>
              </div>
              <TicketTable 
                tickets={tickets} 
                onSelectTicket={setSelectedTicketId}
                selectedTicketId={selectedTicket?.id || null}
              />
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
            <TicketSubmissionForm onSubmit={submitTicket} />
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
