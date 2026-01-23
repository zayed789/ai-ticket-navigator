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
  'Medium': 'urgency-medium',
  'High': 'urgency-high',
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
            <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
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
                {ticket.urgency ? (
                  <Badge 
                    variant="outline" 
                    className={cn('border font-medium', urgencyStyles[ticket.urgency])}
                  >
                    {ticket.urgency}
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell>
                {ticket.priority ? (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'border font-medium',
                      ticket.priority === 'P1' ? 'border-red-500 text-red-600 dark:text-red-400' :
                      ticket.priority === 'P2' ? 'border-orange-500 text-orange-600 dark:text-orange-400' :
                      ticket.priority === 'P3' ? 'border-amber-500 text-amber-600 dark:text-amber-400' :
                      'border-blue-500 text-blue-600 dark:text-blue-400'
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ticket.assignedTeam}
              </TableCell>
              <TableCell>
                {ticket.status ? (
                  <Badge 
                    variant="outline" 
                    className={cn('border font-medium', statusStyles[ticket.status])}
                  >
                    {ticket.status}
                  </Badge>
                ) : null}
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
