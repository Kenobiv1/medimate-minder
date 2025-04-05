
import React, { useState, useEffect } from 'react';
import { Plus, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import AlarmCard, { Alarm } from '@/components/AlarmCard';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  alarms: Alarm[];
}

const Medications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMedication, setEditMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    alarms: [] as Alarm[],
  });
  // State for new alarm inputs
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');

  // Fetch medications from Supabase
  useEffect(() => {
    async function fetchMedications() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch medications
        const { data: medsData, error: medsError } = await supabase
          .from('medications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (medsError) throw medsError;
        
        // Fetch alarms for each medication
        const medsWithAlarms = await Promise.all(
          (medsData || []).map(async (med) => {
            const { data: alarmData, error: alarmError } = await supabase
              .from('alarms')
              .select('*')
              .eq('medication_id', med.id);
              
            if (alarmError) throw alarmError;
            
            return {
              ...med,
              alarms: (alarmData || []).map(alarm => ({
                id: alarm.id,
                time: alarm.time,
                label: alarm.label,
                isActive: alarm.is_active
              }))
            };
          })
        );
        
        setMedications(medsWithAlarms);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: "Failed to load medications",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchMedications();
  }, [user, toast]);

  // Open dialog for adding a new medication
  const handleAddMedicationClick = () => {
    setFormData({ name: '', dosage: '', alarms: [] });
    setEditMedication(null);
    setDialogOpen(true);
  };

  // Open dialog for editing an existing medication
  const handleConfigureMedicationClick = (medication: Medication) => {
    setEditMedication(medication);
    setFormData({ name: medication.name, dosage: medication.dosage, alarms: medication.alarms });
    setDialogOpen(true);
  };

  // Add a new alarm to the form
  const handleAddAlarm = () => {
    if (newAlarmTime.trim() !== '' && newAlarmLabel.trim() !== '') {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        label: newAlarmLabel,
        isActive: true,
      };
      setFormData((prev) => ({
        ...prev,
        alarms: [...prev.alarms, newAlarm],
      }));
      setNewAlarmTime('');
      setNewAlarmLabel('');
    } else {
      toast({
        title: "Incomplete Alarm",
        description: "Please enter both time and label for the alarm.",
        variant: "destructive",
      });
    }
  };

  // Remove an alarm from the form
  const handleRemoveAlarm = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      alarms: prev.alarms.filter((alarm) => alarm.id !== id),
    }));
  };

  // Handle form submission for adding/updating a medication
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to save medications.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (editMedication) {
        // Update existing medication
        const { error: medError } = await supabase
          .from('medications')
          .update({
            name: formData.name,
            dosage: formData.dosage,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editMedication.id);
          
        if (medError) throw medError;
        
        // Delete all existing alarms for this medication
        const { error: deleteError } = await supabase
          .from('alarms')
          .delete()
          .eq('medication_id', editMedication.id);
          
        if (deleteError) throw deleteError;
        
        // Add new alarms
        if (formData.alarms.length > 0) {
          const alarmsToInsert = formData.alarms.map(alarm => ({
            medication_id: editMedication.id,
            time: alarm.time,
            label: alarm.label,
            is_active: alarm.isActive
          }));
          
          const { error: insertError } = await supabase
            .from('alarms')
            .insert(alarmsToInsert);
            
          if (insertError) throw insertError;
        }
        
        toast({
          title: "Medication updated",
          description: `${formData.name} was updated successfully.`,
        });
      } else {
        // Add new medication
        const { data: newMed, error: medError } = await supabase
          .from('medications')
          .insert({
            user_id: user.id,
            name: formData.name,
            dosage: formData.dosage,
          })
          .select()
          .single();
          
        if (medError) throw medError;
        
        // Add alarms for the new medication
        if (formData.alarms.length > 0 && newMed) {
          const alarmsToInsert = formData.alarms.map(alarm => ({
            medication_id: newMed.id,
            time: alarm.time,
            label: alarm.label,
            is_active: alarm.isActive
          }));
          
          const { error: alarmError } = await supabase
            .from('alarms')
            .insert(alarmsToInsert);
            
          if (alarmError) throw alarmError;
        }
        
        toast({
          title: "Medication added",
          description: `${formData.name} was added successfully.`,
        });
      }
      
      // Refresh the medications list
      const { data: medsData, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (medsError) throw medsError;
      
      // Fetch alarms for each medication
      const medsWithAlarms = await Promise.all(
        (medsData || []).map(async (med) => {
          const { data: alarmData, error: alarmError } = await supabase
            .from('alarms')
            .select('*')
            .eq('medication_id', med.id);
            
          if (alarmError) throw alarmError;
          
          return {
            ...med,
            alarms: (alarmData || []).map(alarm => ({
              id: alarm.id,
              time: alarm.time,
              label: alarm.label,
              isActive: alarm.is_active
            }))
          };
        })
      );
      
      setMedications(medsWithAlarms);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving medication:', error);
      toast({
        title: "Failed to save medication",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="flex items-center justify-between">
        <Link 
          to="/" 
          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </header>
      <main className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Pill className="w-8 h-8" />
            My Medications
          </h1>
          <Button size="icon" className="rounded-full" onClick={handleAddMedicationClick}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {medications.length > 0 ? (
              medications.map((medication) => (
                <Card key={medication.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{medication.name}</h2>
                      <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                    </div>
                    <Button variant="outline" onClick={() => handleConfigureMedicationClick(medication)}>
                      Configure
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Alarms</h3>
                    {medication.alarms.length > 0 ? (
                      <div className="grid gap-2">
                        {medication.alarms.map((alarm) => (
                          <AlarmCard key={alarm.id} alarm={alarm} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No alarms set.</p>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <h3 className="font-medium text-muted-foreground mb-2">No medications added yet</h3>
                <p className="text-sm text-muted-foreground">Add your first medication to set up reminders</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Medication Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMedication ? "Edit Medication" : "Add New Medication"}
            </DialogTitle>
            <DialogDescription>
              {editMedication
                ? "Update the details of the medication and its alarms."
                : "Enter the details for the new medication. You can add alarms below (optional)."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Dosage</label>
              <Input 
                type="text" 
                value={formData.dosage} 
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            {/* Alarms Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Alarms</label>
              {formData.alarms.length > 0 && (
                <ul className="space-y-1">
                  {formData.alarms.map((alarm) => (
                    <li key={alarm.id} className="flex items-center justify-between border-b pb-1">
                      <span className="text-sm text-foreground">
                        {alarm.time} – {alarm.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlarm(alarm.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col sm:flex-row gap-2 border p-2 rounded-md">
                <Input 
                  type="time" 
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="flex-1"
                />
                <Input 
                  type="text" 
                  placeholder="Label (e.g. Morning Medication)"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddAlarm}>
                  Add Alarm
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="outline">
                {editMedication ? "Update Medication" : "Add Medication"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medications;
