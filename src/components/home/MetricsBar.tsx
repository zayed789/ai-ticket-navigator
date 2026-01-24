import { 
  Zap, 
  Bot, 
  Radio, 
  AlertTriangle, 
  Shield, 
  TrendingUp 
} from 'lucide-react';

const metrics = [
  {
    icon: Zap,
    value: '40%',
    label: 'Faster Resolution',
    description: 'Average time saved per ticket',
  },
  {
    icon: Bot,
    value: '95%',
    label: 'AI Agent Coverage',
    description: 'Tickets handled by AI',
  },
  {
    icon: Radio,
    value: '4+',
    label: 'Support Channels',
    description: 'Email, Web, Voice, Portal',
  },
  {
    icon: AlertTriangle,
    value: 'P1–P4',
    label: 'Priority Handling',
    description: 'Automatic urgency detection',
  },
  {
    icon: Shield,
    value: 'SOC2',
    label: 'Enterprise Security',
    description: 'Compliant & secure',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Uptime SLA',
    description: 'Always available',
  },
];

export const MetricsBar = () => {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
            Trusted by Enterprise Teams
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Built for Scale, Designed for Speed
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group relative bg-card border border-border rounded-xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <metric.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
              <p className="text-sm font-medium text-foreground mb-1">{metric.label}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
