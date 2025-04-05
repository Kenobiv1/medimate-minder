
import { ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';

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

        <div className="text-center py-8">
          <h3 className="font-medium text-muted-foreground mb-2">No medication history yet</h3>
          <p className="text-sm text-muted-foreground">
            Your medication history will appear here once you start taking medications
          </p>
        </div>
      </main>
    </div>
  );
};

export default History;
