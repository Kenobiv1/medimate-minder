
import { useState, useEffect } from 'react';
import { AlarmClock, Plus, Pill, ScrollText, Settings as SettingsIcon, LogIn } from 'lucide-react';
import Clock from '@/components/Clock';
import AlarmCard, { Alarm } from '@/components/AlarmCard';
import AIPlaceholder from '@/components/AIPlaceholder';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [alarmDialogOpen, setAlarmDialogOpen] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [medications, setMedications] = useState<{ id: string, name: string }[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>('');

  // Fetch alarms from all medications
  useEffect(() => {
    async function fetchAlarms() {
      if (!user) {
        // If no user, set empty data and stop loading
        setAlarms([]);
        setMedications([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch medications first
        const { data: medsData, error: medsError } = await supabase
          .from('medications')
          .select('id, name')
          .order('created_at', { ascending: false });
          
        if (medsError) throw medsError;
        setMedications(medsData || []);
        
        // If there are medications, set the first one as selected by default
        if (medsData && medsData.length > 0) {
          setSelectedMedicationId(medsData[0].id);
        }
        
        // Fetch all alarms across all medications
        const { data: alarmsData, error: alarmsError } = await supabase
          .from('alarms')
          .select(`
            id, 
            time, 
            label, 
            is_active,
            medication_id,
            medications(name)
          `)
          .order('time', { ascending: true });
          
        if (alarmsError) throw alarmsError;
        
        const formattedAlarms: Alarm[] = alarmsData ? alarmsData.map(alarm => ({
          id: alarm.id,
          time: alarm.time,
          label: alarm.label,
          isActive: alarm.is_active,
          medicationName: alarm.medications?.name
        })) : [];
        
        setAlarms(formattedAlarms);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to load alarms",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlarms();
  }, [user, toast]);

  const handleAddAlarm = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add alarms.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newAlarmTime || !newAlarmLabel || !selectedMedicationId) {
      toast({
        title: "Incomplete alarm",
        description: "Please fill in all fields to add an alarm.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add the new alarm to Supabase
      const { data, error } = await supabase
        .from('alarms')
        .insert({
          medication_id: selectedMedicationId,
          time: newAlarmTime,
          label: newAlarmLabel,
          is_active: true
        })
        .select(`
          id, 
          time, 
          label, 
          is_active,
          medication_id,
          medications(name)
        `)
        .single();
        
      if (error) throw error;
      
      // Add the new alarm to state
      const newAlarm: Alarm = {
        id: data?.id || '',
        time: data?.time || '',
        label: data?.label || '',
        isActive: data?.is_active || false,
        medicationName: data?.medications?.name
      };
      
      setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
      setNewAlarmTime('');
      setNewAlarmLabel('');
      setAlarmDialogOpen(false);
      
      toast({
        title: "Alarm added",
        description: "Your medication alarm has been scheduled.",
      });
    } catch (error) {
      console.error('Error adding alarm:', error);
      toast({
        title: "Failed to add alarm",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="flex flex-col items-center justify-between">
        <Clock />
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {user ? (
            <UserMenu />
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
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
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Authentication Required",
                      description: "Please sign in to add alarms.",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  if (medications.length === 0) {
                    toast({
                      title: "No medications",
                      description: "Please add a medication first before setting an alarm.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setAlarmDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {user ? (
                alarms.length > 0 ? (
                  alarms.map((alarm) => (
                    <AlarmCard key={alarm.id} alarm={alarm} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-medium text-muted-foreground mb-2">No alarms set</h3>
                    <p className="text-sm text-muted-foreground">
                      {medications.length > 0 
                        ? "Click the + button to add your first alarm" 
                        : "Add medications first to set up alarms"}
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <h3 className="font-medium mb-3">Sign in to view and manage your alarms</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your medication alarms will be displayed here after you sign in
                  </p>
                  <Link to="/auth">
                    <Button variant="outline" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Link to="/analytics">
              <Button variant="outline" className="gap-2">
                <span>Analytics</span>
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
            <div className="space-y-2">
              <label className="block text-sm font-medium">Medication</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedMedicationId}
                onChange={(e) => setSelectedMedicationId(e.target.value)}
                required
              >
                <option value="">Select a medication</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>{med.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Time</label>
              <Input 
                type="time" 
                value={newAlarmTime} 
                onChange={(e) => setNewAlarmTime(e.target.value)} 
                required 
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Label</label>
              <Input 
                type="text" 
                placeholder="Alarm Label" 
                value={newAlarmLabel} 
                onChange={(e) => setNewAlarmLabel(e.target.value)} 
                required 
                className="w-full" 
              />
            </div>
            
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
