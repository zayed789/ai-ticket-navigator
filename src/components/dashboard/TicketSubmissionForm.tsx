import { useState } from 'react';
import { Send, Mail, MessageCircle, Globe, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketSource } from '@/types';
import { cn } from '@/lib/utils';

interface TicketSubmissionFormProps {
  onSubmit: (description: string, source: string) => Promise<unknown>;
}

const sources: { value: TicketSource; label: string; icon: React.ElementType }[] = [
  { value: 'Email', label: 'Email', icon: Mail },
  { value: 'Chat', label: 'Chat', icon: MessageCircle },
  { value: 'Web Form', label: 'Web Form', icon: Globe },
  { value: 'IT Portal', label: 'IT Portal', icon: Monitor },
];

export const TicketSubmissionForm = ({ onSubmit }: TicketSubmissionFormProps) => {
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<TicketSource>('Web Form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(description, source);
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Submit New Ticket</h3>
        <Select value={source} onValueChange={(v) => setSource(v as TicketSource)}>
          <SelectTrigger className="w-[160px] bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sources.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Describe the issue in detail..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-[120px] bg-background border-border resize-none"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Ticket will be automatically analyzed by AI
        </p>
        <Button 
          type="submit" 
          disabled={!description.trim() || isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Ticket
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};
