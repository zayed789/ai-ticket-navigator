import { format } from 'date-fns';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare,
  Brain,
  CheckCircle2,
  Play,
  XCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Ticket, TicketStatus } from '@/types';
import { cn } from '@/lib/utils';

interface TicketDetailPanelProps {
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  onFeedback: (ticketId: string, isCorrect: boolean) => void;
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

export const TicketDetailPanel = ({ 
  ticket, 
  onClose, 
  onStatusChange,
  onFeedback 
}: TicketDetailPanelProps) => {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg border-l border-border bg-card shadow-2xl animate-slide-in-right z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-primary">{ticket.id}</span>
          <Badge variant="outline" className={cn('font-medium', statusStyles[ticket.status])}>
            {ticket.status}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Source</p>
            <p className="font-medium">{ticket.source}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
            <p className="font-medium">{ticket.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Urgency</p>
            <Badge variant="outline" className={cn('font-medium', urgencyStyles[ticket.urgency])}>
              {ticket.urgency}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Assigned Team</p>
            <p className="font-medium">{ticket.assignedTeam}</p>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Description</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
        </div>

        <Separator className="bg-border" />

        {/* AI Decision Section */}
        <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">AI Analysis</h3>
            <Badge variant="outline" className="ml-auto border-primary/30 bg-primary/10 text-primary">
              {ticket.aiConfidenceScore}% Confidence
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Routing Decision</p>
              <p className="text-sm">{ticket.routingDecision}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Explanation</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{ticket.aiExplanation}</p>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="flex items-center gap-3 pt-2 border-t border-primary/20">
            <span className="text-sm text-muted-foreground">Was this decision correct?</span>
            {ticket.feedbackProvided ? (
              <Badge variant="outline" className={cn(
                'font-medium',
                ticket.feedbackCorrect ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive'
              )}>
                {ticket.feedbackCorrect ? 'Marked Correct' : 'Marked Incorrect'}
              </Badge>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-success/30 hover:bg-success/10 text-success"
                  onClick={() => onFeedback(ticket.id, true)}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" /> Yes
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-destructive/30 hover:bg-destructive/10 text-destructive"
                  onClick={() => onFeedback(ticket.id, false)}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" /> No
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Timestamps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Timeline</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{format(ticket.createdAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{format(ticket.updatedAt, 'MMM d, yyyy HH:mm')}</span>
            </div>
            {ticket.resolvedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolved</span>
                <span>{format(ticket.resolvedAt, 'MMM d, yyyy HH:mm')}</span>
              </div>
            )}
            {ticket.resolutionTimeHours !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution Time</span>
                <span className="text-success font-medium">{ticket.resolutionTimeHours} hours</span>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold">Actions</h3>
          <div className="flex flex-wrap gap-2">
            {ticket.status === 'Open' && (
              <Button 
                onClick={() => onStatusChange(ticket.id, 'In Progress')}
                className="bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Progress
              </Button>
            )}
            {(ticket.status === 'Open' || ticket.status === 'In Progress') && (
              <Button 
                onClick={() => onStatusChange(ticket.id, 'Resolved')}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            )}
            {ticket.status === 'Resolved' && (
              <Button 
                onClick={() => onStatusChange(ticket.id, 'Closed')}
                variant="outline"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Close Ticket
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
