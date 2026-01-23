import { 
  Ticket, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { DashboardStats } from '@/types';

interface MetricsGridProps {
  stats: DashboardStats;
}

export const MetricsGrid = ({ stats }: MetricsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      <MetricCard
        title="Total Tickets"
        value={stats.total}
        icon={Ticket}
        variant="primary"
      />
      <MetricCard
        title="Open"
        value={stats.open}
        icon={AlertTriangle}
        variant="warning"
      />
      <MetricCard
        title="In Progress"
        value={stats.inProgress}
        icon={Zap}
        variant="primary"
      />
      <MetricCard
        title="Resolved"
        value={stats.resolved}
        icon={CheckCircle2}
        variant="success"
      />
      <MetricCard
        title="Closed"
        value={stats.closed}
        icon={XCircle}
        variant="default"
      />
      <MetricCard
        title="Critical"
        value={stats.critical}
        icon={AlertTriangle}
        variant="critical"
      />
      <MetricCard
        title="Avg. Resolution"
        value={stats.avgResolutionTime}
        subtitle="hours"
        icon={Clock}
        variant="default"
      />
    </div>
  );
};
