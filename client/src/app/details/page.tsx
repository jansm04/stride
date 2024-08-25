"use client";

import { useTrainingPlan } from "@/lib/context/plan-context";
import { MouseEvent, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PlanDetails() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { trainingPlan } = useTrainingPlan();

  if (!trainingPlan) {
    return (
      <div className="min-h-screen bg-blue-dark text-white flex items-center justify-center">
        <p>No training plan available</p>
      </div>
    );
  }

  const handleSavePlan = async (e: MouseEvent) => {
    e.preventDefault();

    // simulate api call
    // setIsLoading(true)
    // setIsSaved(false)
    // setTimeout(function() {
    //   setIsLoading(false)
    //   setIsSaved(true)
    // }, 1000);

    setIsLoading(true);
    if (isSaved) setIsSaved(false);

    const token = Cookies.get('accessToken');
    const userId = Cookies.get('userId');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      axios.post(`http://localhost:5000/api/db/plans/${userId}`, 
        trainingPlan, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(() => {
          setIsSaved(true);
        }).catch((error) => {
          console.log(error);
          setError("An error occurred trying to save your plan.");
        }).finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error saving the plan:', error);
    } 
  }

  const formatWorkoutContent = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className="min-h-screen bg-wavy-gradient text-gray-light flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-cyan-light">Your Training Plan</h1>
      <div className="flex items-center my-4 w-full max-w-2xl">
        <button
          className="w-fit py-2 px-4 bg-cyan hover:bg-[--cyan-dark] text-gray-900 font-bold rounded focus:outline-none transition-colors duration-200"
          onClick={handleSavePlan}
          >
          Save Plan
        </button>
        {isLoading && (
          <div className="ml-auto flex justify-center mt-4">
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
        {error && (
          <div className="ml-auto">
            <p className='text-sm text-red-500 align-middle'>
              {error}
            </p>
          </div>
        )}
        {isSaved && (
          <div className="ml-auto">
            <p className='text-sm text-gray-light align-middle'>
              Your training plan has been successfully saved.
            </p>
          </div>
        )}
      </div>

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