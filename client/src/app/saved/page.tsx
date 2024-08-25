"use client";

// pages/saved-plan.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Workout {
  day: string;
  workout: {
    distance: number;
    description: string;
  };
}

interface Week {
  week: number;
  workouts: Workout[];
}

interface TrainingPlan {
  createdAt: string;
  weeks: number;
  targetTime: number;
  trainingPlan: Week[];
}

export default function SavedPlan() {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlan = async () => {
      const token = Cookies.get('accessToken'); 
      const userId = Cookies.get('userId');

      console.log("fetching plan...")
      try {
        const response = await axios.get<TrainingPlan>(`http://localhost:5000/api/db/plans/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoading(false);

        setTrainingPlan(response.data);
      } catch (error) {
        console.error('Error fetching the saved plan:', error);
      }
    };

    fetchSavedPlan();
  });

  const formatWorkoutContent = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  if (loading) {
    return <div className="text-cyan-300">Loading...</div>;
  }

  if (!trainingPlan) {
    return <div className="text-cyan-300">No saved plan found.</div>;
  }

  return (
    <div className="min-h-screen bg-wavy-gradient text-gray-light flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-cyan-light">Your Training Plan</h1>
      <div className="space-y-8 w-full max-w-2xl">
        {trainingPlan.trainingPlan.map((week) => (
          <div
            key={week.week}
            className="bg-blue-darker p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-cyan-light">
              Week {week.week}
            </h2>
            <div className="space-y-4">
              {week.workouts.map((workout, index) => (
                <div
                  key={index}
                  className="bg-cyan-darkest p-4 rounded text-gray-light border border-[--cyan]"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan">{formatWorkoutContent(workout.day)}:</strong>
                    <span>{workout.workout.distance} miles</span>
                  </div>
                  <p className="mt-2">{formatWorkoutContent(workout.workout.description)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}