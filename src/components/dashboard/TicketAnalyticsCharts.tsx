import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Ticket, IssueCategory, TicketStatus, UrgencyLevel } from '@/types';
import { TrendingUp, PieChartIcon, BarChart3, Activity } from 'lucide-react';

interface TicketAnalyticsChartsProps {
  tickets: Ticket[];
}

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  'Network Issue': 'hsl(var(--chart-1))',
  'Hardware Failure': 'hsl(var(--chart-2))',
  'Software Bug': 'hsl(var(--chart-3))',
  'Access Request': 'hsl(var(--chart-4))',
  'Password Reset': 'hsl(var(--chart-5))',
  'Email Problem': 'hsl(187, 85%, 53%)',
  'VPN Issue': 'hsl(200, 85%, 55%)',
  'Printer Problem': 'hsl(280, 65%, 60%)',
  'Security Incident': 'hsl(0, 75%, 60%)',
  'Performance Issue': 'hsl(45, 85%, 55%)',
};

const STATUS_COLORS: Record<TicketStatus, string> = {
  'Open': 'hsl(var(--chart-1))',
  'In Progress': 'hsl(var(--chart-3))',
  'Resolved': 'hsl(var(--chart-4))',
  'Closed': 'hsl(var(--muted-foreground))',
};

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  'Low': 'hsl(var(--chart-4))',
  'Normal': 'hsl(var(--chart-5))',
  'High': 'hsl(var(--chart-3))',
  'Urgent': 'hsl(var(--chart-2))',
  'Critical': 'hsl(0, 75%, 55%)',
};

export const TicketAnalyticsCharts = ({ tickets }: TicketAnalyticsChartsProps) => {
  // Category distribution for pie chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((ticket) => {
      counts[ticket.category] = (counts[ticket.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        fill: CATEGORY_COLORS[name as IssueCategory] || 'hsl(var(--muted))',
      }))
      .sort((a, b) => b.value - a.value);
  }, [tickets]);

  // Status distribution for pie chart
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((ticket) => {
      counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: STATUS_COLORS[name as TicketStatus] || 'hsl(var(--muted))',
    }));
  }, [tickets]);

  // Urgency distribution for bar chart
  const urgencyData = useMemo(() => {
    const order: UrgencyLevel[] = ['Low', 'Normal', 'High', 'Urgent', 'Critical'];
    const counts: Record<string, number> = {};
    tickets.forEach((ticket) => {
      counts[ticket.urgency] = (counts[ticket.urgency] || 0) + 1;
    });
    return order.map((urgency) => ({
      name: urgency,
      count: counts[urgency] || 0,
      fill: URGENCY_COLORS[urgency],
    }));
  }, [tickets]);

  // Tickets over time (last 7 days)
  const timelineData = useMemo(() => {
    const days: { date: string; created: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const created = tickets.filter(
        (t) => t.createdAt >= dayStart && t.createdAt <= dayEnd
      ).length;
      const resolved = tickets.filter(
        (t) => t.resolvedAt && t.resolvedAt >= dayStart && t.resolvedAt <= dayEnd
      ).length;
      
      days.push({ date: dateStr, created, resolved });
    }
    return days;
  }, [tickets]);

  const chartConfig = {
    created: { label: 'Created', color: 'hsl(var(--chart-1))' },
    resolved: { label: 'Resolved', color: 'hsl(var(--chart-4))' },
    count: { label: 'Count', color: 'hsl(var(--chart-2))' },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Category Distribution Pie Chart */}
      <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <PieChartIcon className="h-4 w-4 text-primary" />
            By Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto text-xs">
            {categoryData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground truncate max-w-[100px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Chart */}
      <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4 text-primary" />
            By Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-2 space-y-1 text-xs">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Urgency Distribution Bar Chart */}
      <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="h-4 w-4 text-primary" />
            By Urgency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={urgencyData} layout="vertical" margin={{ left: -20 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                width={60}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tickets Timeline */}
      <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-primary" />
            7-Day Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="created"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#createdGradient)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                fill="url(#resolvedGradient)"
              />
            </AreaChart>
          </ChartContainer>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
              <span className="text-muted-foreground">Created</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]" />
              <span className="text-muted-foreground">Resolved</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
