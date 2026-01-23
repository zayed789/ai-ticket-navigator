export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4' | '';
export type TicketSource = 'Email' | 'Chat' | 'Web Form' | 'IT Portal';
export type IssueCategory = 
  | 'Network Issue'
  | 'Hardware Failure'
  | 'Software Bug'
  | 'Access Request'
  | 'Password Reset'
  | 'Email Problem'
  | 'VPN Issue'
  | 'Printer Problem'
  | 'Security Incident'
  | 'Performance Issue';

export interface Ticket {
  id: string;
  description: string;
  source: TicketSource;
  status: TicketStatus;
  urgency: UrgencyLevel | '';
  priority: PriorityLevel;
  category: IssueCategory | string;
  assignedTeam: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionTimeHours?: number;
  aiExplanation: string;
  aiConfidenceScore: number;
  routingDecision: string;
  feedbackProvided: boolean;
  feedbackCorrect?: boolean; // undefined if not provided, true/false if feedback given
}

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  critical: number;
  avgResolutionTime: number;
}

export interface TicketFilters {
  status: TicketStatus | 'All';
  urgency: UrgencyLevel | 'All';
  timeRange: 'Today' | 'Last 24h' | 'Last 7 days' | 'Last 30 days' | 'Custom';
  searchQuery: string;
}

export interface WebhookEvent {
  type: 'ticket_created' | 'status_changed' | 'ticket_resolved' | 'escalation';
  ticketId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}
