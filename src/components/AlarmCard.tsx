
import { AlarmClock, Bell, BellOff } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  medicationName?: string;
}

interface AlarmCardProps {
  alarm: Alarm;
  onToggle?: (id: string, isActive: boolean) => void;
}

const AlarmCard = ({ alarm, onToggle }: AlarmCardProps) => {
  const [isActive, setIsActive] = useState(alarm.isActive);
  
  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onToggle) {
      onToggle(alarm.id, newState);
    }
  };

  // Format time for better display
  const formatTime = (time: string) => {
    try {
      // If it's already in 12-hour format or doesn't have AM/PM, return it as is
      if (time.includes('AM') || time.includes('PM')) {
        return time;
      }
      
      // Parse the time string (expected format: "HH:MM")
      const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
      
      // Format to 12-hour time with AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      // If there's any error in parsing, return the original time
      return time;
    }
  };

  return (
    <div className={`p-4 border rounded-lg flex items-center justify-between ${isActive ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
          <AlarmClock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium">{formatTime(alarm.time)}</h3>
          <p className="text-sm text-muted-foreground">
            {alarm.label}
            {alarm.medicationName && <span className="ml-1 text-primary">({alarm.medicationName})</span>}
          </p>
        </div>
      </div>
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        aria-label={`Toggle ${alarm.label}`}
      />
    </div>
  );
};

export default AlarmCard;
