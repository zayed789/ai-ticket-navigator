import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  selectedTicketId: string | null;
}

const statusStyles: Record<string, string> = {
  'Open': 'status-open',
  'In Progress': 'status-in-progress',
  'Resolved': 'status-resolved',
  'Closed': 'status-closed',
};

const urgencyStyles: Record<string, string> = {
  'Low': 'urgency-low',
  'Normal': 'urgency-normal',
  'High': 'urgency-high',
  'Urgent': 'urgency-urgent',
  'Critical': 'urgency-critical',
};

export const TicketTable = ({ tickets, onSelectTicket, selectedTicketId }: TicketTableProps) => {
  if (tickets.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
        <p className="text-muted-foreground">No tickets match your filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Ticket ID</TableHead>
            <TableHead className="text-muted-foreground font-medium">Category</TableHead>
            <TableHead className="text-muted-foreground font-medium">Urgency</TableHead>
            <TableHead className="text-muted-foreground font-medium">Assigned Team</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => onSelectTicket(ticket.id)}
              className={cn(
                'cursor-pointer transition-colors hover:bg-muted/50',
                selectedTicketId === ticket.id && 'bg-primary/10 hover:bg-primary/15'
              )}
            >
              <TableCell className="font-mono font-medium text-primary">
                {ticket.id}
              </TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('border font-medium', urgencyStyles[ticket.urgency])}
                >
                  {ticket.urgency}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ticket.assignedTeam}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('border font-medium', statusStyles[ticket.status])}
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
