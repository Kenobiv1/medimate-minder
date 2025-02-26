import React, { useState } from 'react';
import { Plus, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import AlarmCard, { Alarm } from '@/components/AlarmCard';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
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

const initialMedications: Medication[] = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '100mg',
    alarms: [
      {
        id: '1',
        time: '09:00',
        label: 'Morning Medication',
        isActive: true,
      }
    ]
  },
  {
    id: '2',
    name: 'Vitamin D',
    dosage: '1000 IU',
    alarms: [
      {
        id: '2',
        time: '13:00',
        label: 'Afternoon Medication',
        isActive: true,
      }
    ]
  }
];

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMedication, setEditMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    alarms: [] as Alarm[],
  });
  // State for new alarm inputs (optional)
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');

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

  // Add a new alarm to the form if both time and label are provided
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
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMedication) {
      // Update existing medication
      setMedications((prev) =>
        prev.map((med) =>
          med.id === editMedication.id ? { ...med, ...formData } : med
        )
      );
      toast({
        title: "Medication updated",
        description: `${formData.name} was updated successfully.`,
      });
    } else {
      // Add new medication
      const newMed: Medication = {
        id: Date.now().toString(),
        ...formData,
      };
      setMedications((prev) => [...prev, newMed]);
      toast({
        title: "Medication added",
        description: `${formData.name} was added successfully.`,
      });
    }
    setDialogOpen(false);
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
        <div className="grid gap-6">
          {medications.map((medication) => (
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
          ))}
        </div>
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
