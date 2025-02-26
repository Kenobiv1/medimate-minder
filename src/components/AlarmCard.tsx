
import { Bell, Clock, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
}

interface AlarmCardProps {
  alarm: Alarm;
}

const AlarmCard = ({ alarm }: AlarmCardProps) => {
  return (
    <Card className="p-4 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">{alarm.time}</h3>
            <p className="text-sm text-muted-foreground">{alarm.label}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Clock className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default AlarmCard;
