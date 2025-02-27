import { useState } from 'react';
import { AlarmClock, Plus, Pill, ScrollText, Settings as SettingsIcon } from 'lucide-react';
import Clock from '@/components/Clock';
import AlarmCard from '@/components/AlarmCard';
import AIPlaceholder from '@/components/AIPlaceholder';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alarm } from '@/components/AlarmCard';

const Index = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
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
  ]);
  const [alarmDialogOpen, setAlarmDialogOpen] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');

  const handleAddAlarm = () => {
    if (newAlarmTime && newAlarmLabel) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        label: newAlarmLabel,
        isActive: true,
      };
      setAlarms(prev => [...prev, newAlarm]);
      setNewAlarmTime('');
      setNewAlarmLabel('');
      setAlarmDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="flex flex-col items-center justify-between">
        <Clock />
        <div className="absolute top-6 right-6">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <AlarmClock className="w-6 h-6" />
              Medication Alarms
            </h2>
            <div className="flex items-center gap-2">
              <Link to="/medications">
                <Button variant="outline" className="gap-2">
                  <Pill className="w-5 h-5" />
                  Manage Medications
                </Button>
              </Link>
              <Button 
                size="icon" 
                className="rounded-full" 
                onClick={() => setAlarmDialogOpen(true)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} />
            ))}
          </div>

          <div className="flex justify-end">
            <Link to="/history">
              <Button variant="ghost" className="gap-2">
                <ScrollText className="w-5 h-5" />
                View History
              </Button>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">AI Assistance</h2>
          <AIPlaceholder />
        </section>
      </main>

      {/* Alarm Add Dialog */}
      <Dialog open={alarmDialogOpen} onOpenChange={setAlarmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Alarm</DialogTitle>
            <DialogDescription>
              Enter the time and label for the new medication alarm.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddAlarm();
            }}
            className="space-y-4"
          >
            <Input 
              type="time" 
              value={newAlarmTime} 
              onChange={(e) => setNewAlarmTime(e.target.value)} 
              required 
              className="w-full" 
            />
            <Input 
              type="text" 
              placeholder="Alarm Label" 
              value={newAlarmLabel} 
              onChange={(e) => setNewAlarmLabel(e.target.value)} 
              required 
              className="w-full" 
            />
            <DialogFooter>
              <Button type="submit" variant="outline" className="mr-2">
                Add Alarm
              </Button>
              <Button type="button" variant="ghost" onClick={() => setAlarmDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
