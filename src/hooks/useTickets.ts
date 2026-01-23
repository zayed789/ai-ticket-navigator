import { useState, useCallback, useMemo } from 'react';
import { Ticket, TicketFilters, TicketStatus } from '@/types';
import { mockTickets } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'All',
    urgency: 'All',
    timeRange: 'Last 30 days',
    searchQuery: '',
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Status filter
      if (filters.status !== 'All' && ticket.status !== filters.status) {
        return false;
      }
      
      // Urgency filter
      if (filters.urgency !== 'All' && ticket.urgency !== filters.urgency) {
        return false;
      }
      
      // Time range filter
      const now = new Date();
      const ticketDate = new Date(ticket.createdAt);
      switch (filters.timeRange) {
        case 'Today':
          if (ticketDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'Last 24h':
          if (now.getTime() - ticketDate.getTime() > 24 * 60 * 60 * 1000) return false;
          break;
        case 'Last 7 days':
          if (now.getTime() - ticketDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'Last 30 days':
          if (now.getTime() - ticketDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
          break;
      }
      
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          ticket.id.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [tickets, filters]);

  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  const updateTicketStatus = useCallback(async (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const now = new Date();
        return {
          ...ticket,
          status: newStatus,
          updatedAt: now,
          resolvedAt: newStatus === 'Resolved' ? now : ticket.resolvedAt,
          resolutionTimeHours: newStatus === 'Resolved' 
            ? Math.round((now.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60))
            : ticket.resolutionTimeHours,
        };
      }
      return ticket;
    }));

    // Simulate webhook trigger
    console.log(`[Webhook] Status changed: ${ticketId} -> ${newStatus}`);
    
    toast({
      title: "Status Updated",
      description: `Ticket ${ticketId} marked as ${newStatus}`,
    });
  }, [toast]);

  const submitTicket = useCallback(async (description: string, source: string) => {
    const category = 'Software Bug' as const;
    const urgency = 'Normal' as const;
    const assignedTeam = 'Help Desk L1';
    
    const newTicket: Ticket = {
      id: `TKT-${String(1000 + tickets.length).padStart(4, '0')}`,
      description,
      source: source as Ticket['source'],
      status: 'Open',
      urgency,
      category,
      assignedTeam,
      createdAt: new Date(),
      updatedAt: new Date(),
      aiExplanation: `**Category Analysis:** Initial classification pending full AI analysis. Temporarily assigned to ${category} based on preliminary keyword scan.

**Urgency Assessment:** Default priority assigned pending detailed impact assessment.

**Team Assignment:** Routed to ${assignedTeam} for initial triage and assessment.`,
      aiConfidenceScore: 65,
      routingDecision: `Routed to ${assignedTeam}`,
      feedbackProvided: false,
      feedbackCorrect: undefined,
    };

    setTickets(prev => [newTicket, ...prev]);
    
    // Simulate webhook trigger
    console.log(`[Webhook] Ticket created: ${newTicket.id}`);
    
    toast({
      title: "Ticket Submitted",
      description: `Ticket ${newTicket.id} has been created successfully`,
    });

    return newTicket;
  }, [tickets.length, toast]);

  const addTicketFromWebhook = useCallback((ticketData: {
    ticket_id: string;
    category?: string;
    status?: string;
    source?: string;
    ticket_text?: string;
  }) => {
    const newTicket: Ticket = {
      id: ticketData.ticket_id,
      description: ticketData.ticket_text || '',
      source: (ticketData.source as Ticket['source']) || 'Web Form',
      status: (ticketData.status as TicketStatus) || 'Open',
      urgency: 'Normal',
      category: (ticketData.category as Ticket['category']) || 'Software Bug',
      assignedTeam: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      aiExplanation: '',
      aiConfidenceScore: 0,
      routingDecision: '',
      feedbackProvided: false,
      feedbackCorrect: undefined,
    };

    setTickets(prev => [newTicket, ...prev]);
    console.log(`[Webhook] Ticket added from response: ${newTicket.id}`);
  }, []);

  const provideFeedback = useCallback((ticketId: string, isCorrect: boolean) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          feedbackProvided: true,
          feedbackCorrect: isCorrect,
        };
      }
      return ticket;
    }));

    toast({
      title: "Feedback Recorded",
      description: `Thank you for your feedback on AI decision`,
    });
  }, [toast]);

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    filters,
    setFilters,
    selectedTicket,
    setSelectedTicketId,
    updateTicketStatus,
    submitTicket,
    addTicketFromWebhook,
    provideFeedback,
  };
};
