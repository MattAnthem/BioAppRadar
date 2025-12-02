import { useEffect, useState } from "react";

export function useRwandaClock() {
    const [rwandaTime, setRwandaTime] = useState<string>('');

    useEffect(() => {
        const update = () => {
          const now = new Date();
    
          const rwandaTime = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Africa/Kigali",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(now);
    
          setRwandaTime(rwandaTime.replace(",", ""));
        };
    
        update(); 
        const interval = setInterval(update, 1000);
    
        return () => clearInterval(interval);
      }, []);
      
    return rwandaTime;
}