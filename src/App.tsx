import { useEffect, useState } from 'react';
import Settings, { TimerSetting } from './components/Settings';
import Home from './components/Home';
import HabitComponent, { Habit } from './components/Habit';

function App() {
  document.title = 'OpenPomo | A Privacy-First Pomodoro Timer & Habit Tracker';

  const [usedSlugs, setUsedSlugs] = useState<Array<string>>([])
  const [currentSection, setCurrentSection] = useState<string>('Timer');
  const [timerSettings, setTimerSettings] = useState<TimerSetting[]>(() => {
    const saved = localStorage.getItem('appState');
    if (saved) {
      try {
        return JSON.parse(saved).timerSettings || [
          { name: "Work", value: 25, recommended: [25, 30, 45] },
          { name: "Rest", value: 5, recommended: [5, 10, 15] },
          { name: "Long Rest", value: 15, recommended: [15, 20, 30] },
        ];
      } catch {
        return [
          { name: "Work", value: 25, recommended: [25, 30, 45] },
          { name: "Rest", value: 5, recommended: [5, 10, 15] },
          { name: "Long Rest", value: 15, recommended: [15, 20, 30] },
        ];
      }
    }
    return [
      { name: "Work", value: 25, recommended: [25, 30, 45] },
      { name: "Rest", value: 5, recommended: [5, 10, 15] },
      { name: "Long Rest", value: 15, recommended: [15, 20, 30] },
    ];
  });


  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('appState');
    if (saved) {
      try {
        return JSON.parse(saved).habits || [];
      } catch {
        return [];
      }
    }
    return [];
  });


  const updateHabit = (index: number, updatedHabit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) => (i === index ? updatedHabit : habit))
    );
  };

  const addHabit = (newHabit: Habit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const updateSetting = (index: number, newValue: number) => {
    setTimerSettings((prevSettings) =>
      prevSettings.map((setting, i) =>
        i === index ? { ...setting, value: newValue } : setting
      )
    );
  };


  const renderSection = () => {
    switch (currentSection) {
      case 'Timer':
        return <Home timerSettings={timerSettings}></Home>;
      case 'Habits':
        return <HabitComponent setHabits={setHabits} habits={habits} updateHabit={updateHabit} addHabit={addHabit}></HabitComponent>;
      case 'Settings':
        return <Settings updateSetting={updateSetting} timerSettings={timerSettings} habits={habits}></Settings>
      default:
        return <div>Welcome to OpenPomo!</div>;
    }
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const appState = { habits, timerSettings };
    localStorage.setItem('appState', JSON.stringify(appState));
  }, [habits, timerSettings]);

  const getQueryParam = (param: string) => {
    const query = new URLSearchParams(window.location.search);
    return query.get(param);
  };

  useEffect(() => {
    const transmissionData = getQueryParam('transmissionData')
    if (!transmissionData) return;

    try {
      // Decode and parse the transmission data
      const decodedData = JSON.parse(decodeURIComponent(transmissionData));
      console.log('Decoding transmission data')

      if (decodedData.safetySlug && !usedSlugs.includes(decodedData.safetySlug)) {
        // If the safetySlug is new, load the data into state
        setHabits(decodedData.habits || []);
        setTimerSettings(decodedData.timerSettings || []);

        // Mark the safetySlug as used
        const updatedSlugs = [...usedSlugs, decodedData.safetySlug];
        setUsedSlugs(updatedSlugs);

        // Save the updated list of slugs to local storage
        localStorage.setItem('usedSafetySlugs', JSON.stringify(updatedSlugs));
      } else {
        console.log('Safety slug already used, ignoring transmission data.');
        console.log('safetySlug:', decodedData.safetySlug);
        console.log('usedSlugs:', usedSlugs);
      }
    } catch (error) {
      console.error('Failed to parse transmission data:', error);
    }


  }, [usedSlugs])

  return (
    <div className="flex flex-col w-screen">
      <div className="flex items-center justify-between w-full p-4 border-b h-14">
        <div className="text-xl font-bold">OpenPomo</div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentSection('Timer')} className={`${currentSection === 'Timer' ? 'underline' : ''}`}>
            Timer
          </button>
          <button onClick={() => setCurrentSection('Habits')} className={`${currentSection === 'Habits' ? 'underline' : ''}`}>
            Habits
          </button>
          <button onClick={() => setCurrentSection('Settings')} className={`${currentSection === 'Settings' ? 'underline' : ''}`}>
            Settings
          </button>
        </div>
      </div>
      <div className="flex-grow p-6">{renderSection()}</div>
    </div>
  );
}

export default App;
