import { useEffect, useState } from "react";

export const useOtpTimer = (initial = 30) => {
  const [time, setTime] = useState(0);

  const start = () => setTime(initial);

  useEffect(() => {
    if (time === 0) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  return { time, start };
};

export const maskEmail = (email) => {
  const [name, domain] = email.split("@");
  return `${name[0]}****@${domain}`;
};