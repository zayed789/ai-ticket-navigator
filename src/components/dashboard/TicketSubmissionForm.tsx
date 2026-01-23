import { useState } from 'react';
import { Send, Mail, MessageCircle, Globe, Monitor, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketSource } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const WEBHOOK_URL = 'https://zayedroxx.app.n8n.cloud/webhook-test/ticket/submit';

interface WebhookPayload {
  source: TicketSource;
  ticket_text: string;
  metadata: {
    email: Record<string, string>;
    chat: { messages?: { sender: string; text: string }[] };
    web_form: Record<string, string>;
    it_portal: Record<string, string>;
  };
  submitted_at: string;
}

interface TicketSubmissionFormProps {
  onSubmit: (description: string, source: string, metadata?: Record<string, unknown>) => Promise<unknown>;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const sources: { value: TicketSource; label: string; icon: React.ElementType }[] = [
  { value: 'Email', label: 'Email', icon: Mail },
  { value: 'Chat', label: 'Chat', icon: MessageCircle },
  { value: 'Web Form', label: 'Web Form', icon: Globe },
  { value: 'IT Portal', label: 'IT Portal', icon: Monitor },
];

export const TicketSubmissionForm = ({ onSubmit }: TicketSubmissionFormProps) => {
  const [source, setSource] = useState<TicketSource>('Web Form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email fields
  const [emailFrom, setEmailFrom] = useState('');
  const [emailTo, setEmailTo] = useState('support@company.com');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Chat fields
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hello! How can I help you today?', isUser: false, timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Web Form fields
  const [webName, setWebName] = useState('');
  const [webEmail, setWebEmail] = useState('');
  const [webTitle, setWebTitle] = useState('');
  const [webDescription, setWebDescription] = useState('');

  // IT Portal fields
  const [itEmployeeId, setItEmployeeId] = useState('');
  const [itDepartment, setItDepartment] = useState('');
  const [itIssueType, setItIssueType] = useState('');
  const [itImpactLevel, setItImpactLevel] = useState('');
  const [itDescription, setItDescription] = useState('');

  const resetAllFields = () => {
    setEmailFrom('');
    setEmailTo('support@company.com');
    setEmailCc('');
    setEmailSubject('');
    setEmailBody('');
    setChatMessages([{ id: '1', text: 'Hello! How can I help you today?', isUser: false, timestamp: new Date() }]);
    setChatInput('');
    setWebName('');
    setWebEmail('');
    setWebTitle('');
    setWebDescription('');
    setItEmployeeId('');
    setItDepartment('');
    setItIssueType('');
    setItImpactLevel('');
    setItDescription('');
  };

  const addChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate support response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Is there anything else you\'d like to add before submitting?',
        isUser: false,
        timestamp: new Date()
      }]);
    }, 500);
  };

  const buildWebhookPayload = (): WebhookPayload | null => {
    const basePayload: WebhookPayload = {
      source,
      ticket_text: '',
      metadata: {
        email: {},
        chat: {},
        web_form: {},
        it_portal: {},
      },
      submitted_at: new Date().toISOString(),
    };

    switch (source) {
      case 'Email':
        if (!emailFrom || !emailSubject || !emailBody) return null;
        basePayload.ticket_text = `${emailSubject} — ${emailBody}`;
        basePayload.metadata.email = {
          from: emailFrom,
          to: emailTo,
          cc: emailCc,
          subject: emailSubject,
          body: emailBody,
        };
        break;

      case 'Chat':
        const userMessages = chatMessages.filter(m => m.isUser);
        if (userMessages.length === 0) return null;
        basePayload.ticket_text = userMessages.map(m => m.text).join(' ');
        basePayload.metadata.chat = {
          messages: userMessages.map(m => ({ sender: 'user', text: m.text })),
        };
        break;

      case 'Web Form':
        if (!webName || !webEmail || !webTitle || !webDescription) return null;
        basePayload.ticket_text = `${webTitle} — ${webDescription}`;
        basePayload.metadata.web_form = {
          name: webName,
          email: webEmail,
          issue_title: webTitle,
          issue_description: webDescription,
        };
        break;

      case 'IT Portal':
        if (!itEmployeeId || !itDepartment || !itIssueType || !itImpactLevel || !itDescription) return null;
        basePayload.ticket_text = `${itIssueType} — ${itDescription}`;
        basePayload.metadata.it_portal = {
          employee_id: itEmployeeId,
          department: itDepartment,
          issue_type: itIssueType,
          impact_level: itImpactLevel,
          description: itDescription,
        };
        break;

      default:
        return null;
    }

    return basePayload;
  };

  const isFormValid = () => buildWebhookPayload() !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildWebhookPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      // Send to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      // Also call local onSubmit for UI update
      await onSubmit(payload.ticket_text, source, payload.metadata);
      
      toast({
        title: 'Ticket Submitted Successfully',
        description: `Your ${source} ticket has been sent to the processing queue.`,
      });
      
      resetAllFields();
    } catch (error) {
      console.error('Webhook submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit ticket to webhook. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const SourceIcon = sources.find(s => s.value === source)?.icon || Globe;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
      {/* Source Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ticket Source</Label>
        <Select value={source} onValueChange={(v) => setSource(v as TicketSource)}>
          <SelectTrigger className="w-full bg-background border-border">
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

      {/* Dynamic Form Section */}
      <div className="rounded-lg border border-border bg-background/50 p-4 transition-all duration-300">
        {/* Email Mode */}
        {source === 'Email' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Mail className="h-5 w-5" />
              <h4 className="font-semibold">Email Ticket</h4>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email-from">From *</Label>
                <Input
                  id="email-from"
                  type="email"
                  placeholder="your.email@example.com"
                  value={emailFrom}
                  onChange={(e) => setEmailFrom(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-to">To</Label>
                <Input
                  id="email-to"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-cc">CC (optional)</Label>
              <Input
                id="email-cc"
                type="email"
                placeholder="cc@example.com"
                value={emailCc}
                onChange={(e) => setEmailCc(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="Brief description of your issue"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-body">Email Body *</Label>
              <Textarea
                id="email-body"
                placeholder="Describe your issue in detail..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[150px] bg-background resize-none"
              />
            </div>
          </div>
        )}

        {/* Chat Mode */}
        {source === 'Chat' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary mb-4">
              <MessageCircle className="h-5 w-5" />
              <h4 className="font-semibold">Chat Support</h4>
            </div>
            
            {/* Chat Messages */}
            <div className="h-[250px] overflow-y-auto rounded-lg border border-border bg-background p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.isUser
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addChatMessage())}
                className="bg-background"
              />
              <Button type="button" onClick={addChatMessage} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add your messages, then submit to create a ticket from the conversation.
            </p>
          </div>
        )}

        {/* Web Form Mode */}
        {source === 'Web Form' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Globe className="h-5 w-5" />
              <h4 className="font-semibold">Web Support Form</h4>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="web-name">Name *</Label>
                <Input
                  id="web-name"
                  placeholder="Your full name"
                  value={webName}
                  onChange={(e) => setWebName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="web-email">Email *</Label>
                <Input
                  id="web-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={webEmail}
                  onChange={(e) => setWebEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="web-title">Issue Title *</Label>
              <Input
                id="web-title"
                placeholder="Brief summary of your issue"
                value={webTitle}
                onChange={(e) => setWebTitle(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="web-description">Issue Description *</Label>
              <Textarea
                id="web-description"
                placeholder="Provide a detailed description of your issue..."
                value={webDescription}
                onChange={(e) => setWebDescription(e.target.value)}
                className="min-h-[120px] bg-background resize-none"
              />
            </div>
          </div>
        )}

        {/* IT Portal Mode */}
        {source === 'IT Portal' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Monitor className="h-5 w-5" />
              <h4 className="font-semibold">Internal IT Service Request</h4>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="it-employee">Employee ID *</Label>
                <Input
                  id="it-employee"
                  placeholder="e.g., EMP-12345"
                  value={itEmployeeId}
                  onChange={(e) => setItEmployeeId(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-department">Department *</Label>
                <Select value={itDepartment} onValueChange={setItDepartment}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="it-issue-type">Issue Type *</Label>
                <Select value={itIssueType} onValueChange={setItIssueType}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware Issue</SelectItem>
                    <SelectItem value="Software">Software Issue</SelectItem>
                    <SelectItem value="Network">Network Problem</SelectItem>
                    <SelectItem value="Access">Access Request</SelectItem>
                    <SelectItem value="Security">Security Concern</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="it-impact">Impact Level *</Label>
                <Select value={itImpactLevel} onValueChange={setItImpactLevel}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - Minor inconvenience</SelectItem>
                    <SelectItem value="Medium">Medium - Affects work</SelectItem>
                    <SelectItem value="High">High - Work blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="it-description">Issue Description *</Label>
              <Textarea
                id="it-description"
                placeholder="Describe your IT issue in detail..."
                value={itDescription}
                onChange={(e) => setItDescription(e.target.value)}
                className="min-h-[120px] bg-background resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Section */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Ticket will be automatically analyzed by AI
        </p>
        <Button 
          type="submit" 
          disabled={!isFormValid() || isSubmitting}
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
