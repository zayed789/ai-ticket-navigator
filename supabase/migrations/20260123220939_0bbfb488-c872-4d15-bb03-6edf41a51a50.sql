-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  description TEXT NOT NULL,
  category TEXT,
  urgency TEXT DEFAULT 'Medium',
  priority TEXT DEFAULT 'P3',
  assigned_team TEXT,
  status TEXT DEFAULT 'Open',
  source TEXT DEFAULT 'Manual',
  ai_confidence NUMERIC,
  ai_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
ON public.tickets FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own tickets
CREATE POLICY "Users can create their own tickets"
ON public.tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets
CREATE POLICY "Users can update their own tickets"
ON public.tickets FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own tickets
CREATE POLICY "Users can delete their own tickets"
ON public.tickets FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();