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

// AI explanation generator that references the actual assigned team
const generateAiExplanation = (category: IssueCategory, urgency: UrgencyLevel, assignedTeam: string): string => {
  const categoryReasons: Record<IssueCategory, string> = {
    'Network Issue': 'Keyword analysis detected network-related terms such as "connection", "VPN", or "timeout".',
    'Hardware Failure': 'Physical device symptoms identified including "flickering", "not responding", or hardware component references.',
    'Software Bug': 'Application behavior anomalies detected such as "crashing", "freezing", or "error messages".',
    'Access Request': 'Permission or access-related keywords found including "access", "permission", or "new employee".',
    'Password Reset': 'Authentication failure patterns identified such as "password", "login", or "expired credentials".',
    'Email Problem': 'Email system issues detected including "Outlook", "email", or "mail server" references.',
    'VPN Issue': 'Remote connectivity problems identified through "VPN", "remote access", or "tunnel" keywords.',
    'Printer Problem': 'Print system issues detected via "printer", "print job", or "print queue" references.',
    'Security Incident': 'Security-related keywords triggered including "phishing", "suspicious", or "unauthorized access".',
    'Performance Issue': 'System performance degradation indicators found such as "slow", "timeout", or "high usage".',
  };

  const urgencyReasons: Record<UrgencyLevel, string> = {
    'Low': 'This is a non-blocking issue with no immediate business impact.',
    'Normal': 'Standard priority assigned as this affects individual productivity but has workarounds available.',
    'High': 'Elevated priority due to impact on multiple users or time-sensitive business operations.',
    'Urgent': 'High priority assigned as this significantly impacts business operations or customer experience.',
    'Critical': 'Maximum priority triggered due to security implications, widespread outage, or severe business impact.',
  };

  const teamReasons: Record<string, string> = {
    'Network Ops': 'requires network infrastructure expertise and system-level access',
    'Help Desk L1': 'is a standard support request suitable for first-level troubleshooting',
    'Help Desk L2': 'requires elevated technical expertise and backend system access',
    'Security Team': 'involves security protocols and requires incident response procedures',
    'Infrastructure': 'needs server or infrastructure-level investigation and access',
    'Application Support': 'requires application-specific debugging and configuration knowledge',
  };

  return `**Category Analysis:** ${categoryReasons[category]}

**Urgency Assessment:** ${urgencyReasons[urgency]}

**Team Assignment:** Routed to ${assignedTeam} because this issue ${teamReasons[assignedTeam] || 'matches their area of expertise'}.`;
};

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
    const assignedTeam = teams[Math.floor(Math.random() * teams.length)];
    
    // Determine feedback state: null = not given, true = correct, false = incorrect
    const feedbackRandom = Math.random();
    const feedbackProvided = feedbackRandom > 0.6;
    const feedbackCorrect = feedbackProvided ? Math.random() > 0.3 : undefined;
    
    return {
      id: `TKT-${String(1000 + index).padStart(4, '0')}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      status,
      urgency,
      category,
      assignedTeam,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
      resolvedAt,
      resolutionTimeHours: calculateResolutionTime(createdAt, resolvedAt),
      aiExplanation: generateAiExplanation(category, urgency, assignedTeam),
      aiConfidenceScore: Math.round(75 + Math.random() * 25),
      routingDecision: `Routed to ${assignedTeam}`,
      feedbackProvided,
      feedbackCorrect,
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
