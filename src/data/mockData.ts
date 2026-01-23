import { Ticket, TicketStatus, UrgencyLevel, TicketSource, IssueCategory } from '@/types';

// Generate random date within last 30 days
const randomDate = (daysBack: number = 30): Date => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
};

// Calculate resolution time in hours
const calculateResolutionTime = (created: Date, resolved?: Date): number | undefined => {
  if (!resolved) return undefined;
  return Math.round((resolved.getTime() - created.getTime()) / (1000 * 60 * 60));
};

const statuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
const urgencies: UrgencyLevel[] = ['Low', 'Normal', 'High', 'Urgent', 'Critical'];
const sources: TicketSource[] = ['Email', 'Chat', 'Web Form', 'IT Portal'];
const categories: IssueCategory[] = [
  'Network Issue',
  'Hardware Failure',
  'Software Bug',
  'Access Request',
  'Password Reset',
  'Email Problem',
  'VPN Issue',
  'Printer Problem',
  'Security Incident',
  'Performance Issue',
];

const teams = [
  'Network Ops',
  'Help Desk L1',
  'Help Desk L2',
  'Security Team',
  'Infrastructure',
  'Application Support',
];

const descriptions = [
  'Unable to connect to VPN from remote location. Getting timeout errors.',
  'Outlook keeps crashing when opening attachments larger than 5MB.',
  'Cannot access shared drive S: after recent Windows update.',
  'New employee needs access to Salesforce and internal wiki.',
  'Laptop screen flickering intermittently, especially when docked.',
  'Website loading extremely slow, affecting customer transactions.',
  'Suspicious email received with attachment, need security review.',
  'Printer on 3rd floor not responding to any print jobs.',
  'Password expired and cannot reset through self-service portal.',
  'Database queries timing out during peak hours.',
  'Two-factor authentication not sending SMS codes.',
  'Video conferencing software not recognizing external webcam.',
  'Cloud storage sync failing with authentication errors.',
  'Employee reporting phishing attempt, needs incident review.',
  'Server showing high CPU usage, causing service degradation.',
];

const aiExplanations = [
  'Based on keyword analysis, this ticket mentions "VPN" and "timeout" which strongly indicates a network connectivity issue. The urgency is elevated due to remote work impact.',
  'The mention of "crashing" and "attachments" suggests a software compatibility issue. Assigned to Application Support for memory-related debugging.',
  'Post-update access issues are typically permission-related. Routing to Help Desk L2 for domain policy verification.',
  'New employee access requests are standard onboarding tasks. Low urgency assigned due to non-blocking nature.',
  'Hardware symptoms detected: "flickering" and "docked" suggest display adapter or docking station issues. Hardware team assigned.',
  'Performance degradation affecting customers triggers high urgency. Infrastructure team alerted for immediate investigation.',
  'Security keywords detected. Elevated to Security Team with urgent priority per incident response protocol.',
  'Standard hardware issue detected. Assigned to Help Desk L1 for initial troubleshooting.',
  'Password reset with portal failure requires L2 escalation for backend account verification.',
  'Database performance issues during peak hours suggest capacity or query optimization needs.',
];

export const generateMockTickets = (count: number = 25): Ticket[] => {
  return Array.from({ length: count }, (_, index) => {
    const createdAt = randomDate(30);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isResolved = status === 'Resolved' || status === 'Closed';
    
    const resolvedAt = isResolved 
      ? new Date(createdAt.getTime() + Math.random() * 48 * 60 * 60 * 1000) 
      : undefined;
    
    const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      id: `TKT-${String(1000 + index).padStart(4, '0')}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      status,
      urgency,
      category,
      assignedTeam: teams[Math.floor(Math.random() * teams.length)],
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
      resolvedAt,
      resolutionTimeHours: calculateResolutionTime(createdAt, resolvedAt),
      aiExplanation: aiExplanations[Math.floor(Math.random() * aiExplanations.length)],
      aiConfidenceScore: Math.round(75 + Math.random() * 25),
      routingDecision: `Routed to ${teams[Math.floor(Math.random() * teams.length)]} based on ${category.toLowerCase()} classification`,
      feedbackProvided: Math.random() > 0.7,
      feedbackCorrect: Math.random() > 0.3,
    };
  });
};

export const mockTickets = generateMockTickets(25);

// Dashboard statistics
export const calculateDashboardStats = (tickets: Ticket[]) => {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const closed = tickets.filter(t => t.status === 'Closed').length;
  const critical = tickets.filter(t => t.urgency === 'Critical').length;
  
  const resolvedTickets = tickets.filter(t => t.resolutionTimeHours !== undefined);
  const avgResolutionTime = resolvedTickets.length > 0
    ? Math.round(resolvedTickets.reduce((sum, t) => sum + (t.resolutionTimeHours || 0), 0) / resolvedTickets.length)
    : 0;
  
  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    critical,
    avgResolutionTime,
  };
};
