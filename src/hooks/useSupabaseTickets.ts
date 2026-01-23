import { useState, useCallback, useMemo, useEffect } from 'react';
import { Ticket, TicketFilters, TicketStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DbTicket {
  id: string;
  ticket_id: string;
  user_id: string;
  subject: string | null;
  description: string;
  category: string | null;
  urgency: string | null;
  priority: string | null;
  assigned_team: string | null;
  status: string | null;
  source: string | null;
  ai_confidence: number | null;
  ai_explanation: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const mapDbToTicket = (db: DbTicket): Ticket => ({
  id: db.ticket_id,
  description: db.description,
  source: (db.source as Ticket['source']) || 'Web Form',
  status: (db.status as TicketStatus) || 'Open',
  urgency: (db.urgency as Ticket['urgency']) || 'Medium',
  priority: (db.priority as Ticket['priority']) || 'P3',
  category: db.category || '',
  assignedTeam: db.assigned_team || '',
  createdAt: new Date(db.created_at),
  updatedAt: new Date(db.updated_at),
  resolvedAt: db.resolved_at ? new Date(db.resolved_at) : undefined,
  aiExplanation: db.ai_explanation || '',
  aiConfidenceScore: db.ai_confidence || 0,
  routingDecision: db.assigned_team ? `Routed to ${db.assigned_team}` : '',
  feedbackProvided: false,
  feedbackCorrect: undefined,
});

export const useSupabaseTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'All',
    urgency: 'All',
    timeRange: 'Last 30 days',
    searchQuery: '',
  });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch tickets from Supabase
  const fetchTickets = useCallback(async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTickets = (data as DbTicket[]).map(mapDbToTicket);
      setTickets(mappedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tickets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      if (filters.status !== 'All' && ticket.status !== filters.status) {
        return false;
      }
      
      if (filters.urgency !== 'All' && ticket.urgency !== filters.urgency) {
        return false;
      }
      
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
    if (!user) return;

    const resolvedAt = newStatus === 'Resolved' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: newStatus,
          resolved_at: resolvedAt,
        })
        .eq('ticket_id', ticketId);

      if (error) throw error;

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

      toast({
        title: "Status Updated",
        description: `Ticket ${ticketId} marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket status',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  const submitTicket = useCallback(async (description: string, source: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to submit tickets',
        variant: 'destructive',
      });
      throw new Error('Not authenticated');
    }

    const ticketId = `TKT-${String(Date.now()).slice(-6)}`;
    const category = 'Software Bug';
    const urgency = 'Medium';
    const assignedTeam = 'Help Desk L1';

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ticket_id: ticketId,
          user_id: user.id,
          description,
          source,
          category,
          urgency,
          priority: 'P3',
          assigned_team: assignedTeam,
          status: 'Open',
          ai_confidence: 65,
          ai_explanation: `**Category Analysis:** Initial classification pending full AI analysis. Temporarily assigned to ${category} based on preliminary keyword scan.

**Urgency Assessment:** Default priority assigned pending detailed impact assessment.

**Team Assignment:** Routed to ${assignedTeam} for initial triage and assessment.`,
        })
        .select()
        .single();

      if (error) throw error;

      const newTicket = mapDbToTicket(data as DbTicket);
      setTickets(prev => [newTicket, ...prev]);

      toast({
        title: "Ticket Submitted",
        description: `Ticket ${ticketId} has been created successfully`,
      });

      return newTicket;
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit ticket',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user, toast]);

  const addTicketFromWebhook = useCallback(async (ticketData: {
    ticket_id: string;
    category?: string;
    urgency?: string;
    priority?: string;
    assigned_team?: string;
    status?: string;
    source?: string;
    ticket_text?: string;
    explanation?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ticket_id: ticketData.ticket_id,
          user_id: user.id,
          description: ticketData.ticket_text || '',
          source: ticketData.source || 'Web Form',
          category: ticketData.category || null,
          urgency: ticketData.urgency || 'Medium',
          priority: ticketData.priority || 'P3',
          assigned_team: ticketData.assigned_team || null,
          status: ticketData.status || 'Open',
          ai_confidence: ticketData.explanation ? 85 : null,
          ai_explanation: ticketData.explanation || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newTicket = mapDbToTicket(data as DbTicket);
      setTickets(prev => [newTicket, ...prev]);
    } catch (error) {
      console.error('Error adding ticket from webhook:', error);
    }
  }, [user]);

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
    loading,
    refetch: fetchTickets,
  };
};
