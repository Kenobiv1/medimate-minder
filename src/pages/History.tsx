
import { ScrollText, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const demoHistory = [
  {
    id: '1',
    medication: 'Aspirin',
    date: '2024-03-10',
    time: '09:00',
    status: 'taken',
  },
  {
    id: '2',
    medication: 'Vitamin D',
    date: '2024-03-10',
    time: '13:00',
    status: 'missed',
  },
  // Add more demo entries
];

const History = () => {
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
            <ScrollText className="w-8 h-8" />
            Medication History
          </h1>
        </div>

        <div className="grid gap-4">
          {demoHistory.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{entry.medication}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {entry.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {entry.time}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  entry.status === 'taken' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {entry.status === 'taken' ? 'Taken' : 'Missed'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;
