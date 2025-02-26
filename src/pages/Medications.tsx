
import { Plus, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import AlarmCard, { Alarm } from '@/components/AlarmCard';
import { useToast } from "@/hooks/use-toast";

const demoMedications = [
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

  const handleAddMedication = () => {
    toast({
      title: "Add New Medication",
      description: "Coming soon: Add new medication form",
    });
  };

  const handleConfigureMedication = (medicationName: string) => {
    toast({
      title: "Configure Medication",
      description: `Coming soon: Configure ${medicationName} settings`,
    });
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
          <Button size="icon" className="rounded-full" onClick={handleAddMedication}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid gap-6">
          {demoMedications.map((medication) => (
            <Card key={medication.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{medication.name}</h2>
                  <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleConfigureMedication(medication.name)}
                >
                  Configure
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Alarms</h3>
                <div className="grid gap-2">
                  {medication.alarms.map((alarm) => (
                    <AlarmCard key={alarm.id} alarm={alarm} />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Medications;
