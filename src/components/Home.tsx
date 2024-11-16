import { useState, useEffect } from 'react';
import { TimerSetting } from './Settings';
import Hangman from './Hangman';

type HomeProps = {
  timerSettings: TimerSetting[];
};

const Home = ({ timerSettings }: HomeProps) => {
  const [currentPhase, setCurrentPhase] = useState(0); // Tracks the current phase in the loop
  const [timeLeft, setTimeLeft] = useState(timerSettings[0].value * 60); // Initial time (in seconds)
  const [isRunning, setIsRunning] = useState(false);

  const phases = ['Work', 'Rest', 'Work', 'Rest', 'Work', 'Long Rest'];

  // Update timer when `isRunning` or `timeLeft` changes
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    }
    if (timeLeft === 0) {
      moveToNextPhase();
    }
    return () => clearInterval(timer); // remove timer
  }, [isRunning, timeLeft]);

  const moveToNextPhase = () => {
    const nextPhase = (currentPhase + 1) % phases.length;
    setCurrentPhase(nextPhase);
    setTimeLeft(timerSettings[nextPhase % 3].value * 60);
  };

  // Display (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-xl font-bold">{phases[currentPhase]} Phase</h3>
        <div className="my-4 text-4xl font-bold">{formatTime(timeLeft)}</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-10 h-10 text-white rounded ${!isRunning ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {!isRunning ? 
              <i className='text-3xl bi bi-play'></i>
              : 
              <i className='text-3xl bi bi-pause'></i>
              }
          </button>
          <button
            onClick={() => {
              if (!isRunning) {
                setCurrentPhase(0);
              } else {
                setIsRunning(false);
                setTimeLeft(timerSettings[currentPhase % 3].value * 60); // Reset to current phase time
              }
            }}
            className="w-10 h-10 text-white bg-gray-500 rounded"
          >
            <i className='bi bi-arrow-clockwise'></i>
          </button>
        </div>
        { ["Rest", "Long Rest"].includes(phases[currentPhase]) &&
          <Hangman></Hangman>
        }
      </div>
    </div>
  );
};

export default Home;
