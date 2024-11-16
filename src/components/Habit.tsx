import React, { useState } from 'react';

export type Habit = {
  name: string;
  frequency: string; // e.g., "daily", "weekly"
  streak: number;
  bestStreak: number;
  history: number; // Number of successful completions in the current streak
};

type HabitProps = {
  habits: Habit[];
  updateHabit: (index: number, habit: Habit) => void;
  addHabit: (habit: Habit) => void;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

const HabitComponent = ({ habits, updateHabit, addHabit, setHabits }: HabitProps) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');

  const handleCompleteHabit = (index: number) => {
    const habit = habits[index];

    // Update history (increment by 1) and streak
    const updatedHistory = habit.history + 1;
    const updatedStreak = habit.streak + 1;

    updateHabit(index, {
      ...habit,
      history: updatedHistory,
      streak: updatedStreak,
      bestStreak: Math.max(habit.bestStreak, updatedStreak),
    });
  };

  const handleMissHabit = (index: number) => {
    const habit = habits[index];

    // Reset streak and history
    updateHabit(index, {
      ...habit,
      history: 0,
      streak: 0,
    });
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName.trim(),
      frequency: newHabitFrequency,
      streak: 0,
      bestStreak: 0,
      history: 0, // Initialize history as 0
    });

    setNewHabitName('');
    setNewHabitFrequency('daily');
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Habits</h2>
      <div className="flex flex-wrap mb-6 gap-y-2">
        <input
          type="text"
          placeholder="New Habit Name"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="w-full px-4 py-2 mr-2 border rounded"
        />
        <select
          value={newHabitFrequency}
          onChange={(e) => setNewHabitFrequency(e.target.value)}
          className="px-4 py-2 mr-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button
          onClick={handleAddHabit}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Add Habit
        </button>
      </div>

      {habits.map((habit, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center w-full gap-4">
            <h3 className="text-lg font-bold">{habit.name}</h3>
            <button onClick={() => setHabits(habits.filter((_, i) => i !== index))}>
              <i className="bi bi-trash3"></i>
            </button>
          </div>
          <p className="text-xs">
            Frequency: {habit.frequency} | Current Streak: {habit.streak} | Best
            Streak: {habit.bestStreak}
          </p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {Array.from({ length: habit.history }, (_, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-sm bg-green-500"
              />
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleCompleteHabit(index)}
              className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
            >
              Mark as Done
            </button>
            <button
              onClick={() => handleMissHabit(index)}
              className="px-4 py-2 text-white bg-red-500 rounded"
            >
              Missed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitComponent;
