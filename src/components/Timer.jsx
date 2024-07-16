
import React, { useState, useEffect } from 'react';
import '../css/Timer.css';

const Timer = ({ nextReminderTime }) => {
  const calculateTimeLeft = () => {
    const difference = nextReminderTime - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="timer">
      <h2>Next Water Break In:</h2>
      {timeLeft.hours || timeLeft.minutes || timeLeft.seconds ? (
        <p>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</p>
      ) : (
        <p>It's time to drink water!</p>
      )}
    </div>
  );
};

export default Timer;
