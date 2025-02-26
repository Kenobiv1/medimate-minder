
import { AlarmClock, Plus } from 'lucide-react';
import Clock from '@/components/Clock';
import AlarmCard from '@/components/AlarmCard';
import AIPlaceholder from '@/components/AIPlaceholder';
import { Button } from '@/components/ui/button';

const demoAlarms = [
  {
    id: '1',
    time: '09:00',
    label: 'Morning Medication',
    isActive: true,
  },
  {
    id: '2',
    time: '13:00',
    label: 'Afternoon Medication',
    isActive: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="text-center space-y-4">
        <Clock />
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <AlarmClock className="w-6 h-6" />
              Medication Alarms
            </h2>
            <Button size="icon" className="rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="grid gap-4">
            {demoAlarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">AI Assistance</h2>
          <AIPlaceholder />
        </section>
      </main>
    </div>
  );
};

export default Index;
