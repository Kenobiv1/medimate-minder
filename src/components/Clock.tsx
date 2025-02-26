
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-2">
      <div className="text-6xl font-bold tracking-tight text-primary animate-float">
        {format(time, 'HH:mm')}
      </div>
      <div className="text-2xl text-muted-foreground">
        {format(time, 'EEEE, MMMM d')}
      </div>
    </div>
  );
};

export default Clock;
