"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

export interface TrainingPlan {
  createdAt: string;
  weeks: number;
  targetTime: number;
  trainingPlan: Week[];
}

interface TrainingPlanContextType {
  trainingPlan: TrainingPlan | null;
  setTrainingPlan: (plan: TrainingPlan | null) => void;
}

const TrainingPlanContext = createContext<TrainingPlanContextType | undefined>(undefined);

export const TrainingPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);

  return (
    <TrainingPlanContext.Provider value={{ trainingPlan, setTrainingPlan }}>
      {children}
    </TrainingPlanContext.Provider>
  );
};

export const useTrainingPlan = () => {
  const context = useContext(TrainingPlanContext);
  if (context === undefined) {
    throw new Error('useTrainingPlan must be used within a TrainingPlanProvider');
  }
  return context;
};
