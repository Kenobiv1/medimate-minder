
import { Settings as SettingsIcon, Moon, Sun, BellRing, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleEmergencyCall = () => {
    toast({
      title: "Emergency Contact",
      description: "Calling emergency contact...",
      variant: "destructive",
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
            <SettingsIcon className="w-8 h-8" />
            Settings
          </h1>
        </div>

        <div className="grid gap-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Display</h2>
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Large Text</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase text size for better readability
                  </p>
                </div>
                <Switch />
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound for medication reminders
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Emergency Contact: +1 (555) 0123</span>
                </div>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="w-full gap-2"
                  onClick={handleEmergencyCall}
                >
                  <Phone className="w-5 h-5" />
                  Call Emergency Contact
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
