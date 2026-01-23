import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketFilters, TicketStatus, UrgencyLevel } from '@/types';

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
}

const statuses: (TicketStatus | 'All')[] = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const urgencies: (UrgencyLevel | 'All')[] = ['All', 'Low', 'Medium', 'High', 'Critical'];
const timeRanges: TicketFilters['timeRange'][] = ['Today', 'Last 24h', 'Last 7 days', 'Last 30 days'];

export const TicketFiltersBar = ({ filters, onFiltersChange }: TicketFiltersBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-9 bg-background border-border"
        />
      </div>
      
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value as TicketStatus | 'All' })}
      >
        <SelectTrigger className="w-[140px] bg-background border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.urgency}
        onValueChange={(value) => onFiltersChange({ ...filters, urgency: value as UrgencyLevel | 'All' })}
      >
        <SelectTrigger className="w-[140px] bg-background border-border">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent>
          {urgencies.map((urgency) => (
            <SelectItem key={urgency} value={urgency}>
              {urgency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.timeRange}
        onValueChange={(value) => onFiltersChange({ ...filters, timeRange: value as TicketFilters['timeRange'] })}
      >
        <SelectTrigger className="w-[140px] bg-background border-border">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          {timeRanges.map((range) => (
            <SelectItem key={range} value={range}>
              {range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
