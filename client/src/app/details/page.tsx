"use client";

import { useTrainingPlan } from "@/lib/context/plan-context";

export default function PlanDetails() {
  const { trainingPlan } = useTrainingPlan();

  if (!trainingPlan) {
    return (
      <div className="min-h-screen bg-blue-dark text-white flex items-center justify-center">
        <p>No training plan available</p>
      </div>
    );
  }

  const formatWorkoutContent = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
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
  );
};