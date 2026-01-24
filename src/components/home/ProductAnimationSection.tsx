import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Globe, Headphones, MessageSquare, ArrowRight, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

const channels = [
  { icon: Phone, label: 'Voice' },
  { icon: Mail, label: 'Email' },
  { icon: Globe, label: 'Web Portal' },
  { icon: Headphones, label: 'Call Center' },
  { icon: MessageSquare, label: 'Chat' },
];

const ticketStates = [
  { step: 'Incoming Call', status: 'receiving', category: '', urgency: '', team: '' },
  { step: 'Call Connected', status: 'connected', category: '', urgency: '', team: '' },
  { step: 'Creating Ticket', status: 'creating', category: 'Network Issue', urgency: '', team: '' },
  { step: 'AI Analysis', status: 'analyzing', category: 'Network Issue', urgency: 'P2 - High', team: '' },
  { step: 'Auto-Routed', status: 'routed', category: 'Network Issue', urgency: 'P2 - High', team: 'Network Ops' },
];

export const ProductAnimationSection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ticketStates.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentState = ticketStates[currentStep];

  return (
    <section className="py-20 lg:py-32 bg-muted/30 dark:bg-muted/10">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Phone Animation */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-[320px]">
              {/* Phone Glow */}
              <div className="absolute -inset-8 bg-gradient-to-b from-primary/20 to-transparent rounded-[3rem] blur-2xl" />

              {/* Phone Frame */}
              <div className="relative bg-foreground dark:bg-card rounded-[2.5rem] p-3 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground dark:bg-card rounded-b-2xl z-10" />
                
                {/* Phone Screen */}
                <div className="relative bg-background rounded-[2rem] overflow-hidden aspect-[9/19]">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-2 text-xs text-muted-foreground">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-current rounded-sm">
                        <div className="w-3/4 h-full bg-success rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="px-4 py-6 space-y-4">
                    {/* App Header */}
                    <div className="text-center space-y-1">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mx-auto">
                        <Phone className="h-8 w-8" />
                      </div>
                      <p className="text-lg font-semibold">{currentState.step}</p>
                    </div>

                    {/* Call Animation */}
                    <div className="flex justify-center">
                      <div className="relative">
                        {currentState.status === 'receiving' && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full bg-success/30 animate-ping" style={{ animationDelay: '0.2s' }} />
                          </>
                        )}
                        <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-colors ${
                          currentState.status === 'receiving' ? 'bg-success text-success-foreground' :
                          currentState.status === 'connected' ? 'bg-primary text-primary-foreground' :
                          'bg-info text-info-foreground'
                        }`}>
                          <Phone className="h-8 w-8" />
                        </div>
                      </div>
                    </div>

                    {/* Ticket Info Cards */}
                    <div className="space-y-2 pt-4">
                      {currentState.category && (
                        <div className="bg-card border border-border rounded-lg p-3 animate-fade-in">
                          <p className="text-xs text-muted-foreground">Category Detected</p>
                          <p className="font-medium">{currentState.category}</p>
                        </div>
                      )}
                      {currentState.urgency && (
                        <div className="bg-card border border-border rounded-lg p-3 animate-fade-in">
                          <p className="text-xs text-muted-foreground">Priority Level</p>
                          <p className="font-medium text-warning">{currentState.urgency}</p>
                        </div>
                      )}
                      {currentState.team && (
                        <div className="bg-card border border-primary/50 rounded-lg p-3 animate-fade-in">
                          <p className="text-xs text-muted-foreground">Assigned To</p>
                          <p className="font-medium text-primary">{currentState.team}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 pt-4">
                      {ticketStates.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all ${
                            index === currentStep 
                              ? 'w-6 bg-primary' 
                              : index < currentStep 
                                ? 'w-2 bg-primary/50' 
                                : 'w-2 bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Channel Icons */}
              {channels.map((channel, index) => {
                const angle = (index * 72 - 90) * (Math.PI / 180);
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <div
                    key={channel.label}
                    className="absolute h-10 w-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center animate-pulse-slow"
                    style={{
                      left: `calc(50% + ${x}px - 20px)`,
                      top: `calc(50% + ${y}px - 20px)`,
                      animationDelay: `${index * 0.3}s`,
                    }}
                  >
                    <channel.icon className="h-5 w-5 text-primary" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Radio className="h-4 w-4" />
              Omnichannel Support
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              One System.{' '}
              <span className="text-primary">Every Channel.</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Support customers via Email, Web Forms, IT Portals, Calls, and Voice — 
              all tracked in one unified system. AI automatically creates, categorizes, 
              and routes tickets in real-time.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {[
                'Auto Ticket Creation',
                'AI Classification',
                'Smart Routing',
                'Priority Detection',
                'Team Assignment',
                'Real-time Updates',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="group"
            >
              Try Voice Support
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
