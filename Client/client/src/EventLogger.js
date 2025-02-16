import React, { useState, useEffect } from "react";

const EventLogger = ({ events, startTime }) => {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    if (isStarted) {
      const now = Date.now(); // Время старта
      events.forEach((event) => {
        const delay = event.time - (now - startTime); // Задержка относительно старта
        if (delay >= 0) {
          setTimeout(() => {
            console.log(`Value: ${event.value}`);
          }, delay);
        }
      });
    }
  }, [isStarted, events, startTime]);

  return <button onClick={handleStart}>Start</button>;
};

export default EventLogger;
