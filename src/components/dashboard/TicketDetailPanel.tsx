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
  ThumbsDown,
  Wrench
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

        {/* AI Analysis Section - Clearly Separated Card */}
        <div className="space-y-4 rounded-xl border-2 border-primary/40 bg-primary/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">AI Analysis</h3>
            </div>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-semibold">
              {ticket.aiConfidenceScore}% Confidence
            </Badge>
          </div>
          
          <Separator className="bg-primary/20" />
          
          {/* Routing Decision */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Routing Decision</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">Routed to {ticket.assignedTeam}</span>
            </div>
          </div>

          {/* Priority */}
          {ticket.priority && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Priority</p>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <Badge variant="outline" className={cn(
                  'font-medium',
                  ticket.priority === 'P1' ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400" :
                  ticket.priority === 'P2' ? "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                  ticket.priority === 'P3' ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  ticket.priority === 'P4' ? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                  "border-border"
                )}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          )}

          {/* AI Explanation */}
          {ticket.aiExplanation && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AI Explanation</p>
              <div className="p-3 rounded-lg bg-background/50 border border-border space-y-2">
                {ticket.aiExplanation.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                    {paragraph.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {ticket.actions && ticket.actions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recommended Actions</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border">
                <ul className="space-y-2">
                  {ticket.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-primary font-medium mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Separator className="bg-primary/20" />

          {/* AI Feedback Section */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Feedback</p>
            {ticket.feedbackProvided ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(
                  'font-medium px-3 py-1',
                  ticket.feedbackCorrect 
                    ? 'border-success/30 bg-success/10 text-success' 
                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                )}>
                  {ticket.feedbackCorrect ? (
                    <><ThumbsUp className="h-3 w-3 mr-1.5" /> Decision was correct</>
                  ) : (
                    <><ThumbsDown className="h-3 w-3 mr-1.5" /> Decision was incorrect</>
                  )}
                </Badge>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-success/30 hover:bg-success/10 text-success flex-1"
                  onClick={() => onFeedback(ticket.id, true)}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-2" /> Yes, decision was correct
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-destructive/30 hover:bg-destructive/10 text-destructive flex-1"
                  onClick={() => onFeedback(ticket.id, false)}
                >
                  <ThumbsDown className="h-3.5 w-3.5 mr-2" /> No, decision was incorrect
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
