import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference <= 0) {
        setHasLaunched(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (hasLaunched) {
    return (
      <div className="text-center font-orbitron border border-[#3b82f6]/40 rounded-lg p-6 bg-slate-50/80 glow-shadow-blue max-w-xl mx-auto">
        <h3 className="text-2xl text-[#3b82f6] font-extrabold animate-pulse tracking-wider mb-2">LAUNCH INITIATED</h3>
        <p className="text-sm text-black">Superconducting active magnetic core is currently online at target grid cells.</p>
      </div>
    );
  }

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="flex items-center justify-center space-x-3 sm:space-x-6">
      {timeBlocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="relative glass-panel rounded-lg w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center border border-blue-500 overflow-hidden shadow-2xl">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            {/* Value Ticker */}
            <span className="font-orbitron font-extrabold text-2xl sm:text-5xl text-blue-600">
              {String(block.value).padStart(2, '0')}
            </span>

            {/* Futuristic Tech Dots */}
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-600/50 rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-600/50 rounded-full"></div>
          </div>
          <span className="font-orbitron text-[9px] sm:text-xs text-black font-bold tracking-widest mt-2">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;

