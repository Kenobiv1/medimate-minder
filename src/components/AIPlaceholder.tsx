
import { MessageSquare, Mic } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AIPlaceholder = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 text-center space-y-3 card-hover glass-panel">
        <MessageSquare className="w-8 h-8 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
        <p className="text-muted-foreground">Coming soon</p>
      </Card>
      
      <Card className="p-6 text-center space-y-3 card-hover glass-panel">
        <Mic className="w-8 h-8 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Voice Control</h3>
        <p className="text-muted-foreground">Coming soon</p>
      </Card>
    </div>
  );
};

export default AIPlaceholder;
