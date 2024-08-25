"use client";

import { TrainingPlan, useTrainingPlan } from '@/lib/context/plan-context';
import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';

interface PlanData {
  weeks: number;
  frequency: number;
  targetTime: number;
  firstLongRun: number;
  longRunDay: string;
}

export default function GeneratePlan() {
  const [weeks, setWeeks] = useState<number>(16);
  const [frequency, setFrequency] = useState<number>(3);
  const [hours, setHours] = useState<number>(4);
  const [minutes, setMinutes] = useState<number>(0);
  const [firstLongRun, setFirstLongRun] = useState<number>(8);
  const [longRunDay, setLongRunDay] = useState<string>('sunday');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { trainingPlan, setTrainingPlan } = useTrainingPlan();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setTrainingPlan(null); // clear previous plan if exists
    setIsLoading(true);

    const targetTime = hours * 60 + minutes; // Convert hours and minutes to total minutes

    const planData: PlanData = {
      weeks,
      frequency,
      targetTime,
      firstLongRun,
      longRunDay,
    };

    try {
      const response = await fetch('http://localhost:3002/api/tpg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      setIsLoading(false)

      if (response.ok) {
        const data: TrainingPlan = await response.json();
        console.log(data);
        setTrainingPlan(data);
      } else {
        console.error('Failed to generate plan');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-wavy-gradient text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-cyan-light">Generate Your Training Plan</h1>
      <form 
        onSubmit={handleSubmit} 
        className="bg-blue-darker p-6 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <div className="flex flex-col">
          <label className="mb-2 text-gray-light">Weeks: {weeks}</label>
          <input
            type="range"
            min="12"
            max="20"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            required
            className="accent-[--cyan]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-gray-light">Runs Per Week: {frequency}</label>
          <input
            type="range"
            min="2"
            max="7"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            required
            className="accent-[--cyan]"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-2 text-gray-light">Target Time:</label>
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label className="text-gray-light text-xs">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="0"
                max="24"
                required
                className="p-2 rounded bg-blue-darker text-white border border-[--cyan] focus:outline-none focus:ring-2 focus:ring-[--cyan-light]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-light text-xs">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                min="0"
                max="59"
                required
                className="p-2 rounded bg-blue-darker text-white border border-[--cyan] focus:outline-none focus:ring-2 focus:ring-[--cyan-light]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-gray-light">First Long Run (km):</label>
          <input
            type="number"
            value={firstLongRun}
            onChange={(e) => setFirstLongRun(Number(e.target.value))}
            required
            className="p-2 rounded bg-blue-darker text-white border border-[--cyan] focus:outline-none focus:ring-2 focus:ring-[--cyan-light]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-gray-light">Long Run Day:</label>
          <select
            value={longRunDay}
            onChange={(e) => setLongRunDay(e.target.value)}
            className="p-2 rounded bg-blue-darker text-white border border-[--cyan] focus:outline-none focus:ring-2 focus:ring-[--cyan-light]"
          >
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-cyan hover:bg-[--cyan-dark] text-gray-900 font-bold rounded focus:outline-none transition-colors duration-200"
        >
          Generate Plan
        </button>      
        {(isLoading || trainingPlan) && (
          <div>
            <div className="border-t border-cyan-dark mt-10 mb-6"></div>
            {isLoading && (
              <div className="flex justify-center mt-4">
                <svg
                  className="animate-spin h-5 w-5 text-cyan-light"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8l5.657-5.657A8 8 0 114 12z"
                  ></path>
                </svg>
                <span className="ml-2 text-cyan-light">Loading...</span>
              </div>
            )}
            {trainingPlan && (
              <div className="flex items-center">
              <div>
                <p className='text-sm text-gray-light align-middle'>
                  Your training plan has been successfully generated.
                </p>
              </div>
              <div className='ml-auto'>
                <Link href='/details'>
                  <div 
                    className="w-fit py-2 px-4 bg-cyan hover:bg-[--cyan-dark] text-gray-900 font-bold rounded focus:outline-none transition-colors duration-200">
                      View
                  </div>
                </Link>
              </div>
            </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
